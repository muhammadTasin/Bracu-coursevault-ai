import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";

// Zod Schema to validate AI output structured JSON
const aiResponseSchema = z.object({
  normalizedCode: z.string().min(1).max(20),
  courseTitle: z.string().min(1).max(100),
  description: z.string().max(500).optional().or(z.literal("")),
  topics: z.array(z.string()).max(10),
  suggestedResources: z.array(
    z.object({
      title: z.string().min(1).max(150),
      url: z.string().url("Must be a valid URL starting with http/https"),
      type: z.enum(["GitHub", "YouTube", "PDF/Notes", "Website", "Practice", "Other"]),
      description: z.string().max(300).optional().or(z.literal("")),
    })
  ).max(5),
});

type AIResponse = z.infer<typeof aiResponseSchema>;

// Safe failover models list from major providers
const OPENROUTER_MODELS = [
  "google/gemini-2.5-flash",
  "openai/gpt-4o-mini",
  "anthropic/claude-3-haiku",
  "qwen/qwen-2.5-72b-instruct"
];

export async function POST(request: Request) {
  try {
    // 1. Session verification check
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized access." },
        { status: 401 }
      );
    }

    // 2. Parse request payload
    const body = await request.json();
    const { query } = body;

    if (!query || typeof query !== "string" || !query.trim()) {
      return NextResponse.json(
        { error: "Invalid course query." },
        { status: 400 }
      );
    }

    const normalizedQuery = query.trim();

    // 3. Build the prompt
    const prompt = `
Find and structure information for BRAC University (BRACU) undergraduate level "${normalizedQuery}" course.
Analyze whether the query refers to a course code (like cse427, CSE 220, CSE 370) or a course title (like machine learning, data structures, algorithms).

You MUST return a JSON object matching this schema:
{
  "normalizedCode": "Normalized code of the course, e.g. CSE 427, CSE 220, CSE 370. Do not include spaces inside the acronym, e.g. use 'CSE 427' not 'CSE427'.",
  "courseTitle": "Full official course title, e.g. Machine Learning, Data Structures, Database Systems.",
  "description": "A brief 1-2 sentence description of the course syllabus.",
  "topics": ["Array of up to 6 major topics/chapters covered in this course syllabus, e.g., Linear Regression, Stacks & Queues, etc."],
  "suggestedResources": [
    {
      "title": "A descriptive title of the resource link, max 100 chars.",
      "url": "A real, active, valid URL helper starting with http:// or https://. Provide generic query links if you do not know a specific link, e.g. https://github.com/search?q=bracu+cse427",
      "type": "Must be exactly one of: 'GitHub', 'YouTube', 'PDF/Notes', 'Website', 'Practice', 'Other'.",
      "description": "A short 1-sentence description of what this resource is and how it helps."
    }
  ]
}

Important Rules:
- Return ONLY the raw JSON object. Do not wrap it in markdown block quotes like \`\`\`json ... \`\`\`. 
- Ensure that the "type" field in suggestedResources contains ONLY the exact string options: 'GitHub', 'YouTube', 'PDF/Notes', 'Website', 'Practice', 'Other'.
- Do not return empty fields. Generate realistic study resource URLs referencing GitHub, YouTube, or PDF tutorial sites related to the course.
`;

    // 4. Try Gemini Primary (Max 3.5s timeout)
    if (process.env.GEMINI_API_KEY) {
      try {
        console.log("Calling primary Gemini AI Engine...");
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ 
          model: "gemini-1.5-flash",
          generationConfig: { responseMimeType: "application/json" }
        });

        // 3.5 second timeout wrapper to prevent serverless function hang
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("Gemini API call timed out")), 3500)
        );

        const result = await Promise.race([
          model.generateContent(prompt),
          timeoutPromise
        ]);

        const responseText = result.response.text();
        const cleanedText = cleanJsonText(responseText);
        const parsed = JSON.parse(cleanedText);
        const validated = aiResponseSchema.parse(parsed);

        return NextResponse.json({
          success: true,
          provider: "Gemini (Primary)",
          data: validated
        });
      } catch (geminiError) {
        console.error("Gemini primary failure:", geminiError instanceof Error ? geminiError.message : geminiError);
      }
    }

    // 5. Try OpenRouter Fallbacks (Loop through models with low 2.5s timeouts)
    if (process.env.OPENROUTER_API_KEY) {
      console.log("Entering OpenRouter Failover Chain...");
      for (const openRouterModel of OPENROUTER_MODELS) {
        try {
          console.log(`Trying OpenRouter model: ${openRouterModel}...`);
          const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
              "Content-Type": "application/json",
              "HTTP-Referer": "https://coursevault-ai.vercel.app",
              "X-Title": "CourseVault AI"
            },
            body: JSON.stringify({
              model: openRouterModel,
              messages: [{ role: "user", content: prompt }],
              response_format: { type: "json_object" }
            }),
            // 2.5 seconds timeout per model to stay well within serverless gateway limit
            signal: AbortSignal.timeout(2500)
          });

          if (response.ok) {
            const resJson = await response.json();
            const responseText = resJson.choices?.[0]?.message?.content;
            if (responseText) {
              const cleanedText = cleanJsonText(responseText);
              const parsed = JSON.parse(cleanedText);
              const validated = aiResponseSchema.parse(parsed);
              
              return NextResponse.json({
                success: true,
                provider: `OpenRouter (${openRouterModel})`,
                data: validated
              });
            }
          } else {
            console.warn(`OpenRouter model ${openRouterModel} returned error: ${response.status}`);
          }
        } catch (openRouterError) {
          console.error(`OpenRouter model ${openRouterModel} failed:`, openRouterError instanceof Error ? openRouterError.message : openRouterError);
        }
      }
    }

    // 6. Safe Local Fallback Rule Engine (If both APIs fail, time out, or are missing keys)
    console.warn("AI providers unreachable. Triggering static local database fallback...");
    const localResult = getLocalSuggestion(normalizedQuery);
    const validated = aiResponseSchema.parse(localResult);

    return NextResponse.json({
      success: true,
      provider: "Local Database Fallback",
      data: validated
    });

  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to generate suggestions.";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

// Clean markdown syntax if AI wraps the response in code blocks
function cleanJsonText(text: string): string {
  let cleaned = text.trim();
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```json\s*/i, "").replace(/```$/, "");
  }
  return cleaned.trim();
}

// Local mock database suggestion values
function getLocalSuggestion(query: string): AIResponse {
  const normalizedQuery = query.toLowerCase();
  
  let code = "CSE 101";
  let title = "Introduction to Computer Science";
  let description = "Fundamental concepts of computing and programming structures.";
  let topics = ["Variables", "Loops", "Conditions", "Functions", "Arrays"];
  
  if (normalizedQuery.includes("427") || normalizedQuery.includes("machine learning")) {
    code = "CSE 427";
    title = "Machine Learning";
    description = "Comprehensive introduction to supervised, unsupervised learning algorithms and models.";
    topics = ["Supervised Learning", "Linear Regression", "Decision Trees", "Neural Networks", "Clustering", "SVM"];
  } else if (normalizedQuery.includes("220") || normalizedQuery.includes("data structure")) {
    code = "CSE 220";
    title = "Data Structures";
    description = "Study of fundamental data structures, algorithms, and complexity analysis.";
    topics = ["Linked Lists", "Arrays & Vectors", "Stacks & Queues", "Trees", "Graphs", "Recursion"];
  } else if (normalizedQuery.includes("221") || normalizedQuery.includes("algorithm")) {
    code = "CSE 221";
    title = "Algorithms";
    description = "Design and analysis of efficient algorithms, complexity, and sorting theories.";
    topics = ["Divide and Conquer", "BFS/DFS Graphs", "Dijkstra's Shortest Path", "Greedy Algorithms", "Dynamic Programming"];
  } else if (normalizedQuery.includes("370") || normalizedQuery.includes("database")) {
    code = "CSE 370";
    title = "Database Systems";
    description = "Design and implementation of relational databases, SQL queries, and normalization.";
    topics = ["ER Diagrams", "Relational Algebra", "SQL Queries", "Normalization (1NF-BCNF)", "ACID Transactions"];
  } else {
    // Attempt code parsing, e.g. phy111 -> PHY 111
    const match = query.match(/([a-zA-Z]+)\s*(\d+)/);
    if (match) {
      code = `${match[1].toUpperCase()} ${match[2]}`;
      title = `${code} Course Folder`;
    }
  }

  const queryCodeClean = code.replace(/\s+/g, "+");

  return {
    normalizedCode: code,
    courseTitle: title,
    description,
    topics,
    suggestedResources: [
      {
        title: `${code} Syllabus Search Intent`,
        url: `https://github.com/search?q=BRACU+${queryCodeClean}`,
        type: "GitHub",
        description: "Public repositories containing assignments, lab codes, and project works."
      },
      {
        title: `${code} Study Playlist Reference`,
        url: `https://www.youtube.com/results?search_query=BRACU+${queryCodeClean}`,
        type: "YouTube",
        description: "Community playlists and video reviews matching course topics."
      }
    ]
  };
}

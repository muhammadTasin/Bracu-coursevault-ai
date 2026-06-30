import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

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

    const normalizedQuery = query.trim().toLowerCase();

    // 3. Verify server-side credentials presence (without exposing values)
    const hasGeminiKey = !!process.env.GEMINI_API_KEY;
    const hasOpenRouterKey = !!process.env.OPENROUTER_API_KEY;

    if (!hasGeminiKey && !hasOpenRouterKey) {
      console.warn("AI API credentials missing on server side. Serving fallback local metadata.");
    }

    // 4. Pre-Phase 3 Rule-Based Mock Suggestion Engine
    // Normalizes BRACU course codes, titles, and syllabus topics
    let courseCode = query.toUpperCase().replace(/\s+/g, "");
    let courseTitle = "Syllabus Selected";
    let topics: string[] = ["General syllabus", "Lecture slides", "Practice sets"];
    
    // Check for common CSE codes
    if (normalizedQuery.includes("427") || normalizedQuery.includes("machine learning")) {
      courseCode = "CSE 427";
      courseTitle = "Machine Learning";
      topics = [
        "Supervised Learning",
        "Decision Trees",
        "Linear Regression",
        "Neural Networks",
        "Clustering",
        "Model Evaluation"
      ];
    } else if (normalizedQuery.includes("220") || normalizedQuery.includes("data structure")) {
      courseCode = "CSE 220";
      courseTitle = "Data Structures";
      topics = [
        "Singly Linked Lists",
        "Doubly Linked Lists",
        "Stacks & Queues",
        "Trees & Graphs",
        "Recursion",
        "Searching & Sorting"
      ];
    } else if (normalizedQuery.includes("221") || normalizedQuery.includes("algorithm")) {
      courseCode = "CSE 221";
      courseTitle = "Algorithms";
      topics = [
        "Asymptotic Notation",
        "Divide and Conquer",
        "Graph Traversals (DFS/BFS)",
        "Dijkstra's Algorithm",
        "Greedy Techniques",
        "Dynamic Programming"
      ];
    } else if (normalizedQuery.includes("370") || normalizedQuery.includes("database")) {
      courseCode = "CSE 370";
      courseTitle = "Database Systems";
      topics = [
        "Entity-Relationship Diagrams",
        "Relational Algebra",
        "SQL Queries",
        "Normalization (1NF, 2NF, 3NF, BCNF)",
        "Transactions & ACID properties",
        "Indexing & Hashing"
      ];
    } else {
      // Normalize generic formats (e.g. cse320 -> CSE 320)
      const match = query.match(/([a-zA-Z]+)\s*(\d+)/);
      if (match) {
        courseCode = `${match[1].toUpperCase()} ${match[2]}`;
        courseTitle = `${courseCode} Course Directory`;
      }
    }

    // Return structured metadata ready for Phase 3 frontend autocomplete binding
    return NextResponse.json({
      success: true,
      apiActive: hasGeminiKey || hasOpenRouterKey,
      data: {
        queryIntent: `BRAC University undergraduate level ${courseCode} course`,
        courseCode,
        courseTitle,
        topics,
        suggestedResources: [
          {
            title: `${courseCode} GitHub Repository Workspace`,
            url: `https://github.com/search?q=BRACU+${courseCode.replace(/\s+/g, "+")}`,
            type: "GitHub",
            description: "Developer resource repositories, lab templates, and practice projects."
          },
          {
            title: `${courseCode} Video Lecture Tutorials`,
            url: `https://www.youtube.com/results?search_query=BRACU+${courseCode.replace(/\s+/g, "+")}`,
            type: "YouTube",
            description: "Detailed video explanations of semester lectures and exam reviews."
          }
        ]
      }
    });

  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to process AI suggestions.";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

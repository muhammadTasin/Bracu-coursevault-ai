"use server";

import { createClient } from "@/lib/supabase/server";
import { courseSchema, CourseInput } from "@/lib/validation";
import { Course } from "@/types";
import { revalidatePath } from "next/cache";

export interface ActionResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

// Read current user's courses
export async function getCoursesAction(): Promise<ActionResponse<Course[]>> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return { success: false, error: "Unauthorized access." };
    }

    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data: data as Course[] };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to retrieve courses.";
    return { success: false, error: message };
  }
}

// Create a new course
export async function createCourseAction(
  rawInput: CourseInput
): Promise<ActionResponse<Course>> {
  try {
    const validated = courseSchema.safeParse(rawInput);
    if (!validated.success) {
      return {
        success: false,
        error: validated.error.issues.map((e) => e.message).join(", "),
      };
    }

    const { course_code, course_title, description, tags: inputTags } = validated.data;
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return { success: false, error: "Unauthorized access." };
    }

    // Default tag based on course code
    const tagMatch = course_code.match(/[a-zA-Z]+/g);
    const primaryTag = tagMatch ? tagMatch[0].toUpperCase() : "COURSE";
    const tags = Array.from(new Set([primaryTag, "BRACU", ...(inputTags || [])]));

    const { data, error } = await supabase
      .from("courses")
      .insert({
        user_id: user.id,
        course_code,
        course_title,
        description: description || null,
        tags,
      })
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/dashboard");
    return { success: true, data: data as Course };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to create course.";
    return { success: false, error: message };
  }
}

// Update a course
export async function updateCourseAction(
  id: string,
  rawInput: CourseInput
): Promise<ActionResponse<Course>> {
  try {
    const validated = courseSchema.safeParse(rawInput);
    if (!validated.success) {
      return {
        success: false,
        error: validated.error.issues.map((e) => e.message).join(", "),
      };
    }

    const { course_code, course_title, description } = validated.data;
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return { success: false, error: "Unauthorized access." };
    }

    const { data, error } = await supabase
      .from("courses")
      .update({
        course_code,
        course_title,
        description: description || null,
      })
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/dashboard");
    revalidatePath(`/courses/${id}`);
    return { success: true, data: data as Course };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to update course.";
    return { success: false, error: message };
  }
}

// Delete a course
export async function deleteCourseAction(
  id: string
): Promise<ActionResponse<null>> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return { success: false, error: "Unauthorized access." };
    }

    const { error } = await supabase
      .from("courses")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/dashboard");
    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to delete course.";
    return { success: false, error: message };
  }
}

// Read a single course by ID
export async function getCourseByIdAction(
  id: string
): Promise<ActionResponse<Course>> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return { success: false, error: "Unauthorized access." };
    }

    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data: data as Course };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to retrieve course details.";
    return { success: false, error: message };
  }
}

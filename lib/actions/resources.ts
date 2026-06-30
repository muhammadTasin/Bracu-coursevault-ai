"use server";

import { createClient } from "@/lib/supabase/server";
import { resourceSchema, ResourceInput } from "@/lib/validation";
import { Resource } from "@/types";
import { revalidatePath } from "next/cache";

export interface ActionResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

// Read resources for selected course
export async function getResourcesAction(
  courseId: string
): Promise<ActionResponse<Resource[]>> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return { success: false, error: "Unauthorized access." };
    }

    const { data, error } = await supabase
      .from("resources")
      .select("*")
      .eq("course_id", courseId)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data: data as Resource[] };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to retrieve resources.";
    return { success: false, error: message };
  }
}

// Add resource link under a course
export async function addResourceAction(
  courseId: string,
  rawInput: ResourceInput
): Promise<ActionResponse<Resource>> {
  try {
    const validated = resourceSchema.safeParse(rawInput);
    if (!validated.success) {
      return {
        success: false,
        error: validated.error.issues.map((e) => e.message).join(", "),
      };
    }

    const { title, url, resource_type, notes } = validated.data;
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return { success: false, error: "Unauthorized access." };
    }

    const { data, error } = await supabase
      .from("resources")
      .insert({
        user_id: user.id,
        course_id: courseId,
        title,
        url,
        resource_type,
        notes: notes || null,
      })
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath(`/courses/${courseId}`);
    return { success: true, data: data as Resource };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to save resource.";
    return { success: false, error: message };
  }
}

// Delete resource
export async function deleteResourceAction(
  id: string,
  courseId: string
): Promise<ActionResponse<null>> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return { success: false, error: "Unauthorized access." };
    }

    const { error } = await supabase
      .from("resources")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath(`/courses/${courseId}`);
    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to delete resource.";
    return { success: false, error: message };
  }
}

"use server";

import { createClient } from "@/lib/supabase/server";
import { Profile } from "@/types";
import { revalidatePath } from "next/cache";

export interface ActionResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export async function getProfileAction(): Promise<ActionResponse<Profile>> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return { success: false, error: "Unauthorized access." };
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data: data as Profile };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load profile.";
    return { success: false, error: message };
  }
}

export async function updateProfileAction(
  fullName: string
): Promise<ActionResponse<Profile>> {
  try {
    if (!fullName.trim()) {
      return { success: false, error: "Name cannot be empty." };
    }

    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return { success: false, error: "Unauthorized access." };
    }

    const { data, error } = await supabase
      .from("profiles")
      .update({ full_name: fullName })
      .eq("id", user.id)
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/settings");
    return { success: true, data: data as Profile };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to update profile.";
    return { success: false, error: message };
  }
}

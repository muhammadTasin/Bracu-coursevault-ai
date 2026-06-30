"use strict";

import { z } from "zod";

export const courseSchema = z.object({
  course_code: z
    .string()
    .min(1, "Course code is required")
    .max(20, "Course code cannot exceed 20 characters")
    .trim(),
  course_title: z
    .string()
    .min(1, "Course title is required")
    .max(100, "Course title cannot exceed 100 characters")
    .trim(),
  description: z
    .string()
    .max(500, "Description cannot exceed 500 characters")
    .optional()
    .or(z.literal("")),
  tags: z.array(z.string()).optional(),
});

export const resourceSchema = z.object({
  title: z
    .string()
    .min(1, "Resource title is required")
    .max(150, "Resource title cannot exceed 150 characters")
    .trim(),
  url: z
    .string()
    .url("Please enter a valid URL (starting with http:// or https://)")
    .trim(),
  resource_type: z.enum([
    "GitHub",
    "YouTube",
    "PDF/Notes",
    "Website",
    "Practice",
    "Other",
  ]),
  notes: z
    .string()
    .max(300, "Notes cannot exceed 300 characters")
    .optional()
    .or(z.literal("")),
});

export type CourseInput = z.infer<typeof courseSchema>;
export type ResourceInput = z.infer<typeof resourceSchema>;

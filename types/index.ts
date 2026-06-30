// CourseVault AI TypeScript Types

export type ResourceType = 'GitHub' | 'YouTube' | 'PDF/Notes' | 'Website' | 'Practice' | 'Other';

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  created_at: string;
}

export interface Course {
  id: string;
  user_id: string;
  course_code: string;
  course_title: string;
  description: string | null;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface Resource {
  id: string;
  user_id: string;
  course_id: string;
  title: string;
  url: string;
  resource_type: ResourceType;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface AISuggestionItem {
  title: string;
  url: string;
  type: ResourceType;
  description: string;
}

export interface AISuggestionResponse {
  courseTitle: string;
  topics: string[];
  suggestedResources: AISuggestionItem[];
}

export interface AISuggestionLog {
  id: string;
  user_id: string;
  course_id: string;
  query: string;
  provider_used: string;
  suggestions_json: AISuggestionResponse;
  created_at: string;
}

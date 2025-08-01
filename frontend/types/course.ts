// d:/Portofolio/Project/pelajarin.ai/frontend/types/course.ts

/**
 * Payload for creating a new course.
 * Corresponds to the CourseCreate schema in the backend.
 */
export interface CourseCreatePayload {
  topic: string;
  difficulty: string;
  goal: string;
}

/**
 * Represents a sub-topic within a module.
 * Corresponds to the SubTopicPublic schema.
 */
export interface SubTopic {
  id: string; // UUID
  title: string;
  sub_topic_order: number;
  status: 'pending' | 'generating_content' | 'completed' | 'failed';
  module_id?: string; // UUID, included in stream events
}

/**
 * Represents an assessment (quiz, project, etc.).
 * Corresponds to the AssessmentPublic schema.
 */
export interface Assessment {
  id: string; // UUID
  title: string;
  type: string;
  status: string;
  module_id?: string; // UUID
}

/**
 * Represents a module within a course.
 * Corresponds to the ModulePublic schema.
 */
export interface Module {
  id: string; // UUID
  title: string;
  module_order: number;
  sub_topics: SubTopic[];
  // assessment field is removed as it's now handled in the main assessments array
}

/**
 * Comprehensive representation of a single course with all its contents.
 * This now represents the single source of truth for a detailed course object.
 * Corresponds to the unified CourseDetail schema in the backend.
 */
export interface Course {
  id: string; // UUID
  title: string;
  description: string;
  status: 'generating' | 'blueprint_completed' | 'generating_content' | 'completed' | 'failed';
  created_at: string; // ISO 8601 date string
  difficulty: string;
  modules: Module[];
  assessments: Assessment[];
  // Optional fields that might not always be present
  learning_outcomes?: string[];
  progress?: number; // Frontend tracking for progress (0-100)
}

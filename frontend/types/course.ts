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
  assessment?: Assessment; // The module-specific quiz
}

/**
 * Basic representation of a course, used for lists.
 * Corresponds to the CoursePublic schema.
 */
export interface Course {
  id: string; // UUID
  title: string;
  description: string;
    status: 'generating' | 'blueprint_completed' | 'generating_content' | 'completed' | 'failed';
  created_at: string; // ISO 8601 date string
  progress?: number; // Frontend tracking for progress (0-100)
}

/**
 * Comprehensive representation of a single course with all its contents.
 * Corresponds to the CourseDetail schema.
 */
export interface CourseDetail extends Course {
  learning_outcomes: string[];
  modules: Module[];
  final_assessment?: Assessment;
}

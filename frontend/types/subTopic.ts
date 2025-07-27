// frontend/types/subTopic.ts

export interface SubTopicDetail {
  id: string;
  module_id: string;
  title: string;
  status: string;
  sub_topic_order: number;
  content_blocks: {
    engage_hook: {
      title: string;
      content: string;
    };
    explore_section: {
      blocks: any[]; // Define more specific types later
    };
    main_learning_content_markdown: string;
    elaborate_section: {
      blocks: any[]; // Define more specific types later
    };
    evaluate_section: {
      key_takeaways: string[];
      bridge_to_next_topic: {
        title: string;
        content: string;
      };
    };
  } | null;
  summary_for_next_topic: Record<string, any> | null;
  created_at: string;
  updated_at: string;
}

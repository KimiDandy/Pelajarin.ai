// d:/Portofolio/Project/pelajarin.ai/frontend/services/courseService.ts

import api from './api';
import { Course, CourseCreatePayload, CourseDetail } from '@/types/course';
import { SubTopicDetail } from '@/types/subTopic';

export const courseService = {
  /**
   * Sends a request to the backend to create a new course.
   * @param data The payload containing the topic, difficulty, and goal.
   * @returns A promise that resolves to the newly created course's public data.
   */
  createCourse: async (data: CourseCreatePayload): Promise<Course> => {
    const response = await api.post<Course>('/api/v1/courses/', data);
    return response.data;
  },

  /**
   * Fetches all courses belonging to the authenticated user.
   * @returns A promise that resolves to an array of courses.
   */
  getCourses: async (): Promise<Course[]> => {
    const response = await api.get<Course[]>('/api/v1/courses/');
    return response.data;
  },

  /**
   * Fetches the detailed information of a single course by its ID.
   * @param id The UUID of the course to retrieve.
   * @returns A promise that resolves to the detailed course data, including modules.
   */
  getCourseById: async (id: string): Promise<CourseDetail> => {
    const response = await api.get<CourseDetail>(`/api/v1/courses/${id}`);
    return response.data;
  },

  /**
   * Fetches the detailed content of a single sub-topic by its ID.
   * @param subTopicId The UUID of the sub-topic to retrieve.
   * @returns A promise that resolves to the detailed sub-topic data.
   */
  getSubTopicContent: async (subTopicId: string): Promise<SubTopicDetail> => {
    const response = await api.get<SubTopicDetail>(`/api/v1/sub-topics/${subTopicId}`);
    return response.data;
  },

  /**
   * Triggers the AI content generation process for a specific course.
   * @param courseId The UUID of the course to generate content for.
   * @returns A promise that resolves when the request is successfully sent.
   */
  triggerContentGeneration: async (courseId: string): Promise<void> => {
    await api.post(`/api/v1/courses/${courseId}/generate-content`);
  },

  /**
   * Sends a request to cancel the content generation process for a specific course.
   * @param courseId The UUID of the course to cancel generation for.
   * @returns A promise that resolves with the server's confirmation message.
   */
  cancelContentGeneration: async (courseId: string): Promise<{ message: string }> => {
    const response = await api.post<{ message: string }>(`/api/v1/courses/${courseId}/cancel-generation`);
    return response.data;
  },
};

// d:/Portofolio/Project/pelajarin.ai/frontend/services/courseService.ts

import api from './api';
import { Course, CourseCreatePayload, CourseDetail } from '@/types/course';

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
};

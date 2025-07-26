import api from './api';
import { Course, CourseCreatePayload, CourseDetail } from '@/types/course';

export const courseService = {
  /**
   * Fetches all courses belonging to the authenticated user with caching
   */
  getCourses: async (): Promise<Course[]> => {
    const response = await api.get<Course[]>('/api/v1/courses/');
    return response.data;
  },

  /**
   * Fetches the detailed information of a single course by its ID with caching
   */
  getCourseById: async (id: string): Promise<CourseDetail> => {
    const response = await api.get<CourseDetail>(`/api/v1/courses/${id}`);
    return response.data;
  },

  /**
   * Creates a new course with optimistic updates
   */
  createCourse: async (data: CourseCreatePayload): Promise<Course> => {
    const response = await api.post<Course>('/api/v1/courses/', data);
    return response.data;
  },

  /**
   * Prefetches course data for faster navigation
   */
  prefetchCourse: async (id: string): Promise<void> => {
    // This will be used by React Query for prefetching
    await courseService.getCourseById(id);
  },

  /**
   * Gets course with minimal data for list views
   */
  getCoursesMinimal: async (): Promise<Pick<Course, 'id' | 'title' | 'status' | 'created_at'>[]> => {
    const response = await api.get<Course[]>('/api/v1/courses/?minimal=true');
    return response.data;
  }
};

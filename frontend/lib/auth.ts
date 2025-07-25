// Auth utility functions
export const authUtils = {
  // Store token in localStorage
  setToken: (token: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', token);
    }
  },

  // Get token from localStorage
  getToken: (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('access_token');
    }
    return null;
  },

  // Remove token from localStorage (logout)
  removeToken: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
    }
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return authUtils.getToken() !== null;
  },

  // Logout function
  logout: () => {
    authUtils.removeToken();
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }
};

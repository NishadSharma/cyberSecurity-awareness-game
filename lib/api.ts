const API_BASE_URL = typeof window !== 'undefined' && process.env.NODE_ENV === 'production'
  ? 'https://your-api-domain.com/api' 
  : 'http://localhost:3001/api';

interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: any[];
}

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

interface AuthResponse {
  user: User;
  accessToken: string;
}

class ApiClient {
  private accessToken: string | null = null;

  constructor() {
    // Try to get token from localStorage on client side
    if (typeof window !== 'undefined') {
      this.accessToken = localStorage.getItem('accessToken');
    }
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include', // Include cookies for refresh token
      ...options,
    };

    // Add authorization header if we have a token
    if (this.accessToken) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${this.accessToken}`,
      };
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      // If token expired, try to refresh
      if (response.status === 401 && data.message === 'Access token expired') {
        const refreshed = await this.refreshToken();
        if (refreshed) {
          // Retry the original request with new token
          config.headers = {
            ...config.headers,
            Authorization: `Bearer ${this.accessToken}`,
          };
          const retryResponse = await fetch(url, config);
          return await retryResponse.json();
        }
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw new Error('Network error occurred');
    }
  }

  async register(userData: {
    name: string;
    email: string;
    password: string;
  }): Promise<ApiResponse<AuthResponse>> {
    const response = await this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    if (response.success && response.data?.accessToken) {
      this.setAccessToken(response.data.accessToken);
    }

    return response;
  }

  async login(credentials: {
    email: string;
    password: string;
  }): Promise<ApiResponse<AuthResponse>> {
    const response = await this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (response.success && response.data?.accessToken) {
      this.setAccessToken(response.data.accessToken);
    }

    return response;
  }

  async logout(): Promise<ApiResponse> {
    const response = await this.request('/auth/logout', {
      method: 'POST',
    });

    if (response.success) {
      this.clearAccessToken();
    }

    return response;
  }

  async refreshToken(): Promise<boolean> {
    try {
      const response = await this.request<{ accessToken: string }>('/auth/refresh', {
        method: 'POST',
      });

      if (response.success && response.data?.accessToken) {
        this.setAccessToken(response.data.accessToken);
        return true;
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      this.clearAccessToken();
    }

    return false;
  }

  async getProfile(): Promise<ApiResponse<{ user: User }>> {
    return this.request<{ user: User }>('/auth/profile');
  }

  async getQuestions(category: string = 'all', difficulty: string = 'all', limit: number = 10): Promise<ApiResponse<any>> {
    return this.request(`/game/questions?category=${category}&difficulty=${difficulty}&limit=${limit}`);
  }

  async submitQuiz(answers: any[], timeSpent: number, sessionId: string): Promise<ApiResponse<any>> {
    return this.request('/game/submit-quiz', {
      method: 'POST',
      body: JSON.stringify({ answers, timeSpent, sessionId }),
    });
  }

  async getPhishingScenarios(category: string = 'all', difficulty: string = 'all', limit: number = 5): Promise<ApiResponse<any>> {
    return this.request(`/game/phishing-scenarios?category=${category}&difficulty=${difficulty}&limit=${limit}`);
  }

  async submitPhishing(answers: any[], timeSpent: number, sessionId: string): Promise<ApiResponse<any>> {
    return this.request('/game/submit-phishing', {
      method: 'POST',
      body: JSON.stringify({ answers, timeSpent, sessionId }),
    });
  }

  private setAccessToken(token: string): void {
    this.accessToken = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', token);
    }
  }

  private clearAccessToken(): void {
    this.accessToken = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
    }
  }

  isAuthenticated(): boolean {
    return !!this.accessToken;
  }
}

export const apiClient = new ApiClient();
export type { User, AuthResponse, ApiResponse };
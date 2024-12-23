import axios from 'axios';

const API_BASE_URL = 'http://localhost:8787';

export const authService = {
  async register(username: string, email: string, password: string) {
    try {
      const response = await axios.post(`${API_BASE_URL}/register`, {
        username,
        email,
        password
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async login(email: string, password: string) {
    try {
      const response = await axios.post(`${API_BASE_URL}/login`, {
        email,
        password
      });
      
      if (response.data.token) {
        // 存储 token
        localStorage.setItem('user_token', response.data.token);
      }
      
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  logout() {
    localStorage.removeItem('user_token');
  },

  getCurrentUser() {
    return localStorage.getItem('user_token');
  }
};

// 创建 axios 实例，自动添加 token
export const apiClient = axios.create({
  baseURL: API_BASE_URL
});

// 请求拦截器
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('user_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      // token 过期，自动登出
      authService.logout();
      // 可以跳转到登录页
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

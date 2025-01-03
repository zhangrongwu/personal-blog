import axios from 'axios';

const API_BASE_URL = 'https://personal-blog-workers.zhangrongwuios-c13.workers.dev/api';

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
  baseURL: API_BASE_URL,
  timeout: 10000  // 增加超时时间
});

// 请求拦截器
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('user_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    console.log('Request config:', config);  // 添加日志
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
apiClient.interceptors.response.use(
  response => {
    console.log('Response:', response);  // 添加日志
    return response;
  },
  error => {
    console.error('Response error:', error);
    if (error.response && error.response.status === 401) {
      // token 过期，自动登出
      authService.logout();
      // 可以跳转到登录页
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

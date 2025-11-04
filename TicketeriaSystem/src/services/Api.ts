import axios from 'axios';

// Configure a URL base da API
// Em produção, use a URL real da API
export const API_BASE_URL = __DEV__
  ? 'http://192.168.1.8:3000'
  : 'https://api-production.com';

const baseUrl = `${API_BASE_URL}/api/v1`

const api = axios.create({
  baseURL: baseUrl,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token de autenticação
api.interceptors.request.use(
  async (config) => {
    // Aqui você pode adicionar o token de autenticação
    // const token = await AsyncStorage.getItem('@token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratamento de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Erro com resposta do servidor
      console.log('API Error Response:', error.response.data);
      console.log('API Error Status:', error.response.status);
    } else if (error.request) {
      // Erro sem resposta (problemas de rede)
      console.log('API Network Error:', error.request);
    } else {
      // Erro na configuração da requisição
      console.log('API Config Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;

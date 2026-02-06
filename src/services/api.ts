/**
 * Configuração base do Axios para comunicação com a API
 * Base URL: http://localhost:5000/api/v1
 */
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 segundos de timeout
});

// Interceptor para tratamento de erros global
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Erro com resposta do servidor
      console.error("API Error:", error.response.status, error.response.data);
      return Promise.reject({
        message:
          error.response.data.message || "Erro ao processar a requisição",
        status: error.response.status,
        data: error.response.data,
      });
    } else if (error.request) {
      // Erro de rede
      console.error("Network Error:", error.request);
      return Promise.reject({
        message: "Erro de conexão com o servidor",
        status: 0,
      });
    } else {
      // Erro desconecido
      console.error("Error:", error.message);
      return Promise.reject({
        message: error.message || "Erro desconhecido",
        status: -1,
      });
    }
  },
);

export default api;

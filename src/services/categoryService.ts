/**
 * Serviço para gerenciar operações CRUD de Categories
 * Endpoints diponíveis:
 * - POST /api/v1/Categories
 * - GET /api/v1/Categories
 * - GET /api/v1/Categories/:id
 * - PUT /api/v1/Categories/:id
 * - PATCH /api/v1/Categories/:id
 * - DELETE /api/v1/Categories/:id
 */
import api from "./api";
import {
  Category,
  CreateCategoryDTO,
  UpdateCategoryDTO,
} from "@/types/Category";

export const categoryService = {
  /**
   * Buscar todas as categorias
   */
  getAll: () => {
    const response = api.get<Category[]>("/Categories");
    return response;
  },

  /**
   * Buscar categoria por ID
   */
  getById: (id: string) => {
    const response = api.get<Category>(`/Categories/${id}`);
    return response;
  },

  /**
   * Criar nova categoria
   * Validação: Descrição deve ter no máximo 400 caracteres
   */
  create: (data: CreateCategoryDTO) => {
    const response = api.post<Category>("/Categories", data);
    return response;
  },

  /**
   * Atualizar categoria completamente (PUT)
   */
  update: (id: string, data: CreateCategoryDTO) => {
    const response = api.put<Category>(`/Categories/${id}`, data);
    return response;
  },

  /**
   * Atualizar categoria parcialmente (PATCH)
   */
  partialUpdate: (id: string, data: UpdateCategoryDTO) => {
    const response = api.patch<Category>(`/Categories/${id}`, data);
    return response;
  },

  // Deletar categoria por ID
  delete: (id: string) => {
    return api.delete<void>(`/Categories/${id}`);
  },
};

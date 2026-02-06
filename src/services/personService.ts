/**
 * Serviço para gerenciar operações CRUD de People
 * Endpoints diponíveis:
 * - POST /api/v1/People
 * - GET /api/v1/People
 * - GET /api/v1/People/:id
 * - PUT /api/v1/People/:id
 * - PATCH /api/v1/People/:id
 * - DELETE /api/v1/People/:id
 */
import api from "./api";
import { Person, CreatePersonDTO, UpdatePersonDTO } from "@/types/Person";

export const personService = {
  /**
   * Buscar todas as pessoas
   */
  getAll: () => {
    const response = api.get<Person[]>("/People");
    return response;
  },

  /**
   * Buscar pessoa por ID
   */
  getById: (id: string) => {
    const response = api.get<Person>(`/People/${id}`);
    return response;
  },

  /**
   * Criar nova pessoa
   * Validação: Descrição deve ter no máximo 400 caracteres
   */
  create: (data: CreatePersonDTO) => {
    const response = api.post<Person>("/People", data);
    return response;
  },

  /**
   * Atualizar pessoa completamente (PUT)
   */
  update: (id: string, data: UpdatePersonDTO) => {
    const response = api.put<Person>(`/People/${id}`, data);
    return response;
  },

  /**
   * Atualizar pessoa parcialmente (PATCH)
   */
  partialUpdate: (id: string, data: UpdatePersonDTO) => {
    const response = api.patch<Person>(`/People/${id}`, data);
    return response;
  },

  // Deletar pessoa por ID
  delete: (id: string) => {
    return api.delete<void>(`/People/${id}`);
  },
};

/**
 * Serviço para gerenciar operações CRUD de Transactions
 * Endpoints diponíveis:
 * - POST /api/v1/Transactions
 * - GET /api/v1/Transactions
 * - GET /api/v1/Transactions/:id
 * - PUT /api/v1/Transactions/:id
 * - PATCH /api/v1/Transactions/:id
 * - DELETE /api/v1/Transactions/:id
 */
import api from "./api";
import {
  Transaction,
  CreateTransactionDTO,
  UpdateTransactionDTO,
} from "@/types/Transaction";

export const transactionService = {
  /**
   * Buscar todas as transações
   */
  getAll: () => {
    const response = api.get<Transaction[]>("/Transactions");
    return response;
  },

  /**
   * Buscar transação por ID
   */
  getById: (id: string) => {
    const response = api.get<Transaction>(`/Transactions/${id}`);
    return response;
  },

  /**
   * Criar nova transação
   * Validação: Descrição deve ter no máximo 400 caracteres
   */
  create: (data: CreateTransactionDTO) => {
    const response = api.post<Transaction>("/Transactions", data);
    return response;
  },

  /**
   * Atualizar transação completamente (PUT)
   */
  update: (id: string, data: UpdateTransactionDTO) => {
    const response = api.put<Transaction>(`/Transactions/${id}`, data);
    return response;
  },

  /**
   * Atualizar transação parcialmente (PATCH)
   */
  partialUpdate: (id: string, data: UpdateTransactionDTO) => {
    const response = api.patch<Transaction>(`/People/${id}`, data);
    return response;
  },

  // Deletar pessoa por ID
  delete: (id: string) => {
    return api.delete<void>(`/People/${id}`);
  },
};

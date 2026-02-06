/**
 * Interface para representar uma Transação no sistema
 * Regra de negócio: O valor deve ser positivo
 * Regra de negócio: Categoria deve ser compatível com o tipo
 * Regra de negócio: Pessoa menor de 18 anos só pode cadastrar despesas
 */
export interface Transaction {
  id: string;
  personId: string;
  categoryId: string;
  amount: number;
  description: string;
  date: string; // ISO 8601 format (YYYY-MM-DD)
  type: "income" | "expense";
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  // Campos populados para exibição
  personName?: string;
  categoryName?: string;
}

/**
 * DTO para criação de transação
 */
export interface CreateTransactionDTO {
  personId: string;
  categoryId: string;
  amount: number;
  description: string;
  date: string;
  type: "income" | "expense";
}

/**
 * DTO para atualização de transação
 */
export interface UpdateTransactionDTO {
  personId?: string;
  categoryId?: string;
  amount?: number;
  description?: string;
  date?: string;
  type?: "income" | "expense";
}

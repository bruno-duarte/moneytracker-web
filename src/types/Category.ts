/**
 * Interface para representar uma categoria no sistema
 * Regra de negócio: Descrição deve ter no máximo 400 caracteres
 * Regra de negócio: Tipo deve ser compartível com o tipo da transação
 */
export interface Category {
  id: string;
  name: string;
  description: string;
  type: "income" | "expense";
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

/**
 * DTO para criação de categoria
 */
export interface CreateCategoryDTO {
  name: string;
  description: string;
  type: "income" | "expense";
}

/**
 * DTO para atualização de categoria
 */
export interface UpdateCategoryDTO {
  name?: string;
  description?: string;
  type?: "income" | "expense";
}

/**
 * Interface para representar uma Pessoa no sistema
 * Regra de negócio: O nome deve ter no máximo 200 caracteres
 * Regra de negócio: Pessoa menor de 18 anos só pode cadastrar despesas
 */
export interface Person {
  id: string;
  name: string;
  birthDate: string; // ISO 8601 (YYYY-MM-DD)
  createdAt: string;
  updatedAt: string;
}

/**
 * DTO para criação de pessoa
 */
export interface CreatePersonDTO {
  name: string;
  birthDate: string;
}

/**
 * DTO para atualização de pessoa
 */
export interface UpdatePersonDTO {
  name?: string;
  birthDate?: number;
}

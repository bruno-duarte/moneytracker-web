/**
 * Utilitários para validação de regras de negócio
 */

/**
 * Calcula a idade de uma pessoa com base na data de nascimento
 */
export const calculateAge = (birthDate: string): number => {
  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
};

/**
 * Verifica se uma pessoa é menor de idade (< 18 anos)
 * Regra de negócio: Pessoa menor de 18 anos só pode cadastrar despesas
 */
export const isMinor = (birthDate: string): boolean => {
  return calculateAge(birthDate) < 18;
};

/**
 * Valida se o nome da pessoa está dentro do limite
 * Regra de negócio: Nome deve ter no máximo 200 caracteres
 */
export const validatePersonName = (
  name: string,
): { valid: boolean; error?: string } => {
  if (!name || name.trim().length === 0) {
    return { valid: false, error: "Nome é obrigatório" };
  }

  if (name.length > 200) {
    return { valid: false, error: "Nome deve ter no máximo 200 caracteres" };
  }

  return { valid: true };
};

/**
 * Valida se a descrição da categoria está dentro do limite
 * Regra de negócio: Descrição deve ter no máximo 400 caracteres
 */
export const validateCategoryDescription = (
  description: string,
): { valid: boolean; error?: string } => {
  if (!description || description.trim().length === 0) {
    return { valid: false, error: "Descrição é obrigatória" };
  }

  if (description.length > 400) {
    return {
      valid: false,
      error: "Descrição deve ter no máximo 400 caracteres",
    };
  }

  return { valid: true };
};

/**
 * Valida se o valor da transação é positivo
 * Regra de negócio: Valor deve ser positivo
 */
export const validateTransactionAmount = (
  amount: number,
): { valid: boolean; error?: string } => {
  if (amount <= 0) {
    return { valid: false, error: "Valor deve ser positivo" };
  }

  return { valid: true };
};

/**
 * Valida se a categoria é compatível com o tipo da transação
 * Regra de negócio: Se transação = despesa → categoria não pode ser receita
 *                   Se transação = receita → categoria não pode ser despesa
 */
export const validateCategoryType = (
  transactionType: "income" | "expense",
  categoryType: "income" | "expense",
): { valid: boolean; error?: string } => {
  if (transactionType !== categoryType) {
    return {
      valid: false,
      error: `Categoria do tipo "${categoryType === "income" ? "receita" : "despesa"}" não é compatível com transação do tipo "${transactionType === "income" ? "receita" : "despesa"}"`,
    };
  }

  return { valid: true };
};

/**
 * Valida se uma pessoa menor de idade pode criar uma transação
 * Regra de negócio: Pessoa menor de 18 anos só pode cadastrar despesas
 */
export const validateMinorTransaction = (
  birthDate: string,
  transactionType: "income" | "expense",
): { valid: boolean; error?: string } => {
  if (isMinor(birthDate) && transactionType === "income") {
    return {
      valid: false,
      error: "Pessoa menor de 18 anos só pode cadastrar despesas",
    };
  }

  return { valid: true };
};

/**
 * Valida data de nascimento
 */
export const validateBirthDate = (
  birthDate: string,
): { valid: boolean; error?: string } => {
  if (!birthDate) {
    return { valid: false, error: "Data de nascimento é obrigatória" };
  }

  const birth = new Date(birthDate);
  const today = new Date();

  if (birth > today) {
    return { valid: false, error: "Data de nascimento não pode ser futura" };
  }

  return { valid: true };
};

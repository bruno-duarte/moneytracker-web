/**
 * Interface para relatórios por pessoa
 */
export interface PersonReport {
  personId: string;
  personName: string;
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

/**
 * Interface para relatório geral
 */
export interface GeneralReport {
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
  peopleReports: PersonReport[];
}

/**
 * Interface para relatórios por categoria
 */
export interface CategoryReport {
  categoryId: string;
  categoryName: string;
  type: "income" | "expense";
  total: number;
  transactionCount: number;
}

/**
 * Utilitários para formatação de valores
 */

/**
 * Formata valor monetário para BRL
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

/**
 * Formata data para formato brasileiro (DD/MM/YYYY)
 */
export const formatDate = (date: string): string => {
  if (!date) return "";

  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();

  return `${day}/${month}/${year}`;
};

/**
 * Formata data para input (YYYY-MM-DD)
 */
export const formatDateForInput = (date: string): string => {
  if (!date) return "";

  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

/**
 * Formata tipo de transação/categoria para exibição
 */
export const formatType = (type: "income" | "expense"): string => {
  return type === "income" ? "Receita" : "Despesa";
};

/**
 * Retorna classe CSS baseada no tipo
 */
export const getTypeColorClass = (type: "income" | "expense"): string => {
  return type === "income" ? "text-emerald-600" : "text-red-600";
};

/**
 * Retorna classe CSS de badge baseada no tipo
 */
export const getTypeBadgeClass = (type: "income" | "expense"): string => {
  return type === "income"
    ? "bg-emerald-100 text-emerald-800"
    : "bg-red-100 text-red-800";
};

/**
 * Constantes da aplicação
 */

export const APP_NAME = "MoneyTracker";

export const MAX_PERSON_NAME_LENGTH = 200;
export const MAX_CATEGORY_DESCRIPTION_LENGTH = 400;
export const MINIMUM_AGE_FOR_INCOME = 18;

export const TRANSACTION_TYPES = {
  INCOME: "income",
  EXPENSE: "expense",
};

export const ROUTES = {
  DASHBOARD: "/",
  PEOPLE: "/people",
  CATEGORIES: "/categories",
  TRANSACTIONS: "/transactions",
  REPORTS: "/reports",
};

export const API_BASE_URL = "http://localhost:3000/api/v1";

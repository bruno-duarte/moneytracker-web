/**
 * Redux Slice para gerenciamento de Reports
 * Calcula relatórios financeiros baseados em transações
 */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { CategoryReport, GeneralReport, PersonReport } from "@/types/Report";
import { RootState } from "@/app/store";

interface ReportsState {
  generalReports: GeneralReport | null;
  categoryReports: CategoryReport[];
  loading: boolean;
  error: string | null;
}

const initialState: ReportsState = {
  generalReports: null,
  categoryReports: [],
  loading: false,
  error: null,
};

/**
 * Thunk para calcular relatório geral
 * Agrupa transações por pessoa e calcula totais
 */
export const calculateGeneralReport = createAsyncThunk(
  "reports/calculateGeneral",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const { transactions } = state.transactions;
      const { people } = state.people;

      // Agrupar transações por pessoa
      const peopleMap = new Map<string, PersonReport>();

      people.forEach((person) => {
        peopleMap.set(person.id, {
          personId: person.id,
          personName: person.name,
          totalIncome: 0,
          totalExpense: 0,
          balance: 0,
        });
      });

      // Calcular totais por pessoa
      transactions.forEach((transaction) => {
        const personReport = peopleMap.get(transaction.personId);
        if (personReport) {
          if (transaction.type === "income") {
            personReport.totalIncome += transaction.amount;
          } else {
            personReport.totalExpense += transaction.amount;
          }
          personReport.balance =
            personReport.totalIncome - personReport.totalExpense;
        }
      });

      const peopleReports = Array.from(peopleMap.values());

      // Calcular totais gerais
      const totalIncome = peopleReports.reduce(
        (sum, report) => sum + report.totalIncome,
        0,
      );
      const totalExpense = peopleReports.reduce(
        (sum, report) => sum + report.totalExpense,
        0,
      );
      const netBalance = totalIncome - totalExpense;

      return {
        totalIncome,
        totalExpense,
        netBalance,
        peopleReports,
      } as GeneralReport;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return rejectWithValue(
        error.message || "Erro ao calcular relatório geral",
      );
    }
  },
);

/**
 * Thunk para calcular relatório por categoria
 */
export const calculateCategoryReports = createAsyncThunk(
  "reports/calculateCategory",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const { transactions } = state.transactions;
      const { categories } = state.categories;

      const categoryMap = new Map<string, CategoryReport>();

      categories.forEach((category) => {
        categoryMap.set(category.id!, {
          categoryId: category.id,
          categoryName: category.name,
          type: category.type,
          total: 0,
          transactionCount: 0,
        });
      });

      // Calcular totais por categoria
      transactions.forEach((transaction) => {
        const categoryReport = categoryMap.get(transaction.categoryId);
        if (categoryReport) {
          categoryReport.total += transaction.amount;
          categoryReport.transactionCount += 1;
        }
      });

      return Array.from(categoryMap.values()).filter(
        (c) => c.transactionCount > 0,
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return rejectWithValue(
        error.message || "Erro ao calcular relatório por categoria",
      );
    }
  },
);

const reportsSlice = createSlice({
  name: "reports",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Calcular relatório geral
    builder
      .addCase(calculateGeneralReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(calculateGeneralReport.fulfilled, (state, action) => {
        state.loading = false;
        state.generalReports = action.payload;
      })
      .addCase(calculateGeneralReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Calcular relatório por categoria
    builder
      .addCase(calculateCategoryReports.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(calculateCategoryReports.fulfilled, (state, action) => {
        state.loading = false;
        state.categoryReports = action.payload;
      })
      .addCase(calculateCategoryReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = reportsSlice.actions;
export default reportsSlice.reducer;

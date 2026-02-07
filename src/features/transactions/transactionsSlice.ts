/**
 * Redux Slice para gerenciamento de Transactions
 * Contém estado, reducers e actions para operações de CRUD
 * Implementa regras de negócio para validação de transações
 */
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  Transaction,
  CreateTransactionDTO,
  UpdateTransactionDTO,
} from "@/types/Transaction";
import { transactionService } from "@/services/transactionService";

interface TransactionState {
  transactions: Transaction[];
  selectedTransaction: Transaction | null;
  loading: boolean;
  error: string | null;
  success: string | null;
}

const initialState: TransactionState = {
  transactions: [],
  selectedTransaction: null,
  loading: false,
  error: null,
  success: null,
};

// Thunks assíncronos
export const fetchTransactions = createAsyncThunk(
  "transactions/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await transactionService.getAll();
      return response.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return rejectWithValue(error.message || "Erro ao buscar transações");
    }
  },
);

export const fetchTransactionById = createAsyncThunk(
  "transactions/fetchById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await transactionService.getById(id);
      return response.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return rejectWithValue(error.message || "Erro ao buscar transação");
    }
  },
);

export const createTransaction = createAsyncThunk(
  "transactions/create",
  async (data: CreateTransactionDTO, { rejectWithValue }) => {
    try {
      const response = await transactionService.create(data);
      return response.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return rejectWithValue(error.message || "Erro ao criar transação");
    }
  },
);

export const updateTransaction = createAsyncThunk(
  "transactions/update",
  async (
    { id, data }: { id: string; data: UpdateTransactionDTO },
    { rejectWithValue },
  ) => {
    try {
      const response = await transactionService.update(id, data);
      return response.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return rejectWithValue(error.message || "Erro ao atualizar transação");
    }
  },
);

export const partialUpdateTransaction = createAsyncThunk(
  "transactions/partialUpdate",
  async (
    { id, data }: { id: string; data: Partial<UpdateTransactionDTO> },
    { rejectWithValue },
  ) => {
    try {
      const response = await transactionService.partialUpdate(id, data);
      return response.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return rejectWithValue(
        error.message || "Erro ao atualizar parcialmente a transação",
      );
    }
  },
);

export const deleteTransaction = createAsyncThunk(
  "transactions/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await transactionService.delete(id);
      return id; // Retorna o ID para remover do estado
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return rejectWithValue(error.message || "Erro ao deletar transação");
    }
  },
);

const transactionsSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = null;
    },
    setSelectedTransaction: (
      state,
      action: PayloadAction<Transaction | null>,
    ) => {
      state.selectedTransaction = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch all transactions
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch transaction by ID
    builder
      .addCase(fetchTransactionById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactionById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedTransaction = action.payload;
      })
      .addCase(fetchTransactionById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Create transaction
    builder
      .addCase(createTransaction.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(createTransaction.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions.push(action.payload);
        state.success = "Transação criada com sucesso";
      })
      .addCase(createTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update transaction
    builder
      .addCase(updateTransaction.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(updateTransaction.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.transactions.findIndex(
          (transaction) => transaction.id === action.payload.id,
        );
        if (index !== -1) {
          state.transactions[index] = action.payload;
        }
        state.success = "Transação atualizada com sucesso";
      })
      .addCase(updateTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Partial update transaction
    builder
      .addCase(partialUpdateTransaction.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(partialUpdateTransaction.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.transactions.findIndex(
          (transaction) => transaction.id === action.payload.id,
        );
        if (index !== -1) {
          state.transactions[index] = {
            ...state.transactions[index],
            ...action.payload,
          };
        }
        state.success = "Transação parcialmente atualizada com sucesso";
      })
      .addCase(partialUpdateTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Delete transaction
    builder
      .addCase(deleteTransaction.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(deleteTransaction.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = state.transactions.filter(
          (transaction) => transaction.id !== action.payload,
        );
        state.success = "Transação deletada com sucesso";
      })
      .addCase(deleteTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearSuccess, setSelectedTransaction } =
  transactionsSlice.actions;
export default transactionsSlice.reducer;

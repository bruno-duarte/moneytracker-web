/**
 * Configuração da Redux Store
 * Combina todos os reducers das features
 */
import { configureStore } from "@reduxjs/toolkit";
// import peopleReducer from "../features/people/peopleSlice";
import categoriesReducer from "../features/categories/categoriesSlice";
// import transactionsReducer from "../features/transactions/transactionsSlice";
// import reportsReducer from "../features/reports/reportsSlice";

export const store = configureStore({
  reducer: {
    // people: peopleReducer,
    categories: categoriesReducer,
    // transactions: transactionsReducer,
    // reports: reportsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Desabilita check de serialização de datas
    }),
});

// Tipos inferidos do store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

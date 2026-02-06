/**
 * Hooks tipados para uso com Redux
 * Use estes hooks ao invés de useDispatch e useSelector padrão
 */
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./store";

// Hook tipado para dispatch
export const useAppDispatch = () => useDispatch.withTypes<AppDispatch>();

// Hook tipado para selector
export const useAppSelector = useSelector.withTypes<RootState>();

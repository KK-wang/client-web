import { useSelector, useDispatch, TypedUseSelectorHook } from "react-redux";
import { RootState, AppDispatch } from "./index";

const useAppDispatch = () => useDispatch<AppDispatch>();
const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export {
  useAppDispatch,
  useAppSelector,
}
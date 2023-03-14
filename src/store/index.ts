import { configureStore } from '@reduxjs/toolkit';
import { home } from '../pages/home/home.slice';

const store = configureStore({
  reducer: {
    home,
  }
});

type AppDispatch = typeof store.dispatch;
type RootState = ReturnType<typeof store.getState> // 获取 state 的 ts 定义。

export {
  RootState,
  store,
  AppDispatch,
};
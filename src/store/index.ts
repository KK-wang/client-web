import { configureStore } from '@reduxjs/toolkit';
import { home } from '../pages/home/home.slice';
import { node } from '../pages/node/node.slice';

const store = configureStore({
  reducer: {
    home,
    node,
  }
});

type AppDispatch = typeof store.dispatch;
type RootState = ReturnType<typeof store.getState> // 获取 state 的 ts 定义。

export {
  RootState,
  store,
  AppDispatch,
};
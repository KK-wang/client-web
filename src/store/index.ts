import { configureStore } from '@reduxjs/toolkit';
import { home } from '../pages/home/home.slice';
import { node } from '../pages/node/node.slice';
import { algorithm } from '../pages/algorithm/algorithm.slice';
import { pod } from '../pages/pod/pod.slice';

const store = configureStore({
  reducer: {
    home,
    node,
    algorithm,
    pod,
  }
});

type AppDispatch = typeof store.dispatch;
type RootState = ReturnType<typeof store.getState> // 获取 state 的 ts 定义。

export {
  RootState,
  store,
  AppDispatch,
};
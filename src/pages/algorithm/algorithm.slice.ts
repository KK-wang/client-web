import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createAlgorithmTask } from "../../api";

interface IAlgorithmState {
  // 存储算法的计算结果。
  nodeName: string,
  image: string,
  podName: string,
}

const algorithmSlice = createSlice({
  name: "algorithm",
  initialState: {
    algorithmRes: [] as IAlgorithmState[],
  },
  reducers: {
    reset(state, action) {
      state.algorithmRes = action.payload;
    },
  }
});

const { reset } = algorithmSlice.actions;
const algorithm = algorithmSlice.reducer;

const createAlgorithmTaskApi = createAsyncThunk("algorithm/createAlgorithmTask", async (payload: AlgorithmReqParam.IAlgorithmReqParam, { dispatch }) => {
  const res = await createAlgorithmTask(payload);
  dispatch(reset(res.data));
});


export {
  AlgorithmReqParam,
  algorithm,
  createAlgorithmTaskApi,
}

namespace AlgorithmReqParam {
  export interface IAlgorithmReqParam {
    algorithm: Algorithm,
    nodes: AlgorithmReqNode[],
    tasks: AlgorithmReqTask[],
  }

  export interface AlgorithmReqNode {
    nodeName: string | null,
    cpu: number | null,
    mem: number | null,
  }

  export interface AlgorithmReqTask {
    podName: string | null,
    image: string | null,
    calcMetrics: string | null,
    nums: number | null,
  }

  export type Algorithm = "BBO" | "GA" | null;
}

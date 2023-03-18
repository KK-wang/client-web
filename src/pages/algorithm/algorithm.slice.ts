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
    formData: {} as AlgorithmReqParam.IAlgorithmReqParam,
    isSavedAfterUpdated: true,
  },
  reducers: {
    reset(state, action) {
      state.algorithmRes = action.payload;
    },
    setAlgorithmInfo(state, action) {
      // 使用了 immer 库。
      state.formData = action.payload;
    },
    saveAfterUpdated(state, action) {
      state.isSavedAfterUpdated = action.payload;
    }
  }
});

const { reset, setAlgorithmInfo, saveAfterUpdated } = algorithmSlice.actions;
const algorithm = algorithmSlice.reducer;

const createAlgorithmTaskApi = createAsyncThunk("algorithm/createAlgorithmTask", async (payload: AlgorithmReqParam.IAlgorithmReqParam, { dispatch }) => {
  const res = await createAlgorithmTask(payload);
  dispatch(reset(res.data));
});


export {
  AlgorithmReqParam,
  algorithm,
  setAlgorithmInfo,
  createAlgorithmTaskApi,
  saveAfterUpdated
}

namespace AlgorithmReqParam {
  export interface IAlgorithmReqParam {
    algorithm: Algorithm,
    nodes: AlgorithmReqNode[],
    tasks: AlgorithmReqTask[],
  }

  export interface AlgorithmReqNode {
    nodeName: string,
    cpu: number,
    mem: number,
  }

  export interface AlgorithmReqTask {
    podName: string,
    image: string,
    calcMetrics: string,
    nums: number,
  }

  export type Algorithm = "BBO" | "GA";
}

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createAlgorithmTask } from "../../api";

interface IAlgorithmState {
  nodeName: string,
  image: string,
  podName: string,
  calcMetrics: string,
}

const algorithmSlice = createSlice({
  name: "algorithm",
  initialState: {
    algorithmRes: [] as IAlgorithmState[],
    formData: {} as AlgorithmReqParam.IAlgorithmReqParam,
  },
  reducers: {
    // TODO
    reset(state, action) {
      state.algorithmRes = action.payload;
    },
    setAlgorithm(state, action) {
      // 使用了 immer 库。
      state.formData.algorithm = action.payload;
    },
    setTasks(state, action) {
      state.formData.data.tasks = action.payload;
    },
    setNodes(state, action) {
      state.formData.data.nodes = action.payload;
    },
  }
});

const { reset, setAlgorithm, setTasks, setNodes } = algorithmSlice.actions;
const algorithm = algorithmSlice.reducer;

const createAlgorithmTaskApi = createAsyncThunk("algorithm/createAlgorithmTask", async (payload: AlgorithmReqParam.IAlgorithmReqParam, { dispatch }) => {
  const res = await createAlgorithmTask(payload);
  dispatch(reset(res.data));
});


export {
  AlgorithmReqParam,
  algorithm,
  setAlgorithm, 
  setTasks, 
  setNodes,
  createAlgorithmTaskApi,
}

namespace AlgorithmReqParam {
  export interface IAlgorithmReqParam {
    algorithm: Algorithm,
    data: {
      nodes: AlgorithmReqNode[],
      tasks: AlgorithmReqTask[],
    }
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
  }

  export type Algorithm = "BBO" | "GA";
}

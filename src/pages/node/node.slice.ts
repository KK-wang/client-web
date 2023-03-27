import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllNodesMetrics } from "../../api";

interface INodeState {
  [nodeName: string]: {
    numsCPU: number,
    idleCPU: {
      1: number,
      2: number,
      3: number,
      4: number,
      5: number,
      average: number,
    },
    availableMem: {
      1: number,
      2: number,
      3: number,
      4: number,
      5: number,
      average: number,
    },
  }
}

const nodeSlice = createSlice({
  name: "node",
  initialState: {
    getAllNodesMetricsData: {} as INodeState,
    loading: false,
  },
  reducers: {
    reset(state, action) {
      state.getAllNodesMetricsData = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    }
  }
});

const { reset, setLoading } = nodeSlice.actions;
const node = nodeSlice.reducer;

const getAllNodesMetricsApi = createAsyncThunk("node/getAllNodesMetrics", async (_, { dispatch }) => {
  const res = await getAllNodesMetrics();
  const keyArr = Object.keys(res.data).sort();
  const sorted = {} as INodeState;
  keyArr.forEach(key => sorted[key] = res.data[key]);
  dispatch(reset(sorted));
});

export {
  node,
  getAllNodesMetricsApi,
  setLoading,
  INodeState,
}
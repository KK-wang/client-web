import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getNodes } from "../../api";

interface IHomeState {
  [nodeName: string]: {
    status: boolean,
    ip: string,
    cpu: string,
    mem: string,
    os: string,
    role: string,
    k8sVersion: string,
    dockerVersion: string,
    business: string,
    pods: {
      [podName: string]: {
        image: string,
        status: boolean,
        githubUrl: string,
        calcMetrics: string,
      }
    }
  }
}

const homeSlice = createSlice({
  name: "home",
  initialState: {
    getNodesApiData: {} as IHomeState,
  },
  reducers: {
    reset(state, action) {
      state.getNodesApiData = action.payload;
    }
  },
});

const { reset } = homeSlice.actions;
const home = homeSlice.reducer;

const getNodesApi = createAsyncThunk("node/getNodes", async (_, { dispatch }) => {
  const res = await getNodes();
  dispatch(reset(res.data));
});

export {
  getNodesApi,
  home,
  IHomeState,
}
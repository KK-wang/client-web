import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getNodes } from "../../api/node";

interface IHomeState {
  getNodesApiData: {
    [nodeName: string]: {
      status: boolean,
      pods: {
        [podName: string]: {
          image: string,
          status: boolean,
        }
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
}
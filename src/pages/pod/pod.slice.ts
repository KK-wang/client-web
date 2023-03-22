import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllPodsRunningInfo } from "../../api";

const podSlice = createSlice({
  name: "pod",
  initialState: {
    podRunningInfo: {} as PodType.PodRunningInfo,
    isFetchPodRunningInfo: false,
  },
  reducers: {
    reset(state, action) {
      state.podRunningInfo = action.payload;
    },
    setFetchPodRunningInfo(state, action) {
      state.isFetchPodRunningInfo = action.payload;
    }
  }
});

const { reset, setFetchPodRunningInfo } = podSlice.actions;
const pod = podSlice.reducer;

const getAllPodsRunningInfoApi = createAsyncThunk("pod/getAllPodsRunningInfo", async (_, { dispatch }) => {
  const res = await getAllPodsRunningInfo();
  dispatch(reset(res.data));
});

export {
  PodType,
  pod,
  getAllPodsRunningInfoApi,
  setFetchPodRunningInfo,
};

namespace PodType {
  export interface PodClearResponse {
    clearPodsCode: number | undefined,
    shouldRmCount: number,
    rmCount: number,
  }

  export interface PodCreateParam {
    podName: string,
    image: string,
    nodeName: string,
  }

  export interface PodCreateReqParam {
    podsBody: PodCreateParam[],
  }

  export interface PodCreateResponse {
    [podName: string]: number | undefined,
  }

  export interface PodRunningInfo {
    [podName: string]: {
      nodeName: string,
      runningTime: number,
      cpuUsage: {
        [key: number]: number,
        average: number;
      },
      memUsage: {
        [key: number]: number,
        average: number;
      },
      message?: string,
    },
  }

  export interface PodUnfinished {
    status: number,
    message: string,
  }
}
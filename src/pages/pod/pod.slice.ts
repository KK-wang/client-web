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

const getAllPodsRunningInfoApi = createAsyncThunk("pod/getAllPodsRunningInfo", async (_, { dispatch, rejectWithValue  }) => {
  const res = await getAllPodsRunningInfo();
  if (res.data.status && res.data.status === 299) return rejectWithValue(res.data.status);
  else {
    const keyArr = Object.keys(res.data).sort();
    const sorted = {} as PodType.PodRunningInfo;
    keyArr.forEach(key => sorted[key] = (res.data as PodType.PodRunningInfo)[key]);
    dispatch(reset(sorted));
  }
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
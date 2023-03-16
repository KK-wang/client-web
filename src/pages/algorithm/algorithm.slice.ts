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
  }

  export type Algorithm = "BBO" | "GA";
}


export {
  AlgorithmReqParam,
}

import { NodeConfig, EdgeConfig } from "@antv/g6";
import { IHomeState } from "../../home.slice";

function getData(state: IHomeState) {
  const nodes: NodeConfig[] = [];
  const edges: EdgeConfig[] = [];
  const cloudNodeSize = 200,
    edgeNodeSize = 75,
    podSize = 30;
  for (const key of Object.keys(state)) {
    const node: NodeConfig = { id: key };
    if (key === "node00") node.size = cloudNodeSize;
    else node.size = edgeNodeSize;
    if (key !== "master") {
      edges.push({source: "master", target: key});
      node.img = require("../../../../assets/img/node.png");
    } else node.img = require("../../../../assets/img/master.png");
    nodes.push(node);
    for (const pod of Object.keys(state[key].pods)) {
      nodes.push({id: pod, size: podSize, isLeaf: true, img: require("../../../../assets/img/pod.png")});
      edges.push({source: key, target: pod, curveOffset: -50});
    }
  }
  return {
    nodes,
    edges,
  }
}

export {
  getData
};
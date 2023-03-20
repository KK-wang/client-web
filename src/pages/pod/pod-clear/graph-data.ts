import { NodeConfig } from "@antv/g6";
import { IPod } from ".";

function getData(podList: IPod) {
  const nodes: NodeConfig[] = [];
  const podSize = 50;
  for (const podName of Object.keys(podList)) {
    nodes.push({
      id: podName, 
      size: podSize, 
      isLeaf: true, 
      img: require("../../../assets/img/pod.png"),
      label: podName,
      labelCfg: {
        position: "bottom",
        offset: 10,
        style: {
          fill: "#ffffff"
        }
      },
    });
  }
  return { nodes };
}

export {
  getData,
};
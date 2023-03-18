import { useContext, useEffect } from "react";
import { Context } from "../..";
import { useRef } from "react";
import ReactDOM from "react-dom";
import * as echarts from 'echarts/core';
import {
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
} from 'echarts/components';
import { LineChart } from 'echarts/charts';
import { UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
import getOption from "./chart-option";

echarts.use([
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  LineChart,
  CanvasRenderer,
  UniversalTransition
]);

function Chart(prop: { tag: string, nodeName: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartsRef = useRef<echarts.EChartsType | null>(null);
  const getAllNodesMetricsData = useContext(Context);
  const { tag, nodeName } = prop;
  const info: typeof getAllNodesMetricsData = {};
  if (nodeName === "node00") info["node00"] = getAllNodesMetricsData["node00"];
  else {
    for (const key of Object.keys(getAllNodesMetricsData)) {
      if (key === "node00") continue;
      info[key] = getAllNodesMetricsData[key];
    }
  }
  useEffect(() => {
    if (chartsRef.current === null) {
      chartsRef.current = echarts.init(ReactDOM.findDOMNode(containerRef.current) as HTMLElement, "dark");
    }
    chartsRef.current.setOption(getOption(tag, info));
  }, [tag]);
  return (
    <div style={{height: "400px", width: "100%"}}>
      <div style={{height: "100%", width: "100%"}} ref={containerRef}></div>
    </div>
  );
}

export default Chart;
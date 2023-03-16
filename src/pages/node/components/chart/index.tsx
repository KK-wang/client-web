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
import styleNative from "./style.module.scss";
import convert from "../../../../utils/proxy";

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
  const store = useContext(Context);
  const { tag, nodeName } = prop;
  // const info = nodeName === "node00" ? {
  //   numsCPU: store["node00"].numsCPU,
  //   idleCPU: store["node00"].idleCPU,
    
  // } : {

  // };
  const style = convert<typeof styleNative>(styleNative);
  useEffect(() => {
    if (chartsRef.current === null) {
      chartsRef.current = echarts.init(ReactDOM.findDOMNode(containerRef.current) as HTMLElement, "dark");
    }
    chartsRef.current.setOption(getOption(tag));
  }, [tag]);
  return (
    <div className={style.chartWrapper}>
      <div className={style.chart} ref={containerRef}></div>
    </div>
  );
}

export default Chart;
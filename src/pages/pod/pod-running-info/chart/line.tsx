import { useContext, useRef, useEffect } from "react";
import { Context } from "..";
import ReactDOM from "react-dom";
import * as echarts from 'echarts/core';
import {
  TitleComponent,
  TitleComponentOption,
  ToolboxComponent,
  ToolboxComponentOption,
  TooltipComponent,
  TooltipComponentOption,
  GridComponent,
  GridComponentOption,
  LegendComponent,
  LegendComponentOption
} from 'echarts/components';
import { LineChart, LineSeriesOption } from 'echarts/charts';
import { UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
import { PodType } from "../../pod.slice";

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

type EChartsOption = echarts.ComposeOption<
  | TitleComponentOption
  | ToolboxComponentOption
  | TooltipComponentOption
  | GridComponentOption
  | LegendComponentOption
  | LineSeriesOption
>;

type PodRunningInfoValue = PodType.PodRunningInfo[keyof PodType.PodRunningInfo];

function Line(prop: { customKey: string, tag: string }) {
  const podRunningInfo = useContext(Context);
  const containerRef = useRef<HTMLDivElement>(null);
  const chartsRef = useRef<echarts.EChartsType | null>(null);
  const { customKey, tag } = prop;
  const info : PodRunningInfoValue = podRunningInfo[customKey];
  useEffect(() => {
    if (chartsRef.current === null) {
      chartsRef.current = echarts.init(ReactDOM.findDOMNode(containerRef.current) as HTMLElement, "dark");
    }
    chartsRef.current.setOption(getOption(tag, customKey, info));
  }, [customKey, tag]);


  return (
    <div style={{ 
      width: "100%", 
      height: "437px",
    }}>
      <div style={{ width: "100%", height: "100%" }} ref={containerRef}></div>
    </div>
  );
}

function getOption(tag: string, customKey: string, info: PodRunningInfoValue): EChartsOption {
  // tag === "cpu" or "mem"
  const baseCOnfig: EChartsOption = {
    title: {
      text: `${ customKey } ${tag === "cpu" ? "的 CPU " : "的内存"}使用情况`,
      top: "10px",
      left: "center",
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985'
        }
      }
    },
    toolbox: {
      feature: {
        saveAsImage: {}
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    yAxis: [
      {
        type: 'value',
        max: val => val.max * 1.5,
      }
    ],
  };

  const data = tag === "cpu" ? info.cpuUsage : info.memUsage;
  const keyWithoutAvg = Object.keys(data).slice(0, -1).map(item => parseInt(item));
  const valueWithoutAvg = [];
  for (const key of keyWithoutAvg) valueWithoutAvg.push(data[key]);
  const advancedConfig: EChartsOption = {
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        data: keyWithoutAvg,
      }
    ],
    series: [
      {
        name: `${ customKey } ${tag === "cpu" ? "的 CPU " : "的内存"}使用情况`,
        type: 'line',
        areaStyle: {},
        emphasis: {
          focus: 'series'
        },
        data: valueWithoutAvg,
        markLine: {
          data: [
            {
              type: "average",
              label: {
                position: "middle",
              },
              lineStyle: {
                color: "#d5150b",
                width: 4,
              },
            }
          ]
        }
      }
    ]
  };


  return {
    ...baseCOnfig,
    ...advancedConfig,
  };
}

export default Line;
import { useContext, useRef, useEffect } from "react";
import { Context } from "..";
import * as echarts from 'echarts/core';
import {
  TooltipComponent,
  TooltipComponentOption,
  GridComponent,
  GridComponentOption,
  ToolboxComponent,
  ToolboxComponentOption,
  LegendComponent,
  LegendComponentOption
} from 'echarts/components';
import { BarChart, BarSeriesOption } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import { UniversalTransition } from 'echarts/features';
import ReactDOM from "react-dom";

echarts.use([
  TooltipComponent, 
  GridComponent, 
  BarChart, 
  CanvasRenderer,
  UniversalTransition,
  LegendComponent,
  ToolboxComponent,
]);

type EChartsOption = echarts.ComposeOption<
  ToolboxComponentOption |
  TooltipComponentOption |
  GridComponentOption |
  BarSeriesOption |
  LegendComponentOption
>;

function Column(prop: { customKey: string }) {
  const podRunningInfo = useContext(Context);
  const podRunningInfoKeys = Object.keys(podRunningInfo);
  const containerRef = useRef<HTMLDivElement>(null);
  const chartsRef = useRef<echarts.EChartsType | null>(null);
  const { customKey } = prop;
  const info : { [podName: string]: {
    runningTime: number,
    cpuUsageAvg: number,
    memUsageAvg: number,
  } } = {}
  for (const key of podRunningInfoKeys) {
    info[key] = {
      runningTime: podRunningInfo[key].runningTime,
      cpuUsageAvg: podRunningInfo[key].cpuUsage.average,
      memUsageAvg: podRunningInfo[key].memUsage.average,
    };
  }
  useEffect(() => {
    if (chartsRef.current === null) {
      chartsRef.current = echarts.init(ReactDOM.findDOMNode(containerRef.current) as HTMLElement, "dark");
    }
    chartsRef.current.setOption(getOption(customKey, info));
  }, [customKey]);


  return (
    <div style={{ 
      width: "100%", 
      height: "500px",
    }}>
      <div style={{ width: "100%", height: "100%" }} ref={containerRef}></div>
    </div>
  );
}

function getOption(customKey: string, info : { [podName: string]: {
  runningTime: number,
  cpuUsageAvg: number,
  memUsageAvg: number,
} }): EChartsOption {
  const avgTimeOption: EChartsOption = {
    title: {
      text: "Pod 运行时间概览",
      top: "10px",
      left: "center",
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
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
    xAxis: [
      {
        type: 'category',
        data: Object.keys(info),
        axisTick: {
          alignWithLabel: true
        }
      }
    ],
    series: [
      {
        name: "运行时间",
        type: 'bar',
        barWidth: '60%',
        data: Object.values(info).map(item => item.runningTime),
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
  }

  const avgResourceOption: EChartsOption = {
    color: ['#5470C6', '#91CC75'],
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      }
    },
    grid: {
      right: '20%'
    },
    toolbox: {
      feature: {
        saveAsImage: { show: true }
      }
    },
    legend: {
      data: ['CPU 使用情况（均值）', '内存使用情况（均值）']
    },
    xAxis: [
      {
        type: 'category',
        axisTick: {
          alignWithLabel: true
        },
        data: Object.keys(info),
      }
    ],
    yAxis: [
      {
        type: 'value',
        name: 'CPU 使用情况（均值）',
        position: 'left',
        alignTicks: true,
        axisLine: {
          show: true,
          lineStyle: {
            color: '#5470C6'
          }
        },
        max: val => val.max * 1.5,
      },
      {
        type: 'value',
        name: '内存使用情况（均值）',
        position: 'right',
        alignTicks: true,
        offset: 80,
        axisLine: {
          show: true,
          lineStyle: {
            color: '#91CC75'
          }
        },
      },
    ],
    series: [
      {
        name: 'CPU 使用情况（均值）',
        type: 'bar',
        data: Object.values(info).map(item => item.cpuUsageAvg),
        markLine: {
          data: [
            { 
              type: 'average',
              label: {
                position: "insideMiddleTop",
              },
              lineStyle: {
                width: 4,
              },
            }
          ]
        }
      },
      {
        name: '内存使用情况（均值）',
        type: 'bar',
        yAxisIndex: 1,
        data: Object.values(info).map(item => item.memUsageAvg),
        markLine: {
          data: [
            { 
              type: 'average',
              label: {
                position: "insideMiddleBottom",
              },
              lineStyle: {
                width: 4,
              },
            }
          ]
        }
      }
    ]
  }

  return customKey === "avgTime" ? avgTimeOption : avgResourceOption;
}

export default Column;

/**
 * useEffect 用法解析 :
 * useEffect 有两个参数，如果不传第二个参数，那么每次组件刷新时，effect 函数都会执行，但是如果传入了第二个参数，那么在初次渲染之后，仅会在依赖值变更之后再执行 effect 函数，如果给第二个参数传入一个空的数组，即意味着这个 Effect 谁都没有依赖，那么这就意味着只会在初次渲染的时候来执行这个东西，以后就不会重新去执行了。
*/
import * as echarts from 'echarts/core';
import { LineSeriesOption } from "echarts/charts";
import { GridComponentOption, LegendComponentOption, TitleComponentOption, ToolboxComponentOption, TooltipComponentOption } from "echarts/components";
import { INodeState } from '../../node.slice';
import 'echarts/lib/component/markLine';

type EChartsOption = echarts.ComposeOption<
  | TitleComponentOption
  | ToolboxComponentOption
  | TooltipComponentOption
  | GridComponentOption
  | LegendComponentOption
  | LineSeriesOption
>;

function getOption(tag: string, info: INodeState): EChartsOption {
  const baseConfig: EChartsOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985'
        }
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        data: ['第一次', '第二次', '第三次', '第四次', '第五次'],
      }
    ],
    toolbox: {
      feature: {
        saveAsImage: {}
      }
    },
    yAxis: [
      {
        type: 'value',
        min: val => val.min / 2,
        max: val => val.max * 1.5,
      }
    ]
  };
  const colorArr = ['#80FFA5', '#00DDFF', '#37A2FF', '#FF0087', '#FFBF00'];
  const advancedConfig: EChartsOption = {};
  const infoKeys = Object.keys(info);
  const data: { [nodeName: string]: number[] } = {};
  const averages: { [nodeName: string]: number } = {};
  for (const key of infoKeys) {
    if (tag === "cpu") {
      data[key] = Object.values(info[key].idleCPU).map(item => item * info[key].numsCPU).slice(0, 5);
      averages[key] = info[key].idleCPU.average * info[key].numsCPU;
    } else {
      data[key] = Object.values(info[key].availableMem).slice(0, 5);
      averages[key] = info[key].availableMem.average;
    }
  }
  advancedConfig.color = colorArr.slice(0, infoKeys.length);
  advancedConfig.legend = { data: infoKeys };
  advancedConfig.series = [];
  for (const key of infoKeys) {
    advancedConfig.series.push({
      name: key,
      type: 'line',
      stack: 'Total',
      areaStyle: {},
      emphasis: {
        focus: 'series'
      },
      data: data[key],
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
    });
  }

  return {
    ...baseConfig,
    ...advancedConfig,
  };
}

export default getOption;
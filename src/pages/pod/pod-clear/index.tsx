import { Card, Button, Popconfirm, message } from "antd";
import styleNative from "./style.module.scss";
import convert from "../../../utils/proxy";
import { DeleteOutlined, QuestionCircleOutlined, ReloadOutlined } from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { getNodesApi } from "../../home/home.slice";
import { useEffect, useRef } from "react";
import { shallowEqual } from "react-redux";
import { Graph, Tooltip } from '@antv/g6';
import ReactDOM from 'react-dom';
import { getData } from "./graph-data";
import { Tooltip as TooltipType } from "@antv/g6-plugin";
import { clearPods } from "../../../api";


interface IPod {
  [podName: string]: {
    image: string,
    status: number,
    githubUrl: string,
    calcMetrics: string,
  }
}

function PodClear() {
  const style = convert<typeof styleNative>(styleNative);
  const getNodesApiData = useAppSelector(state => state.home.getNodesApiData, shallowEqual);
  const getNodesApiDataKeys = Object.keys(getNodesApiData);
  const dispatch = useAppDispatch();
  const graphRef = useRef<Graph | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const oldTooltipRef = useRef<TooltipType | null>(null);
  const podList: IPod = {};
  let creatingPodNums = 0, runningPodNums = 0;
  for (const nodeName of getNodesApiDataKeys) {
    const pods = getNodesApiData[nodeName].pods;
    const podNameList = Object.keys(pods);
    for (const podName of podNameList) {
      if (pods[podName].status === 0) creatingPodNums++;
      else if (pods[podName].status === 1) runningPodNums++;
      podList[podName] = pods[podName];
    }
  }
  const data = getData(podList);
  let tooltip: TooltipType | null = null;
  if (getNodesApiDataKeys.length !== 0) {
    tooltip = new Tooltip({
      offsetX: 10,
      offsetY: 10,
      itemTypes: ["node"],
      getContent: (e) => {
        const div = document.createElement('div');
        const podName = e!.item?._cfg!.id;
        // 此处删去了 image 的跳转链接，因为 tooltip 会跟随鼠标移动。
        div.innerHTML = `
          <div class="pod-name">${podName}</div>
          <ul>
            <li>
              <span class="span-key">状态</span>
              <span>:</span>
              <span id="tooltip-pod-status-value" class="span-value span-mark">${podList[podName!].status === 0 ? "创建中" : podList[podName!].status === 1 ? "运行中" : "已完成"}</span>
            </li>
            <li>
              <span class="span-key">Docker 镜像</span>
              <span>:</span>
              <span class="span-value span-mark docker-image">
                ${podList[podName!].image}
              </span>
            </li>
            <li>
              <span class="span-key">计算量</span>
              <span>:</span>
              <span class="span-value span-mark info">${podList[podName!].calcMetrics}</span>
            </li>
          </ul>
        `;
        if (podList[podName!].status === 0) div.querySelector("#tooltip-pod-status-value")?.classList.add("create")
        else if (podList[podName!].status === 1) div.querySelector("#tooltip-pod-status-value")?.classList.add("running");
        else div.querySelector("#tooltip-pod-status-value")?.classList.add("finish");
        return div;
      },
    });
  }

  useEffect(() => {
    if (getNodesApiDataKeys.length === 0) {
      dispatch(getNodesApi());
    }
    if (graphRef.current === null) {
      graphRef.current = new Graph({
        container: ReactDOM.findDOMNode(containerRef.current) as HTMLElement,
        layout: {
          type: 'circular',
        },
        animate: true,
        defaultNode: {
          type: 'image',
        },
        modes: {
          default: ["drag-canvas", "drag-node"],
        },
      });
      graphRef.current.on('node:mouseenter', (e) => {
        graphRef.current!.setItemState(e.item!, 'active', true);
      });
      graphRef.current.on('node:mouseleave', (e) => {
        const canvas = containerRef.current?.childNodes[0] as HTMLCanvasElement;
        canvas.style.cursor = "grab";
        graphRef.current!.setItemState(e.item!, 'active', false);
      });
      graphRef.current.on('canvas:mouseenter', () => {
        const canvas = containerRef.current?.childNodes[0] as HTMLCanvasElement;
        canvas.style.cursor = "grab";
      });
      graphRef.current.on('canvas:mousedown', () => {
        const canvas = containerRef.current?.childNodes[0] as HTMLCanvasElement;
        canvas.style.cursor = "grabbing";
      });
      graphRef.current.on('canvas:mouseup', () => {
        const canvas = containerRef.current?.childNodes[0] as HTMLCanvasElement;
        canvas.style.cursor = "grab";
      });
    }
    if (tooltip !== null) {
      if (oldTooltipRef.current !== null) graphRef.current.removePlugin(oldTooltipRef.current);
      graphRef.current.addPlugin(tooltip);
      oldTooltipRef.current = tooltip;
    }
    graphRef.current.data(data);
    graphRef.current.render();
  }, [getNodesApiData]);

  const clearPodConfirmHandler = async () => {
    const { data } = await clearPods();
    await dispatch(getNodesApi());
    if (data.clearPodsCode === 200) message.success("清空成功");
    else message.success("清空失败");
    
  }

  const loadPodOverview = () => {
    dispatch(getNodesApi()).
      then(() => message.success("已重新获取 Pod 概览信息"));
  };

  return (
    <div className={style.podClearWrapper}>
      <Card title={
        <div className={style.cardTitle}>
          当前共有 <span className={`${style.spanMark} ${style.info}`}>{Object.keys(podList).length}</span> 个 Pod，其中 <span className={`${style.spanMark} ${style.create}`}>{creatingPodNums}</span> 个 Pod 处于 <span className={`${style.spanMark} ${style.create}`}>创建</span> 状态，<span className={`${style.spanMark} ${style.running}`}>{runningPodNums}</span> 个 Pod 处于 <span className={`${style.spanMark} ${style.running}`}>运行</span> 状态，<span className={`${style.spanMark} ${style.finish}`}>{Object.keys(podList).length - runningPodNums - creatingPodNums}</span> 个 Pod 处于 <span className={`${style.spanMark} ${style.finish}`}>完成</span> 状态
        </div>
      } extra={
        <div className={style.extraButtonGroup}>
          <Button type="primary" icon={<ReloadOutlined />} size="middle" onClick={(e) => loadPodOverview()}>
            刷新 Pod 概览
          </Button>
          <Popconfirm
            title="这将删除所有的 Pod，确认继续吗?"
            placement="left"
            showCancel={false}
            okText="确认"
            okType="danger"
            icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
            onConfirm={clearPodConfirmHandler}
          >
            <Button type="primary" danger icon={<DeleteOutlined />} size="middle">
              删除所有 Pod
            </Button>
          </Popconfirm>
        </div>
      }>
        <div className={style.container} ref={containerRef}></div>
      </Card>
    </div>
  );
}

export default PodClear;

export {
  IPod
};
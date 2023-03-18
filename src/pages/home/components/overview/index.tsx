import { Graph } from '@antv/g6';
import { useEffect, useRef, useContext } from 'react';
import ReactDOM from 'react-dom';
import { Context } from "../..";
import { getData } from './graph-data';
import styleNative from "./style.module.scss";
import convert from '../../../../utils/proxy';
import { InfoCircleOutlined } from "@ant-design/icons";

interface IEdgeConfig {
 id: string, // edge id
 source: {
  id: string, // node id
  size: number,
 },
 target: {
  id: string, // node id
  size: number,
 }
}

function Overview() {
  const containerRef = useRef<HTMLDivElement>(null);
  let graphRef = useRef<Graph | null>(null);
  // store 每改变一次，Overview 就会重新渲染一次，
  // 为了不让 graph 重复地 new，出现多个 canvas，需要使用 ref。
  const getNodesApiData = useContext(Context);
  const getNodesApiDataKey = Object.keys(getNodesApiData);
  const data = getData(getNodesApiData);
  const style = convert<typeof styleNative>(styleNative);
  useEffect(() => {
    if (graphRef.current === null) {
      graphRef.current = new Graph({
        container: ReactDOM.findDOMNode(containerRef.current) as HTMLElement,
        layout: {
          type: 'force',
          preventOverlap: true,
          linkDistance: (e: IEdgeConfig) => getNodesApiDataKey.includes(e.target.id) ? 150 : (e.source.id === "node00" ? 150 : 75),
          nodeStrength: -750
        },
        defaultNode: {
          type: 'image',
        },
        modes: {
          default: ['drag-canvas'],
        },
      });
      graphRef.current.on('node:dragstart', function (e) {
        graphRef.current!.layout();
        const model = e.item!.get('model');
        model.fx = e.x;
        model.fy = e.y;
      });
      graphRef.current.on('node:drag', function (e) {
        const model = e.item!.get('model');
        model.fx = e.x;
        model.fy = e.y;
      });
      graphRef.current.on('node:dragend', function (e) {
        e.item!.get('model').fx = null;
        e.item!.get('model').fy = null;
      });
      graphRef.current.on('node:mouseleave', (e) => {
        const canvas = containerRef.current?.childNodes[0] as HTMLCanvasElement;
        canvas.style.cursor = "grab";
      });
      graphRef.current.on('node:dblclick', (e) => {
        window.location.href = `#${e.item?._cfg!.id}`;
      });
      graphRef.current.on('canvas:mouseenter', (e) => {
        const canvas = containerRef.current?.childNodes[0] as HTMLCanvasElement;
        canvas.style.cursor = "grab";
      });
      graphRef.current.on('canvas:mousedown', (e) => {
        const canvas = containerRef.current?.childNodes[0] as HTMLCanvasElement;
        canvas.style.cursor = "grabbing";
      });
      graphRef.current.on('canvas:mouseup', (e) => {
        const canvas = containerRef.current?.childNodes[0] as HTMLCanvasElement;
        canvas.style.cursor = "grab";
      });
    }
    graphRef.current.data(data);
    graphRef.current.render();
  }, [getNodesApiData]);

  return (
    <div className={style.overviewWrapper}>
      <div className={style.container} ref={containerRef}></div>
      <span className={style.tips}> <InfoCircleOutlined /> 双击元素可跳转 </span>
    </div>
  );
}

export {
  Overview,
};


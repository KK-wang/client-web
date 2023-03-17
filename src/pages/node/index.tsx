import { Card, Anchor, AnchorProps, message, Skeleton, Button } from "antd";
import styleNative from "./style.module.scss";
import convert from "../../utils/proxy";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { shallowEqual } from "react-redux";
import { useEffect, useState, createContext } from "react";
import { getAllNodesMetricsApi, setLoading, INodeState } from "./node.slice";
import { ReloadOutlined, CopyOutlined, LineChartOutlined } from "@ant-design/icons";
import { AlgorithmReqParam } from "../algorithm/algorithm.slice";
import node from "../../assets/img/node.png";
import Chart from "./components/chart";
import Json from "./components/json";

export const Context = createContext<INodeState>({});

function Node() {
  const style = convert<typeof styleNative>(styleNative);
  type AnchorItem = Required<AnchorProps>['items'][number];
  const dispatch = useAppDispatch();
  const store = useAppSelector(state => state.node.getAllNodesMetricsData, shallowEqual);
  const loading = useAppSelector(state => state.node.loading, shallowEqual);
  const [activeKeys, setActiveKeys] = useState<{ [nodeName: string]: string }>({
    node00: "cpu",
    others: "cpu",
  });
  const storeKeys = Object.keys(store);
  useEffect(() => {
    if (storeKeys.length === 0) {
      loadNodeInfo();
    }
  }, []);

  const anchorItems: AnchorItem[] = [
    {
      key: 0,
      href: `#node00`,
      title: "node00 的 CPU 及内存使用情况",
    },
    {
      key: 1,
      href: `#others`,
      title: "其他节点的 CPU 及内存使用情况",
    }
  ];


  const loadNodeInfo = async () => {
    dispatch(setLoading(true));
    await dispatch(getAllNodesMetricsApi());
    setActiveKeys({
      node00: "cpu",
      others: "cpu",
    });
    message.success("已获取 Node 信息");
    dispatch(setLoading(false));
  };

  const tabList = [
    {
      key: "cpu",
      tab: "CPU 占用图表",
    },
    {
      key: "mem",
      tab: "内存占用图表",
    },
    {
      key: "json",
      tab: "JSON 数据",
    }
  ];

  const cardContentList = (nodeName: string) => 
    activeKeys[nodeName] === "json" ? <Json nodeName={nodeName}/> : 
      <Chart tag={activeKeys[nodeName]} nodeName={nodeName}/>;
  
  return (
    <div className={style.nodeWrapper}>
      <div className={style.anchor}>
        <Skeleton active={true} loading={loading} title={false} paragraph={{ width: "100%", rows: 7 }}>
          <Anchor items={anchorItems}/>
        </Skeleton>
      </div>
      <div className={style.buttonGroup}>
        <Button
          className={style.copyBtn}
          type="primary"
          icon={<CopyOutlined />}
          disabled={loading}
          onClick={() => {
            const info: AlgorithmReqParam.AlgorithmReqNode[] = [];
            for (const key of storeKeys) {
              info.push({
                nodeName: key,
                cpu: store[key].numsCPU * store[key].idleCPU.average,
                mem: store[key].availableMem.average,
              });
            }
            navigator.clipboard.writeText(JSON.stringify(info, null, 2)).
              then(() => message.success("已拷贝 Node 均值信息到剪切板"))
          }}
        >
          拷贝 Node 均值信息
        </Button>
        <Button
          type="primary"
          icon={<ReloadOutlined />}
          loading={loading}
          onClick={loadNodeInfo}
        >
          重新获取 Node 信息
        </Button>
      </div>
      {
        ["node00", "others"].map(item => (
          loading ? (
            <div className={style.firstLoadingSkeleton} key={item}>
              <Skeleton active title={false} paragraph={{rows: 3, width: "100%"}}/>
              <Skeleton.Node active>
                <LineChartOutlined style={{ fontSize: 150, color: '#bfbfbf' }} />
              </Skeleton.Node>
            </div>
          ) : 
          (
            <div className={style.antCardContainer} key={item}>
              <Card
                tabList={tabList}
                tabProps={{
                  defaultActiveKey: "cpu",
                  activeKey: activeKeys[item],
                  onTabClick: (key) => {
                    activeKeys[item] = key;
                    setActiveKeys({ ...activeKeys });
                  }
                }}
                extra={
                  <div id={item} className={style.extraTitle}>
                    <img width={45} src={node} alt="" />
                    <span>{item === "node00" ? "node00 " : "其他节点" }的 CPU 及内存使用情况</span>
                  </div>}
              >
                <Context.Provider value={store}>{cardContentList(item)}</Context.Provider>
              </Card>
            </div>
          )
        ))
      }
    </div>
  );
}

export default Node;

/**
 * 我们要知道两个事实：
 * 1. useRef 和 useState 的数据在组件卸载销毁之后，就无法再拿到了，之后只能获取 init value。
 * 2. React Router 的路由切换方式是卸载并销毁当前组件，并且其没有 vue 那种 keep alive 的路由切换方式。
 * 
 * 综上所述，为了保存 loading 状态，只能将其保存到 redux 中。
 */
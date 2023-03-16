import { Card, Anchor, AnchorProps, message, Skeleton, Button } from "antd";
import styleNative from "./style.module.scss";
import convert from "../../utils/proxy";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { shallowEqual } from "react-redux";
import { useEffect } from "react";
import { getAllNodesMetricsApi, setLoading as _setLoading } from "./node.slice";
import { ReloadOutlined, CopyOutlined } from "@ant-design/icons";
import { AlgorithmReqParam } from "../algorithm/algorithm.slice";

function Node() {
  const style = convert<typeof styleNative>(styleNative);
  type AnchorItem = Required<AnchorProps>['items'][number];
  const dispatch = useAppDispatch();
  const store = useAppSelector(state => state.node.getAllNodesMetricsData, shallowEqual);
  const loading = useAppSelector(state => state.node.loading, shallowEqual);
  const storeKeys = Object.keys(store);
  useEffect(() => {
    if (storeKeys.length === 0) {
      loadNodeInfo();
    }
  }, []);

  const anchorItems: AnchorItem[] = [];
  
  for (let i = 0; i < storeKeys.length; i++) {
    anchorItems.push({
      key: i,
      href: `#${storeKeys[i]}`,
      title: `${storeKeys[i]} 的 CPU 及内存使用情况`,
    });
  }

  const loadNodeInfo = async () => {
    setLoading(true);
    await dispatch(getAllNodesMetricsApi());
    message.success("已获取 Node 信息");
    setLoading(false);
  };

  const setLoading = (loading: boolean) => {
    dispatch(_setLoading(loading))
  }

  return (
    <div className={style.nodeWrapper}>
      <div className={style.anchor}>
        <Skeleton active={true} loading={loading} title={false} paragraph={{ width: "100%", rows: 7 }}>
          <Anchor items={anchorItems}/>
        </Skeleton>
      </div>
      <div className={style.antCardContainer}>
        {
          
        }
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
            navigator.clipboard.writeText(JSON.stringify(info)).
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
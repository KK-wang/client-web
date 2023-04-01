import { Card, Button, Tabs, Skeleton, message, TabsProps } from "antd";
import styleNative from "./style.module.scss";
import convert from "../../../utils/proxy";
import { CopyOutlined, SyncOutlined, AreaChartOutlined } from "@ant-design/icons";
import { getAllPodsRunningInfoApi, setFetchPodRunningInfo, PodType } from "../pod.slice";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { shallowEqual } from "react-redux";
import Line from "./chart/line";
import Column from "./chart/column";
import { createContext } from "react";
import copy from "../../../utils/copy";

export const Context = createContext<PodType.PodRunningInfo>({});

function PodRunningInfo() {
  const style = convert<typeof styleNative>(styleNative);
  const dispatch = useAppDispatch();
  const podRunningInfo = useAppSelector(state => state.pod.podRunningInfo, shallowEqual);
  const isFetchPodRunningInfo = useAppSelector(state => state.pod.isFetchPodRunningInfo, shallowEqual);
  const podRunningInfoKeys = Object.keys(podRunningInfo);

  const getPodRunningInfoHandler = async () => {
    message.info("正在获取 Pod 运行信息");
    dispatch(setFetchPodRunningInfo(true));
    const res = await dispatch(getAllPodsRunningInfoApi());
    if (res.payload === 299) {
      message.error("还有 Pod 处于未完成状态");
      dispatch(setFetchPodRunningInfo(false));
      return;
    }
    dispatch(setFetchPodRunningInfo(false));
    message.success("所有 Pod 的运行信息获取成功");
  }

  const copyPodRunningInfoHandler = () => {
    const info: { [podName: string]: {
      runningTime: number,
      cpuUsageAvg: number,
      memUsageAvg: number,
    } } = {};
    for (const key of podRunningInfoKeys) {
      info[key] = {
        runningTime: parseFloat(podRunningInfo[key].runningTime.toFixed(2)),
        cpuUsageAvg: parseFloat(podRunningInfo[key].cpuUsage.average.toFixed(2)),
        memUsageAvg: parseFloat(podRunningInfo[key].memUsage.average.toFixed(2)),
      };
    }
    copy(JSON.stringify(info, null, 2)).
      then(() => message.success("已拷贝所有 Pod 的运行概览信息到剪切板"))
  }

  const getChart = (customKey: string, tag?: string) => {
    if (customKey === "avgTime" || customKey === "avgResource") return <Column customKey={customKey} />;
    else return <Line customKey={customKey} tag={tag!} />
  }

  const tabItems: TabsProps["items"] = [
    {
      key: "avgTime",
      label: <span style={{ fontWeight: "bold" }}>运行时间概览</span>,
      children: getChart("avgTime"),
    },
    {
      key: "avgResource",
      label: <span style={{ fontWeight: "bold" }}>资源使用概览</span>,
      children: getChart("avgResource"),
    },
  ];

  for (const key of podRunningInfoKeys) {
    tabItems.push({
      key: key,
      label: key,
      children: (
        <div className={style.podTabsWrapper}>
          <Tabs
            tabPosition="top"
            items={[
              {
                key: "cpu",
                label: "CPU 使用情况",
                children: getChart(key, "cpu"),
              },
              {
                key: "mem",
                label: "内存使用情况",
                children: getChart(key, "mem"),
              }
            ]}
          />
        </div>
      ),
    });
  }

  return (
    <div className={style.podRunningInfoWrapper}>
      <Card title="Pod 运行信息" extra={
        <div className={style.extraButtonGroup}>
          <Button type="primary" icon={<SyncOutlined />} size="middle" disabled={isFetchPodRunningInfo} onClick={getPodRunningInfoHandler}>
            获取/刷新 所有 Pod 的运行信息
          </Button>
          <Button type="primary" icon={<CopyOutlined />} size="middle" disabled={podRunningInfoKeys.length === 0 || isFetchPodRunningInfo } onClick={copyPodRunningInfoHandler}>
            复制所有 Pod 的运行概览信息 
          </Button>
        </div>
      }>
        {
          (podRunningInfoKeys.length === 0 || isFetchPodRunningInfo) ? (
            <div className={style.skeleton}>
              <Skeleton title={false} paragraph={{ rows: 3, width: "100%" }} active={isFetchPodRunningInfo}/>
              <div className={style.skeletonContent}>
                <Skeleton title={false} paragraph={{rows: 10, width: "100%"}} active={isFetchPodRunningInfo}/>
                <Skeleton.Node active={isFetchPodRunningInfo}>
                  <AreaChartOutlined style={{ fontSize: 150, color: '#bfbfbf' }}/>
                </Skeleton.Node>
              </div>
              <Skeleton title={false} paragraph={{ rows: 2, width: "100%" }} active={isFetchPodRunningInfo}/>
            </div>
          ) : (
            <div className={style.tabsWrapper}>
              <Context.Provider value={podRunningInfo}>
                <Tabs 
                  tabPosition="left"
                  style={{ height: "500px" }}
                  items={tabItems}
                />
              </Context.Provider>
            </div>
          )
        }
      </Card>
    </div>
  );
}

export default PodRunningInfo;
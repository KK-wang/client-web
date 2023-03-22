import { Card, Button, Tabs, Skeleton, message } from "antd";
import styleNative from "./style.module.scss";
import convert from "../../../utils/proxy";
import { CopyOutlined, CloudDownloadOutlined, AreaChartOutlined } from "@ant-design/icons";
import { getAllPodsRunningInfoApi, setFetchPodRunningInfo } from "../pod.slice";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { shallowEqual } from "react-redux";

function PodRunningInfo() {
  const style = convert<typeof styleNative>(styleNative);
  const dispatch = useAppDispatch();
  const podRunningInfo = useAppSelector(state => state.pod.podRunningInfo, shallowEqual);
  const isFetchPodRunningInfo = useAppSelector(state => state.pod.isFetchPodRunningInfo, shallowEqual);
  const podRunningInfoKeys = Object.keys(podRunningInfo);

  const getPodRunningInfoHandler = () => {
    dispatch(setFetchPodRunningInfo(true));
    
  }

  return (
    <div className={style.podRunningInfoWrapper}>
      <Card title="Pod 运行信息" extra={
        <div className={style.extraButtonGroup}>
          <Button type="primary" icon={<CloudDownloadOutlined />} size="middle" onClick={getPodRunningInfoHandler}>
            获取所有 Pod 的运行信息
          </Button>
          <Button type="primary" icon={<CopyOutlined />} size="middle" disabled={podRunningInfoKeys.length === 0 || isFetchPodRunningInfo }>
            复制所有 Pod 的运行信息 
          </Button>
        </div>
      }>
        {
          podRunningInfoKeys.length === 0 ? (
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
              <Tabs 
                tabPosition="left"
                style={{ height: "500px" }}
                items={new Array(30).fill(null).map((_, i) => {
                  const id = String(i + 1);
                  return {
                    label: `Tab ${id}`,
                    key: id,
                    children: `Content of Tab ${id}`,
                  };
                })}
              />
            </div>
          )
        }
      </Card>
    </div>
  );
}

export default PodRunningInfo;
import { Card, Anchor, AnchorProps, Button, Popover, message } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import convert from "../../utils/proxy";
import styleNative from "./style.module.scss";
import { useEffect, createContext } from "react";
import { shallowEqual } from "react-redux";
import { getNodesApi, IHomeState } from "./home.slice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { Overview } from "./components/overview";
import { Detail } from "./components/detail";
import master from "../../assets/img/master.png";
import node from "../../assets/img/node.png";

export const Context = createContext<IHomeState>({});

function Home() {
  type AnchorItem = Required<AnchorProps>['items'][number];
  // 上面这个是 TS 拆解类型的语法，Required<AnchorProps>['items'] 表示获取 AnchorProps 类型中 items 属性的类型，但是由于其是一个数组，所以使用 [number] 来获取数组中元素的类型。
  const dispatch = useAppDispatch();
  const store = useAppSelector(state => state.home.getNodesApiData, shallowEqual);
  const storeKeys = Object.keys(store);
  useEffect(() => {  
    if (storeKeys.length === 0)
      loadClusterInfo() 
      // 数据已经存储到了 redux 中，直接取用就可以。 
  }, []);
  const style = convert<typeof styleNative>(styleNative);
  const anchorItems: AnchorItem[] = [
    {
      key: "0",
      href: "#cluster",
      title: "边缘计算平台集群概览",
    }
  ];
  for (let i = 1; i <= storeKeys.length; i++) {
    anchorItems.push({
      key: `${i}`,
      href: `#${storeKeys[i - 1]}`,
      title: `${storeKeys[i - 1]} 节点概览`,
    });
  }

  const loadClusterInfo = (e?: any) => {
    dispatch(getNodesApi()).then(() => e && message.success("已刷新集群状态"));
  };

  return (
    <div className={style.homeContent}>
      <div className={style.anchor}>
        <Anchor items={anchorItems}/>
      </div>
      {
        ["cluster", ...storeKeys].map(key => {
          return (
            <div id={key} className={style.antCardContainer} key={key}>
              <Context.Provider value={store}>
                {
                  key === "cluster" ? 
                    <Card title="边缘计算平台集群概览" 
                      extra={
                        <Popover content={<div style={{maxWidth: "150px"}}>重新获取集群及集群中各个节点和 pod 的信息</div>} placement="left">
                          <Button type="primary" shape="round" icon={<ReloadOutlined />} size="middle" onClick={(e) => loadClusterInfo(e)}>
                            刷新集群状态
                          </Button>
                        </Popover>
                      }>
                      <Overview />
                    </Card> :
                    <Card title={`${key} 节点概览`} extra={
                       <div className={style.cardExtra}><img width={50} height={50} src={key === "master" ? master : node}/></div>
                    }>
                      <Detail storeKey={key} />
                    </Card>
                }
              </Context.Provider>
            </div>
          );
        })
      }
    </div>
    
  );
}

export default Home;
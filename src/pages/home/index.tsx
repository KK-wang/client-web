import { Card, Anchor, AnchorProps } from "antd";
import convert from "../../utils/proxy";
import styleNative from "./style.module.scss";
import { useState, useEffect } from "react";
import { shallowEqual } from "react-redux";
import { getNodesApi } from "./home.slice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";

function Home() {
  type AnchorItem = Required<AnchorProps>['items'][number];
  // 上面这个是 TS 拆解类型的语法，Required<AnchorProps>['items'] 表示获取 AnchorProps 类型中 items 属性的类型，但是由于其是一个数组，所以使用 [number] 来获取数组中元素的类型。
  const dispatch = useAppDispatch();
  const store = useAppSelector(state => state.home.getNodesApiData, shallowEqual);
  useEffect(() => { dispatch(getNodesApi()) }, []);
  const style = convert(styleNative);
  const [anchorItems, setAnchorItems] = useState<AnchorItem[]>([
    {
      key: "0",
      href: "#cluster-overview",
      title: "边缘计算集群概览",
    },
  ]);

  for (const [key, value] of Object.entries(store)) {
    
  }


  return (
    <div className={style.homeContent}>
      <div className={style.anchor}>
        <Anchor items={[]}/>
      </div>
      <h2 id="cluster-overview">边缘计算平台集群概况</h2>
    </div>
    
  );
}

export default Home;
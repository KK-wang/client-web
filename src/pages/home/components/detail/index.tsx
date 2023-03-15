import { useContext } from "react";
import { Context } from "../..";
import styleNative from "./style.module.scss"
import convert from "../../../../utils/proxy";
import { Icon } from "@iconify/react";
import pod from "../../../../assets/img/pod.png";

interface DetailProps {
  storeKey: string,
}

function Detail(prop: DetailProps) {
  const store = useContext(Context);
  const info = store[prop.storeKey];
  const style = convert<typeof styleNative>(styleNative);

  return (
    <div className={style.detailWrapper}>
      <ul>
        <li>
          <span className={style.spanKey}>状态</span>
          <span>:</span>
          <span className={style.spanValue}>{info.status ? <span className={`${style.spanMark} ${style.running}`}>运行</span> : <span className={`${style.spanMark} ${style.error}`}>宕机</span>}</span>
        </li>
        <li>
          <span className={style.spanKey}>IP</span>
          <span>:</span>
          <span className={`${style.spanValue} ${style.spanMark} ${style.info}`}>{info.ip}</span>
        </li>
        <li>
          <span className={style.spanKey}>CPU</span>
          <span>:</span>
          <span className={`${style.spanValue} ${style.spanMark} ${style.info}`}>{info.cpu}</span>
        </li>
        <li>
          <span className={style.spanKey}>内存</span>
          <span>:</span>
          <span className={`${style.spanValue} ${style.spanMark} ${style.info}`}>{info.mem}</span>
        </li>
        <li>
          <span className={style.spanKey}>操作系统</span>
          <span>:</span>
          <span className={`${style.spanValue} ${style.spanMark} ${style.info}`}>{info.os}</span>
        </li>
        <li>
          <span className={style.spanKey}>登入用户</span>
          <span>:</span>
          <span className={`${style.spanValue} ${style.spanMark} ${style.info}`}>{info.role}</span>
        </li>
        <li>
          <span className={style.spanKey}>Kubernates 版本</span>
          <span>:</span>
          <span className={`${style.spanValue} ${style.spanMark} ${style.info}`}>{info.k8sVersion}</span>
        </li>
        <li>
          <span className={style.spanKey}>Docker 版本</span>
          <span>:</span>
          <span className={`${style.spanValue} ${style.spanMark} ${style.info}`}>{info.dockerVersion}</span>
        </li>
        <li>
          <span className={style.spanKey}>公有云平台</span>
          <span>:</span>
          <span className={`${style.spanValue} ${style.spanMark} ${style.info}`}>{info.business}</span>
        </li>
        <li>
          <span className={style.spanKey}>Pod 运行情况</span> 
          <span>:</span>
          {
            Object.keys(info.pods).length === 0 ? 
              null : 
              <span className={style.spanValue}>
                {
                  Object.keys(info.pods).length === Object.keys(info.pods).reduce((pre, item) => info.pods[item].status ? pre : pre + 1, 0) ? <span className={`${style.spanMark} ${style.finish}`}>全部完成</span> : <span className={`${style.spanMark} ${style.running}`}>仍有 Pod 执行</span> 
                }
              </span>
          }
          {
            Object.keys(info.pods).length === 0 ? 
              (prop.storeKey === "master" ? 
                <span className={`${style.spanValue} ${style.spanMark} ${style.info}`}>Master 节点不承担运行 Pod 的职责</span> : 
                <span className={`${style.spanValue} ${style.spanMark} ${style.info}`}>没有给该节点调度 Pod 计算任务</span>) : 
              <div><ul>
                {
                  Object.keys(info.pods).map(item => 
                    <li key={item}>
                      <span className={style.spanKey} id={item}>Pod 名称</span>
                      <span>:</span>
                      <span className={`${style.spanValue} ${style.spanMark} ${style.info}`}>{item}</span> <img width={30} height={30} style={{position: "relative", top: "7.5px", marginLeft: "10px"}} src={pod} />
                      <ul>
                        <li>
                          <span className={style.spanKey}>Docker 镜像</span>
                          <span>:</span>
                          <span className={`${style.spanValue} ${style.spanMark} ${style.dockerImage}`} style={{ fontWeight: "bold" }} onClick={() => window.open(info.pods[item].githubUrl, "target")}><Icon icon="ant-design:github-outlined" /> {info.pods[item].image}</span>
                        </li>
                        <li>
                          <span className={style.spanKey}>状态</span>
                          <span>:</span>
                          <span className={style.spanValue}>{info.pods[item].status ? <span className={`${style.spanMark} ${style.running}`}>运行</span> : <span className={`${style.spanMark} ${style.finish}`}>完成</span>}</span>
                        </li>
                        <li>
                          <span className={style.spanKey}>计算量</span>
                          <span>:</span>
                          <span className={`${style.spanValue} ${style.spanMark} ${style.info}`}>{info.pods[item].calcMetrics}</span>
                        </li>
                      </ul>
                    </li>
                  )
                }
              </ul></div>
          }
        </li>
      </ul>
    </div>
  );
}

export {
  Detail
};
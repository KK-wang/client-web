import { Card, Button, message, Modal } from "antd";
import styleNative from "./style.module.scss";
import convert from "../../../utils/proxy";
import { AppstoreAddOutlined, ExclamationCircleFilled } from "@ant-design/icons";
import MacCodeBlock from "../../../common/mac-code-block";
import JsonEditor from "../../../common/json-editor";
import { createPods } from "../../../api";
import { getNodesApi } from "../../home/home.slice";
import { useAppDispatch } from "../../../store/hooks";
import { podCreateParamValidator as validator } from "../../../utils/json-validator";
import { useState } from "react";
import { PodType } from "../pod.slice";

const { info } = Modal;

function PodCreate() {
  const style = convert<typeof styleNative>(styleNative);
  const dispatch = useAppDispatch();
  const [jsonStr, setJsonStr] = useState<string>("");
  
  const createPodHandler = async () => {
    let json: PodType.PodCreateParam[] | null = null
    try { json = JSON.parse(jsonStr) }
    catch { message.error("Pod 创建信息的值含有 JSON 语法错误"); return; }
    if (validator(json)) {
      setJsonStr("");
      message.info("Pod 创建中，请稍后...");
      const { data } = await createPods({
        podsBody: json!,
      });
      await dispatch(getNodesApi());
      const dataKeys = Object.keys(data);
      info({
        title: "Pod 创建完成，列表如下：",
        content: (
          <div className="create-pod-info-modal">
            <ul>
              {
                dataKeys.map(podName => (
                  <li key={podName} className="create-pod-info-modal-li">
                    <span className="span-key">{podName}</span>
                    <span style={{ fontWeight: "bold" }}>:</span>
                    {
                      data[podName] === 201 ? 
                        (<span className="span-value span-mark success">创建成功</span>) :
                        (<span className=" span-value span-markerror">创建失败</span>)
                    }
                  </li>
                ))
              }
            </ul>
          </div>
        ),
        icon: <ExclamationCircleFilled />,
      });
    } else message.error("请保证 Pod 创建信息的值符合给定的 JSON schema");
  }

  return (
    <div className={style.podCreateWrapper}>
      <Card title="创建 Pod 的 JSON 配置" extra={
        <Button type="primary" icon={<AppstoreAddOutlined />} size="middle" onClick={createPodHandler}>
          创建 Pod
        </Button>
      }>
        <div className={style.macCodeBlockWrapper}>
          <MacCodeBlock>
            <div className={style.jsonEditorWrapper}>
              <JsonEditor
                value={jsonStr}
                onChange={val => setJsonStr(val)} 
                placeholder={`
请输入 JSON 格式的 Pod 创建信息。
JSON schema 如下: 
{
  "podName": string,
  "image": string,
  "nodeName": string,
}[]`
              }/>
            </div>
          </MacCodeBlock>
        </div>
      </Card>
    </div>
  );
}

export default PodCreate;
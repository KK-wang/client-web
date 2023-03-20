import { Card, Button } from "antd";
import styleNative from "./style.module.scss";
import convert from "../../../utils/proxy";
import { CopyOutlined } from "@ant-design/icons";


function PodRunningInfo() {
  const style = convert<typeof styleNative>(styleNative);

  return (
    <div className={style.podRunningInfoWrapper}>
      <Card title="Pod 运行信息" extra={
        <Button type="primary" icon={<CopyOutlined />} size="middle">
          复制所有 Pod 的运行信息 
        </Button>
      }>

      </Card>

    </div>
  );
}

export default PodRunningInfo;
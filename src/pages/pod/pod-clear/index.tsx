import { Card, Button } from "antd";
import styleNative from "./style.module.scss";
import convert from "../../../utils/proxy";
import { DeleteOutlined } from "@ant-design/icons";


function PodClear() {
  const style = convert<typeof styleNative>(styleNative);

  return (
    <div className={style.podClearWrapper}>
      <Card title="Pod 概览" extra={
        <Button type="primary" danger icon={<DeleteOutlined />} size="middle">
          删除所有 Pod
        </Button>
      }>
        <div>
          
        </div>
      </Card>
    </div>
  );
}

export default PodClear;
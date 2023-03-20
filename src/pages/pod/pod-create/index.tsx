import { Card, Button } from "antd";
import styleNative from "./style.module.scss";
import convert from "../../../utils/proxy";
import { AppstoreAddOutlined } from "@ant-design/icons";


function PodCreate() {
  const style = convert<typeof styleNative>(styleNative);

  return (
    <div className={style.podCreateWrapper}>
      <Card title="创建 Pod 的 JSON 配置" extra={
        <Button type="primary" icon={<AppstoreAddOutlined />} size="middle">
          创建 Pod
        </Button>
      }>

      </Card>

    </div>
  );
}

export default PodCreate;
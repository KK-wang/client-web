import convert from "../../utils/proxy";
import { Card, Form, Button } from "antd";
import styleNative from "./style.module.scss";
import { CloudUploadOutlined, CopyOutlined } from "@ant-design/icons";

function Algorithm() {
  const style = convert<typeof styleNative>(styleNative);


  return (
    <div className={style.algorithmWrapper}>
      <Card 
        title="算法配置信息"
        extra={
          <Button type="primary" shape="round" icon={<CloudUploadOutlined />} size="middle">
            执行算法
          </Button>
        }>

      </Card>
      <Card 
        title="算法执行结果"
        extra={
          <Button type="primary" shape="round" icon={<CopyOutlined />} size="middle">
            复制算法执行结果
          </Button>
        }>

      </Card>
    </div>
  );
}

export default Algorithm;
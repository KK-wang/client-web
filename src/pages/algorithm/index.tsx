import convert from "../../utils/proxy";
import { Card, Form, Button, Badge } from "antd";
import styleNative from "./style.module.scss";
import { CloudUploadOutlined, CopyOutlined, SaveOutlined } from "@ant-design/icons";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { shallowEqual } from "react-redux";


function Algorithm() {
  const style = convert<typeof styleNative>(styleNative);
  const dispatch = useAppDispatch();
  const isSavedAfterUpdated = useAppSelector(state => state.algorithm.isSavedAfterUpdated, shallowEqual);
  const formData = useAppSelector(state => state.algorithm.formData, shallowEqual)
  const algorithmRes = useAppSelector(state => state.algorithm.algorithmRes, shallowEqual);

  return (
    <div className={style.algorithmWrapper}>
      <Card 
        title="算法配置信息"
        extra={
          <div className={style.extraButtonGroup}>
            <Badge dot={true} offset={[-5, 5]}>
              <Button type="primary" shape="round" icon={<SaveOutlined />} size="middle">
                暂存配置信息
              </Button>
            </Badge>
            <Button type="primary" shape="round" icon={<CloudUploadOutlined />} size="middle">
              执行算法
            </Button>
          </div>
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
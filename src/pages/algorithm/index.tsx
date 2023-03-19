import convert from "../../utils/proxy";
import { Card, Form, Button, Select, Table, Input, Popover, message } from "antd";
import styleNative from "./style.module.scss";
import { CloudUploadOutlined, CopyOutlined, GithubOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { shallowEqual } from "react-redux";
import { createAlgorithmTaskApi, AlgorithmReqParam } from "./algorithm.slice"; 
import { selectOptions, tableData, ITableData } from "./config";
import { useRef, useState } from "react";
import JsonEditor from "../../common/json-editor";
import { algorithmReqParamValidator as validator } from "../../utils/json-validator";

function Algorithm() {
  // TODO 数据备份功能。
  const style = convert<typeof styleNative>(styleNative);
  const dispatch = useAppDispatch();
  const algorithmRes = useAppSelector(state => state.algorithm.algorithmRes, shallowEqual);
  const [dataSource, setDataSource] = useState(tableData);
  const formDataRef = useRef<AlgorithmReqParam.IAlgorithmReqParam>({
    algorithm: null,
    tasks: [],
    nodes: [],
  } as AlgorithmReqParam.IAlgorithmReqParam);
  const nodesInfoRef = useRef<string>();

  return (
    <div className={style.algorithmWrapper}>
      <Card 
        title={<Popover placement="right" content={<div>注意，页面跳转后已填写的配置信息将丢失</div>}><span style={{cursor: "default"}}>算法配置信息<InfoCircleOutlined style={{marginLeft: "10px"}}/></span></Popover>}
        extra={
          <Button
            type="primary" 
            shape="round" 
            icon={<CloudUploadOutlined />} 
            size="middle" 
            onClick={() => {
              try { formDataRef.current.nodes = JSON.parse(nodesInfoRef.current!) }
              catch { message.error("Node 信息的值含有 JSON 语法错误"); return; }
              if (validator(formDataRef.current)) {
                dispatch(createAlgorithmTaskApi(formDataRef.current));
              } else message.error("请完善算法配置信息且保证 Node 信息的值符合给定的 JSON schema");
            }}>
              执行算法
          </Button>
        }>
        <div className={style.formWrapper}>
          <Form>
            <Form.Item label="算法">
              <Select
                showSearch
                placeholder="请选择要使用的算法"
                optionFilterProp="children"
                filterOption={(input, option) => (option?.label ?? '').includes(input)}
                filterSort={(optionA, optionB) =>
                  (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                }
                options={selectOptions}
                style={{ width: "200px" }}
                onChange={val => formDataRef.current.algorithm = val}
                dropdownStyle={{ background: "rgb(50, 52, 59)" }}
              />
            </Form.Item>
            <Form.Item label="计算任务">
              <div className={style.tableWrapper}>
                <Table
                  pagination={false}
                  dataSource={dataSource}
                  columns={[
                    {
                      align: "center",
                      title: "镜像名称",
                      dataIndex: "image",
                      render: (value, record) => (
                        <span className={style.githubMark} onClick={() => window.open(record.githubUrl, "target")}>
                          <GithubOutlined /> {value}
                        </span>
                      ),
                    },
                    {
                      align: "center",
                      title: "计算量",
                      dataIndex: "calcMetrics",
                    },
                    {
                      align: "center",
                      title: () => <Popover content={<div style={{maxWidth: "120px"}}>仅限整数，最小值为 1，最大值为 99</div>}><span style={{cursor: "default"}}>创建数量<InfoCircleOutlined style={{marginLeft: "10px"}}/></span></Popover>,
                      dataIndex: "nums",
                      render: (_, record: ITableData) => <Input disabled={!record.isChecked} style={{ width: "60px", textAlign: "center" }} maxLength={2} onChange={e => {
                        const tasks = formDataRef.current.tasks;
                        for (const task of tasks) 
                          if (task.image === record.image) 
                            task.nums = parseInt(e.target.value);
                      }}/>
                    },
                    {
                      align: "center",
                      title: () => <Popover content={<div style={{maxWidth: "200px"}}>后台会自动将 podName 编号以保证 podName 的唯一性</div>}><span style={{cursor: "default"}}>pod 名称<InfoCircleOutlined style={{marginLeft: "10px"}}/></span></Popover>,
                      dataIndex: "podName",
                      render(_, record: ITableData) {
                        return <Input disabled={!record.isChecked} style={{ width: "auto", minWidth: "150px", textAlign: "center" }} addonBefore={`${record.image}-`} addonAfter="-{i}" onChange={e => {
                          const tasks = formDataRef.current.tasks;
                          for (const task of tasks) 
                            if (task.image === record.image)
                              task.podName = `${record.image}-${e.target.value}-{i}`;
                        }}/>;
                      }
                    },
                  ]}
                  rowSelection={{
                    type: "checkbox",
                    onChange: (selectedRowKeys: React.Key[]) => {
                      const tasks: AlgorithmReqParam.AlgorithmReqTask[] = [];
                      for (const row of dataSource) {
                        if (selectedRowKeys.includes(row.key)) {
                          row.isChecked = true;
                          tasks.push({
                            image: dataSource[row.key].image,
                            calcMetrics: dataSource[row.key].calcMetrics,
                            podName: null,
                            nums: null,
                          });
                        } else row.isChecked = false;
                      }
                      formDataRef.current.tasks = tasks;
                      setDataSource([...dataSource]);
                    },
                  }}
                />
              </div>
            </Form.Item>
            <Form.Item label="Node 信息">
              <JsonEditor onChange={val => {
                nodesInfoRef.current = val;
              }} placeholder={`
请输入 JSON 格式的 Node 资源使用信息。
JSON schema 如下: 
{
  "nodeName": string,
  "cpu": number,
  "mem": number
}[]
              `}/>
            </Form.Item>
          </Form>
        </div>
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
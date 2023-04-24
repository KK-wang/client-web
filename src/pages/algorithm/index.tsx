import convert from "../../utils/proxy";
import { Card, Form, Button, Select, Table, Input, Popover, message, Result } from "antd";
import styleNative from "./style.module.scss";
import { CloudUploadOutlined, CopyOutlined, GithubOutlined, InfoCircleOutlined, LoadingOutlined } from "@ant-design/icons";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { shallowEqual } from "react-redux";
import { createAlgorithmTaskApi, AlgorithmReqParam, setCalculating } from "./algorithm.slice"; 
import { selectOptions, tableData, ITableData } from "./config";
import { useEffect, useRef, useState } from "react";
import JsonEditor from "../../common/json-editor";
import { algorithmReqParamValidator as validator } from "../../utils/json-validator";
import MacCodeBlock from "../../common/mac-code-block";
import AlgorithmResult from "./algorithm-result";
import copy from "../../utils/copy";


function Algorithm() {
  const style = convert<typeof styleNative>(styleNative);
  const dispatch = useAppDispatch();
  const algorithmRes = useAppSelector(state => state.algorithm.algorithmRes, shallowEqual);
  const isCalculating = useAppSelector(state => state.algorithm.isCalculating, shallowEqual);
  const [dataSource, setDataSource] = useState(tableData);
  const formDataRef = useRef<AlgorithmReqParam.IAlgorithmReqParam>({
    algorithm: null,
    tasks: [],
    nodes: [],
  } as AlgorithmReqParam.IAlgorithmReqParam);
  const nodesInfoRef = useRef<string>();
    
  useEffect(() => () => {
    for (const row of tableData) {
      row.isChecked = false;
      row.nums = null;
    }
  }, []);

  return (
    <div className={style.algorithmWrapper}>
      <Card 
        title={<Popover placement="right" content={<div>注意，页面跳转后已填写的配置信息将丢失</div>}><span style={{cursor: "default"}}>算法配置信息<InfoCircleOutlined style={{marginLeft: "10px"}}/></span></Popover>}
        extra={
          <Button
            type="primary" 
            icon={<CloudUploadOutlined />} 
            size="middle"
            disabled={isCalculating}
            onClick={async () => {
              try { formDataRef.current.nodes = JSON.parse(nodesInfoRef.current!) }
              catch { message.error("Node 信息的值含有 JSON 语法错误"); return; }
              if (validator(formDataRef.current)) {
                dispatch(setCalculating(true));
                message.success("算法任务已被提交");
                await dispatch(createAlgorithmTaskApi(formDataRef.current));
                dispatch(setCalculating(false));
                message.success("算法任务执行完毕");
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
                      render: (_, record: ITableData) => <Input value={record.nums === null ? "" : record.nums} disabled={!record.isChecked} style={{ width: "60px", textAlign: "center" }} maxLength={2} onChange={e => {
                        for (const row of dataSource)
                          if (row.image === record.image) 
                            row.nums = parseInt(e.target.value);
                        const tasks = formDataRef.current.tasks;
                        for (const task of tasks) 
                          if (task.image === record.image) 
                            task.nums = parseInt(e.target.value);
                        setDataSource([...dataSource])
                      }}/>
                    },
                    {
                      align: "center",
                      title: () => <Popover content={<div style={{maxWidth: "200px"}}>后台会自动将 podName 编号以保证 podName 的唯一性</div>}><span style={{cursor: "default"}}>pod 名称<InfoCircleOutlined style={{marginLeft: "10px"}}/></span></Popover>,
                      dataIndex: "podName",
                      render(_, record: ITableData) {
                        return (
                          <div style={{ 
                              width: "auto", 
                              fontWeight: "bold",
                              fontSize: "17px",
                              height: "31.6px",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }} >
                            {record.image}-{"{i}"}
                          </div>
                        )
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
                            podName: `${dataSource[row.key].image}-{i}`,
                            nums: dataSource[row.key].nums,
                          });
                        } else {
                          row.isChecked = false;
                          row.nums = null;
                        }
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
}[]`
              }/>
            </Form.Item>
          </Form>
        </div>
      </Card>
      <Card 
        title="算法执行结果"
        extra={
          <Button 
            type="primary" 
            icon={<CopyOutlined />} size="middle"
            disabled={algorithmRes.length === 0}
            onClick={
              () => copy(JSON.stringify(algorithmRes, null, 2)).
                then(() => message.success("已拷贝算法执行结果到剪切板"))
          }>
            复制算法执行结果
          </Button>
        }>
        <div className={style.macCodeBlockWrapper}>
          <MacCodeBlock>
            {
              isCalculating ? (
                <div className={style.contentLoading}>
                  <Result icon={<LoadingOutlined />} title="算法任务执行中，请稍后..."/>
                </div>
              ) : algorithmRes.length === 0 ? (
                <div className={style.contentInfo}>
                  <Result status="info" title="暂无算法任务被提交执行"/>
                </div>
              ) : <AlgorithmResult algorithmRes={algorithmRes} />
            }
          </MacCodeBlock>
        </div>
      </Card>
    </div>
  );
}

export default Algorithm;
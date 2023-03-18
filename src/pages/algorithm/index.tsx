import convert from "../../utils/proxy";
import { Card, Form, Button, Badge, Select, Table, Input, Popover } from "antd";
import styleNative from "./style.module.scss";
import { CloudUploadOutlined, CopyOutlined, SaveOutlined, FormOutlined, GithubOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { shallowEqual } from "react-redux";
import { saveAfterUpdated, createAlgorithmTaskApi, setAlgorithmInfo, AlgorithmReqParam } from "./algorithm.slice"; 
import { selectOptions, tableData, ITableData } from "./utils/config";
import { useState } from "react";

function Algorithm() {
  const style = convert<typeof styleNative>(styleNative);
  const dispatch = useAppDispatch();
  const isSavedAfterUpdated = useAppSelector(state => state.algorithm.isSavedAfterUpdated, shallowEqual);
  const formData = useAppSelector(state => state.algorithm.formData, shallowEqual)
  const algorithmRes = useAppSelector(state => state.algorithm.algorithmRes, shallowEqual);
  const [form] = Form.useForm<AlgorithmReqParam.IAlgorithmReqParam>();
  if (Object.keys(formData).length === 0) {
    form.setFieldValue("algorithm", "");
    form.setFieldValue("tasks", []);
    form.setFieldValue("nodes", []);
  } else form.setFieldsValue(formData);
  const [dataSource, setDataSource] = useState(tableData);

  return (
    <div className={style.algorithmWrapper}>
      <Card 
        title="算法配置信息"
        extra={
          <div className={style.extraButtonGroup}>
            <Button type="primary" shape="round" icon={<FormOutlined />} size="middle" onClick={() => form
            .resetFields()}>
              重置配置信息
            </Button>
            <Badge dot={!isSavedAfterUpdated} offset={[-5, 5]}>
              <Button type="primary" shape="round" icon={<SaveOutlined />} size="middle" onClick={() => console.log(form.getFieldsValue())}>
                暂存配置信息
              </Button>
            </Badge>
            <Button type="primary" shape="round" icon={<CloudUploadOutlined />} size="middle">
              执行算法
            </Button>
          </div>
        }>
        <div className={style.formWrapper}>
          <Form
            form={form}
          >
            <Form.Item name="algorithm" label="算法">
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
                onChange={value => { 
                  form.setFieldValue("algorithm", value);
                  dispatch(saveAfterUpdated(false)); 
                }}
                dropdownStyle={{ background: "rgb(50, 52, 59)" }}
              />
            </Form.Item>
            <Form.Item
              label="计算任务"
            >
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
                      title: () => <Popover content={<div style={{maxWidth: "120px"}}>仅限数字，最小值为 1，最大值为 99</div>}><span style={{cursor: "default"}}>创建数量<InfoCircleOutlined style={{marginLeft: "10px"}}/></span></Popover>,
                      dataIndex: "nums",
                      render: (_, record: ITableData) => <Input disabled={!record.isChecked} style={{ width: "60px", textAlign: "center" }} maxLength={2}/>
                    },
                    {
                      align: "center",
                      title: () => <Popover content={<div style={{maxWidth: "200px"}}>后台会自动将 podName 编号以保证 podName 的唯一性</div>}><span style={{cursor: "default"}}>pod 名称<InfoCircleOutlined style={{marginLeft: "10px"}}/></span></Popover>,
                      dataIndex: "podName",
                      render(_, record: ITableData) {
                        return <div><Input disabled={!record.isChecked} style={{ width: "auto", minWidth: "150px", textAlign: "center" }} addonBefore={`${record.image}-`} addonAfter="-{i}"/></div>;
                      }
                    },
                  ]}
                  rowSelection={{
                    type: "checkbox",
                    onChange: (selectedRowKeys: React.Key[], selectedRows: ITableData[]) => {
                      const tasks: AlgorithmReqParam.AlgorithmReqTask[] = [];
                      for (const row of dataSource) {
                        if (selectedRowKeys.includes(row.key)) {
                          row.isChecked = true;
                          
                        }
                        else row.isChecked = false;
                      }
                      setDataSource([...dataSource]);
                      form.setFieldValue("tasks", tasks);
                      dispatch(saveAfterUpdated(false));
                    },
                  }}
                />
              </div>
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
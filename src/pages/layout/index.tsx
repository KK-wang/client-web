import { Menu, MenuProps } from "antd";
import { Outlet, useNavigate } from "react-router";
import { CloudServerOutlined, DeploymentUnitOutlined, ClusterOutlined, FunctionOutlined } from "@ant-design/icons"
import styleNative from "./style.module.scss";
import convert from "../../utils/proxy";
import React from "react";

function Layout() {
  const style = convert(styleNative);
  type MenuItem = Required<MenuProps>['items'][number];
  const navigate = useNavigate();

  const handleClick = (param: { key: React.Key }) => {
    switch (param.key) {
      case "0":
        navigate("/");
        break;
      case "1":
        navigate("/node");
        break;
      case "2":
        navigate("/pod");
        break;
      case "3":
        navigate("/algorithm");
        break;
    }
  };

  const items: MenuItem[] = [
    { label: "主页", key: 0, icon: <ClusterOutlined /> },
    { label: "Node 管理", key: 1, icon: <CloudServerOutlined /> },
    { label: "Pod 管理", key: 2, icon: <DeploymentUnitOutlined /> },
    { label: "algorithm 管理", key: 3, icon: <FunctionOutlined /> },
  ]

  return (
    <div className={style.layout}>
      <div className={style.menu}>
      <div className={style.icon}>
        <img src={require("../../assets/img/icon.png")} alt="" />
      </div>
        <Menu
          style={{height: "100%", paddingLeft: "10px", paddingRight: "10px"}}
          defaultSelectedKeys={['0']}
          items={items}
          mode="inline"
          theme="dark"
          onClick={handleClick}
        />
      </div>
      <div className={style.mainContent}>
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;
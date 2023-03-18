import { Menu, MenuProps } from "antd";
import { Outlet, useNavigate } from "react-router";
import { CloudServerOutlined, DeploymentUnitOutlined, ClusterOutlined, FunctionOutlined } from "@ant-design/icons"
import styleNative from "./style.module.scss";
import convert from "../../utils/proxy";
import React from "react";
import icon from "../../assets/img/icon.png";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { Modal } from "antd";
import { shallowEqual } from "react-redux";

function Layout() {
  const style = convert<typeof styleNative>(styleNative);
  type MenuItem = Required<MenuProps>['items'][number];
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isSavedAfterUpdated = useAppSelector(state => state.algorithm.isSavedAfterUpdated, shallowEqual);

  const handleClick = (param: { key: React.Key }) => {
    const key = isSavedAfterUpdated ? param.key : "-1";
    switch (key) {
      // TODO
      case "-1": 
        return;
      case "0":
        navigate("/");
        break;
      case "1":
        navigate("/node");
        break;
      case "2":
        navigate("/algorithm");
        break;
      case "3":
        navigate("/pod");
        break;
    }
  };

  const items: MenuItem[] = [
    { label: "主页", key: 0, icon: <ClusterOutlined /> },
    { label: "Node 管理", key: 1, icon: <CloudServerOutlined /> },
    { label: "algorithm 管理", key: 2, icon: <FunctionOutlined /> },
    { label: "Pod 管理", key: 3, icon: <DeploymentUnitOutlined /> },

  ]

  function defaultSelectedKeys() {
    switch (location.pathname) {
      case "/": return ["0"];
      case "/node": return ["1"];
      case "/algorithm": return ["2"];
      case "/pod": return ["3"];
    }
  }

  return (
    <div className={style.layout}>
      <div className={style.menu}>
      <div className={style.icon}>
        <img src={icon} alt="" />
      </div>
        <Menu
          style={{height: "100%", paddingLeft: "10px", paddingRight: "10px"}}
          defaultSelectedKeys={defaultSelectedKeys()}
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
import styleNative from "./style.module.scss";
import convert from "../../utils/proxy";
import { useState } from "react";
import React from "react";
import { token } from "../../api";
import { message } from "antd";
import { AxiosResponse } from "axios";
import { useNavigate } from "react-router";

export function Login() {
  // 需要注意的是，React 组件的名称应当以大写字母开头。
  const style = convert(styleNative);
  // FIXME: 修改默认值。
  const [username, setUsername] = useState<string>("csu_admin");
  const [password, setPassword] = useState<string>("8209190414");
  const navigate = useNavigate()

  async function submit(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
    e.preventDefault();
    message.info("登陆中...")
    token(username, password).then((res: AxiosResponse<{id: number, name: String, token: string}>) => {
      message.success("登陆成功", 1, () => navigate("/"));
      localStorage.setItem("token", res.data.token);
    })
  }

  return (
    <div>
      <div id={style.stars}></div>
      <div id={style.stars2}></div>
      <div id={style.stars3}></div>
      <div id={style.horizon}>
        <div className={style.glow}></div>
      </div>
      <div id={style.earth}></div>
        <div className={style.loginBox}>
        <h2>边缘计算平台管理端</h2>
        <form>
          <div className={style.userBox}>
            <input type="text" value={username} required onChange={(e) => setUsername(e.target.value)}/>
            <label>用户名</label>
          </div>
          <div className={style.userBox}>
            <input type="password" value={password} required onChange={(e) => setPassword(e.target.value)}/>
            <label>密码</label>
          </div>
          <a href="#" onClick={(e) => submit(e)}>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            登录
          </a>
        </form>
      </div>
      <div className={style.icon}>
        <img src={require("../../assets/img/icon.png")} alt="" />
      </div>
    </div>
  );
}

export default Login;
import style from "./style.module.scss";
import convert from "../../utils/proxy";

// TODO: Particle.js 或者 Particles.js React Component 实现粒子特效。

export function Login() {
  // 需要注意的是，React 组件的名称应当以大写字母开头。
  console.log(style);
  const styleProxy = convert(style);
  return (
    <div className={style.wrapper}>
      <div className={styleProxy.loginBox}>
      <h2>欢迎进入边缘计算平台</h2>
      <form>
        <div className={styleProxy.userBox}>
          <input type="text" name="" required/>
          <label>用户名</label>
        </div>
        <div className={styleProxy.userBox}>
          <input type="password" name="" required/>
          <label>密码</label>
        </div>
        <a href="#">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          登录
        </a>
      </form>
      </div>
    </div>
  );
}

export default Login;
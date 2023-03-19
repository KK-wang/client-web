import styleNative from "./style.module.scss";
import convert from "../../utils/proxy";

function Pod() {
  const style = convert<typeof styleNative>(styleNative);
  return (
    <div className={style.podWrapper}>
      <h1>Pod</h1>
    </div>
  );
}

export default Pod;
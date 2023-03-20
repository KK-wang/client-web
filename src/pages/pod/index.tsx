import styleNative from "./style.module.scss";
import convert from "../../utils/proxy";
import PodClear from "./pod-clear";
import PodCreate from "./pod-create";
import PodRunningInfo from "./pod-running-info";

function Pod() {
  const style = convert<typeof styleNative>(styleNative);
  return (
    <div className={style.podWrapper}>
      <PodClear />
      <PodCreate />
      <PodRunningInfo />
    </div>
  );
}

export default Pod;
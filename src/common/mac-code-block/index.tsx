import React from "react";
import styleNative from "./style.module.scss";
import convert from "../../utils/proxy";

function MacCodeBlock(prop: { children: React.ReactNode }) {
  const style = convert<typeof styleNative>(styleNative);
  return (
    <div className={style.cvCode}>
      <div className={style.cvCodeHeader}>
        <div className={style.cvCodeButtons}>
          <span className={style.fakeButton} data-close=""></span>
          <span className={style.fakeButton} data-minify=""></span>
          <span className={style.fakeButton} data-expand=""></span>
        </div>
      </div>
      <div className={style.content}>
        <div className={style.code}>
          {prop.children}
        </div>
      </div>
    </div>
  );
}

export default MacCodeBlock;
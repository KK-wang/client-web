import "highlight.js/styles/vs2015.css";
import json from "highlight.js/lib/languages/json";
import hljs from "highlight.js";
import { useEffect } from "react";
import convert from "../../utils/proxy";
import styleNative from "./style.module.scss";
import { IAlgorithmState } from "./algorithm.slice";

hljs.registerLanguage("json", json);

function AlgorithmResult(prop: { algorithmRes: IAlgorithmState[] }) {
  const style = convert<typeof styleNative>(styleNative);
  const { algorithmRes } = prop;
  useEffect(() => {
    hljs.highlightAll();
  }, []);

  return (
    <div className={style.contentJson}>
      <pre>
        <code className="language-json" style={{ fontFamily: "ui-monospace,SFMono-Regular,SF Mono,Menlo,Consolas,Liberation Mono,monospace" }}>
          {
            JSON.stringify(algorithmRes, null, 2)
          }
        </code>
      </pre>
    </div>
  );

}

export default AlgorithmResult;
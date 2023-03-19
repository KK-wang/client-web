import styleNative from "./style.module.scss";
import convert from "../../utils/proxy";
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-monokai";
import 'ace-builds/src-noconflict/ace';

function JsonEditor(prop: { onChange?: (value: string, event?: any) => void }) {
  const style = convert<typeof styleNative>(styleNative);

  return (
    <div className={style.jsonEditorContainer}>
      <AceEditor
        placeholder="输入 Node 资源使用信息的 JSON 格式..."
        mode="json"
        theme="monokai"
        fontSize={18}
        showPrintMargin={true}
        showGutter={true}
        onChange={prop.onChange}
        highlightActiveLine={true}
        setOptions={{
          showLineNumbers: true,
          tabSize: 2,
          useWorker: false,
        }}
      />
    </div>
  );
}

export default JsonEditor;
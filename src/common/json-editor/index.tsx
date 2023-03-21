import styleNative from "./style.module.scss";
import convert from "../../utils/proxy";
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-monokai";
import 'ace-builds/src-noconflict/ace';

function JsonEditor(prop: {
  placeholder?: string,
  onChange?: (value: string, event?: any) => void,
  value?: string,
}) {
  const style = convert<typeof styleNative>(styleNative);

  return (
    <div className={style.jsonEditorContainer}>
      <AceEditor
        value={prop.value}
        placeholder={prop.placeholder}
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
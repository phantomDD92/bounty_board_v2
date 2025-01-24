import { useState } from "react";

import { Controlled as CodeMirror } from "react-codemirror2";

export default function CodeEditor() {
  const [code, setCode] = useState("");

  return (
    <div style={{ height: "500px" }}>
      <CodeMirror
        value={code}
        options={{
          mode: "javascript",
          theme: "dracula",
          lineNumbers: true,
          autofocus: true,
        }}
        onBeforeChange={(editor, data, value) => {
          setCode(value);
        }}
      />
    </div>
  );
}

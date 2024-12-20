import { useState } from "react";
import { Controlled as CodeMirror } from "react-codemirror2";
// import "@codemirror/lib/codemirror.css";
// import "@codemirror/mode/javascript/javascript.js"; // Add more modes as needed
// import "@codemirror/theme/dracula.css"; // Choose a theme

export default function CodeEditor() {
  const [code, setCode] = useState("console.log('Hello, CodeMirror!');");

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

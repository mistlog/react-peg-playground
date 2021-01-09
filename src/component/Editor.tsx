import React, { useRef, useState } from 'react';
import { mergeStyleSets } from '@fluentui/merge-styles';
import MonacoEditor from '@monaco-editor/react';
import { monaco } from '@monaco-editor/react';
import * as debounce from "lodash.debounce";
import { execute } from './compiler';

monaco.init()
    .then(monaco => {

        monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
            noSemanticValidation: true,
            noSyntaxValidation: true
        });

    })
    .catch(error => console.error('An error occurred during initialization of Monaco: ', error));

export interface IEditorProps {
    defaultCode?: string
}
export function Editor(props: IEditorProps) {
    const { defaultCode } = props;
    const editorRef = useRef<any>();
    const [output, setOutput] = useState("");

    function run() {
        const code = editorRef.current.getValue();
        const result = execute(code);
        if (result["message"]) {
            setOutput(result["message"]);
        }
        else if (result["default"] && result["default"].message) {
            setOutput(result["default"].message + "\n\nlocation:\n" + JSON.stringify(result["default"].location, null ,4));
        } else {
            setOutput(JSON.stringify(result, null, 4));
        }
    }

    function handleEditorDidMount(_, editor) {
        editorRef.current = editor;
        run();
        editorRef.current.onDidChangeModelContent(debounce((event: any) => {
            run();
        }, 1000));
    }

    const options = {
        minimap: { enabled: false },
        scrollbar: { useShadows: false }
    };

    return (
        <div className={classNames.container} >
            <MonacoEditor height="100%" width="50%" language="typescript" options={options} editorDidMount={handleEditorDidMount} value={defaultCode} />
            <div style={{ width: "50%" }}>
                <MonacoEditor height="100%" width="100%" language="typescript" options={{ ...options, readOnly: true }} value={output} />
            </div>
        </div>
    )
}

/**
 * 
 */
const classNames = mergeStyleSets({
    container: {
        height: "100%",
        display: "flex"
    }
})
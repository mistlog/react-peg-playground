import React, { useState } from 'react';
import { mergeStyleSets } from '@fluentui/merge-styles';
import { Header } from './component/Header';
import { Editor } from './component/Editor';
import { ExampleNav } from './component/ExampleNav';
import CalculatorExample from "./component/examples/calculator.json";

export function App() {
    const [exampleCode, setExampleCode] = useState(CalculatorExample.code);

    return (
        <div className={classNames.container}>
            <div className={classNames.header}>
                <Header />
            </div>
            <div className={classNames.main}>
                <div className={classNames.nav}>
                    <ExampleNav onSelectExample={({ name, code }) => {
                        setExampleCode(code)
                    }} />
                </div>
                <div className={classNames.editor}>
                    <Editor defaultCode={exampleCode} />
                </div>
            </div>
        </div>
    )
}

const classNames = mergeStyleSets({
    container: {
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden"
    },
    header: {
        height: "60px"
    },
    main: {
        display: "flex",
        flexDirection: "row",
        marginTop: 16
    },
    nav: {
        height: "100vh",
        marginTop: 16
    },
    editor: {
        height: "100vh",
        width: "100%",
        marginTop: 16
    }
})
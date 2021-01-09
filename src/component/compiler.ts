import * as babel from "@babel/core";
import jsxPlugin from "@babel/plugin-transform-react-jsx";
import commonjsPlugin from "@babel/plugin-transform-modules-commonjs";
import { ReactPeg } from "react-peg";

export function execute(code: string) {
    try {
        const result = compile(code);
        const { exports } = evalScript(result, {});
        return exports;
    } catch (error) {
        return { message: error.message, stack: error.stack };
    }
}

function compile(raw: string) {
    const code = `/** @jsx ReactPeg.createChunk */\n ${raw}`;
    const result = babel.transformSync(code, { plugins: [jsxPlugin, commonjsPlugin] });
    if (result) {
        return result.code || "";
    }
    return "";
}

function evalScript(code: string, deps = {}) {
    const load = new Function("window", "require", "exports", code);
    const _module = {
        exports: { default: null }
    };

    load(window, createRequire(deps), _module.exports);
    return _module;
}

const BuiltInModules = {
    "react-peg": { ReactPeg }
};

function createRequire(deps = {}) {
    return (path: string) => {
        return { ...BuiltInModules, ...deps }[path];
    };
}


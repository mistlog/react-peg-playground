import { ReactPeg } from "react-peg";
import { Tracer } from "pegjs-backtrace";

let result = null;

const input = "1.5 + 2 + 3.4 * ( 25 - 4 ) / 2 - 8";
const tracer = new Tracer(input, { useColor: false });

try {
    const parser = ReactPeg.render(<Expression />, { tracer });
    const ast = parser.parse(input);
    result = ast;
} catch (error) {
    result = error;
}

const backtrace = tracer.getBacktraceString();
console.log(backtrace);
console.log(result);

const toExport = Boolean(result.message) ?  {
    ...result,
    backtrace
} : result

export default toExport

/**
 * grammar
 */
function Expression() {

    const head = (
        <Term label="head" />
    );

    const tail = (
        <repeat label="tail" type="*">
            <pattern action={({ term, op }) => ({ op, term })}>
                <_ />
                <or label="op">
                    <text>+</text>
                    <text>-</text>
                </or>
                <Term label="term" />
                <_ />
            </pattern>
        </repeat>
    );

    const action = ({ head, tail }) => {
        let value = head;
        tail.forEach(({ op, term }) => {
            if (op === "+") {
                value += term;
            } else if (op === "-") {
                value -= term;
            }
        })
        return value;
    }

    return (
        <pattern action={action}>
            {head}
            {tail}
        </pattern>
    );
}

function _() {
    return (
        <repeat type="*">
            <set> \t\n\r</set>
        </repeat>
    );
}

function Number() {
    const digits = (
        <repeat type="+">
            <set>0-9</set>
        </repeat>
    );

    const action = ({ globalFunction }) => {
        return parseFloat(globalFunction.text());
    }

    return (
        <pattern action={action}>
            {digits}
            <opt>
                <text>.</text>
                {digits}
            </opt>
        </pattern>
    );
}

function Factor() {

    const number = (
        <pattern action={({ value }) => value}>
            <_ />
            <Number label="value" />
            <_ />
        </pattern>
    );

    const expression = (
        <pattern action={({ expression }) => expression}>
            <_ />
            <text>(</text>
            <Expression label="expression" />
            <text>)</text>
            <_ />
        </pattern >
    );

    return (
        <or>
            {expression}
            {number}
        </or>
    );
}

function Term() {

    const head = (
        <Factor label="head" />
    );

    const tail = (
        <repeat label="tail" type="*">
            <pattern action={({ op, factor }) => ({ op, factor })}>
                <_ />
                <or label="op">
                    <text>*</text>
                    <text>/</text>
                </or>
                <Factor label="factor" />
                <_ />
            </pattern>
        </repeat>
    );

    const action = ({ head, tail }) => {
        let value = head;
        tail.forEach(({ op, factor }) => {
            if (op === "*") {
                value *= factor;
            } else if (op === "/") {
                value /= factor;
            }
        })
        return value;
    }

    return (
        <pattern action={action}>
            {head}
            {tail}
        </pattern>
    );
}

import * as d3 from "d3";

export type Instruction = {
    type: 'add' | 'swap';
    value?: string | number;
    index?: number;
    fromIndex?: number;
    toIndex?: number;
};

export type NodeData = {
    node: d3.Selection<SVGCircleElement, unknown, HTMLElement, any>;
    label: d3.Selection<SVGTextElement, unknown, HTMLElement, any>;
    index: number;
};

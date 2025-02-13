import * as d3 from "d3";

export type Instruction = {
    type: 'add' | 'swap' | 'remove';
    value?: string | number;
    index?: number;
    fromIndex?: number;
    toIndex?: number;
};

export type NodeData = {
    node: d3.Selection<SVGCircleElement, unknown, HTMLElement, any>;
    label: d3.Selection<SVGTextElement, unknown, HTMLElement, any>;
    parentEdge: d3.Selection<SVGLineElement, unknown, HTMLElement, any> | null;
    index: number;
};

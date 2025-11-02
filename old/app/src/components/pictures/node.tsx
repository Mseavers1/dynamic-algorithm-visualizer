export class Node{

    value: string | number;
    index: number;
    type: "node" | "edge" = "node";

    element: d3.Selection<SVGCircleElement, unknown, HTMLElement, any>;
    edge: d3.Selection<SVGLineElement, unknown, HTMLElement, any> | null;
    label: d3.Selection<SVGTextElement, unknown, HTMLElement, any>;

    constructor(value: string | number, index: number, element: d3.Selection<SVGCircleElement, unknown, HTMLElement, any>, edge : d3.Selection<SVGLineElement, unknown, HTMLElement, any> | null, label : d3.Selection<SVGTextElement, unknown, HTMLElement, any>) {
        this.value = value;
        this.index = index;
        this.element = element;
        this.edge = edge;
        this.label = label;
    }

}
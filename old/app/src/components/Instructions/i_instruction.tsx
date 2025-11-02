import * as d3 from "d3";
import {BaseType} from "d3";

export interface Instruction {
    process(svg: d3.Selection<BaseType, unknown, HTMLElement, any>) : Promise<void>;
}
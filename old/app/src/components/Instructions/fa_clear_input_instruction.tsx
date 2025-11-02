import {Instruction} from "./i_instruction";
import {BaseType, Selection} from "d3";

export class FAClearInputInstruction implements Instruction {

    async process(svg: Selection<BaseType, unknown, HTMLElement, any>): Promise<void> {
        svg.selectAll(".input-label").remove();
        svg.selectAll(".input-arrow").remove();


        return Promise.resolve();
    }

}
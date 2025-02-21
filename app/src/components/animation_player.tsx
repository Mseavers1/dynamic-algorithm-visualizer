// Class setup to handle all animations by using instructions that are defined outside this class
import {Instruction} from "./Instructions/i_instruction";
import {Picture} from "./pictures/i_picture";
import * as d3 from "d3";
import {BaseType} from "d3";

export class AnimationPlayer {

    // Queue of instructions
    private instructions : Instruction[];

    constructor(private setIsAnimating: (value: boolean) => void) {
        this.instructions = [];
    }

    // Adds a new instruction into the queue
    addInstruction(instruction : Instruction) {
        this.instructions.push(instruction);
    }

    // Processes all the instructions in the queue
    processInstructions = async()=> {

        // Base Case
        if (this.instructions.length === 0) {
            this.setIsAnimating(false);
            return;
        }

        this.setIsAnimating(true);

        // Gets and removes the first instruction
        const instruction = this.instructions.shift();

        const svg = d3.select("#svg-container").attr("width", 500).attr("height", 500);

        if (instruction) {
            await instruction.process(svg);
            await this.processInstructions();
        }
    }

}
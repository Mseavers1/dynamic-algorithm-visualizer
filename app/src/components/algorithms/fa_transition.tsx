import {Algorithm} from "./algorithm_interface";
import {AnimationPlayer} from "../animation_player";
import {FAAddInstruction, Color} from "../Instructions/fa_add_instruction";
import {TreeAddInstruction} from "../Instructions/tree_add_instruction";
import * as d3 from "d3";

export type stateValues = {
    state: string;
    values: string[];
}

export class FATransition implements Algorithm {

    private animator: AnimationPlayer;
    private states: Record<string, stateValues[]>;
    private startingState: string | null;
    private finalStates: string[];
    private colorUsed: Color[];

    public showClear: boolean = true;
    public showDelete: boolean = false;
    public showInsert: boolean = false;
    public showRandomize: boolean = false;
    public showSearch: boolean = false;

    constructor(
        animator: AnimationPlayer,
    ) {
        this.animator = animator;
        this.states = {};
        this.startingState = null;
        this.finalStates = [];
        this.colorUsed = [];
    }

    getRandomInt(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }


    generateNewColor(): Color {
        let c: Color = {r: this.getRandomInt(0, 255), g: this.getRandomInt(0, 255), b: this.getRandomInt(0, 255), a: 1};

        let exists = this.colorUsed.some(
            (color) => color.r === c.r &&
                color.g === c.g &&
                color.b === c.b &&
                color.a === c.a
        );

        let attemps = 0;

        while (exists) {

            if (attemps > 50) break;

            c = {r: this.getRandomInt(0, 255), g: this.getRandomInt(0, 255), b: this.getRandomInt(0, 255), a: 1};

            exists = this.colorUsed.some(
                (color) => color.r === c.r &&
                    color.g === c.g &&
                    color.b === c.b &&
                    color.a === c.a
            );

            attemps++;
        }

        this.colorUsed.push(c);

        return c;
    }

    parse(area: string) {

        // Is code valid?
        const lines = area.split("\n");
        let valid = true;
        let currentState = "";

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];

            // Ignore comments
            if (line.startsWith('#')) continue;

            // If it doesn't start with a space, it is the start of a state definition
            if (!line.startsWith(' ')) {
                const state = line.split(":")[0];
                this.states[state] = [];
                currentState = state;
            }

            // If it does, it is a value in a state definition
            else {

                // Get rid of spaces
                const new_line = line.replace(/\s+/g, '');

                // Check if there is a : - if so, its a value, if not, its either Start or Final keywords
                if (new_line.includes(':')) {
                    const state = new_line.split(":")[0];
                    const values = new_line.split(":")[1].split(",");

                    this.states[currentState].push({state: state, values: values});
                }
                // Keywords
                else {

                    // Set the starting state
                    if (new_line.toUpperCase() === "START") {
                        this.startingState = currentState;
                    }

                    // Add onto the final states
                    if (new_line.toUpperCase() === "FINAL") {
                        this.finalStates.push(currentState);
                    }
                }
            }
        }

        // Is there a starting state? If not, cause error
        if (this.startingState === null) {
            valid = false;
        }

        // Is there any final states? Is not, cause error
        if (this.finalStates.length <= 0) {
            valid = false;
        }

        // If valid, generate animation / structure
        if (valid) {

            let indexStates : Record<string, number> | null = {};
            let colorStates : Record<string, Color> = {};

            let index = 0;
            for (const state in this.states) {

                indexStates[state] = index;
                colorStates[state] = this.generateNewColor();

                //const stateArray = this.states[state];

                //stateArray.forEach((value) => {
                //    this.animator.addInstruction(new FAAddInstruction(index, value, ))
                //});

                let isStarting = state === this.startingState;
                let isFinal = this.finalStates.includes(state);

                this.animator.addInstruction(new FAAddInstruction(index, state, Object.keys(this.states).length, this.states[state], indexStates, colorStates, isStarting, isFinal));

                index += 1;
            }

            this.animator.processInstructions();
        }

    }

    clear(): void {
        const svg = d3.select("#svg-container").attr("width", 500).attr("height", 500);
        svg.selectAll("*").remove();

    }

    delete(value: string | number): void {
    }

    generate_random(min: number, max: number, size: number, allowStrings: boolean, allowNumbers: boolean, allowDecimal: boolean, maxDecimal: number, regex: string, stringLengthMin: number, stringLengthMax: number): void {
    }

    insert(value: string | number): void {
    }

}
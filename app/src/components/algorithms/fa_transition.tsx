import {Algorithm} from "./algorithm_interface";
import {AnimationPlayer} from "../animation_player";
import {FA_Graph} from "../structures/fa_graph";
import {FAAddAllInstruction} from "../Instructions/fa_add_all_instruction";
import * as d3 from "d3";
import {FAHighlightInstruction} from "../Instructions/highlight_fa_node_instruction";
import {FA_Node} from "../structures/fa_node";

export type stateValues = {
    state: string;
    values: string[];
}

export class FATransition implements Algorithm {

    private graph: FA_Graph;

    private animator: AnimationPlayer;

    public showClear: boolean = true;
    public showDelete: boolean = false;
    public showInsert: boolean = true;
    public showRandomize: boolean = false;
    public showSearch: boolean = false;
    public showField: boolean = true;
    public insert_name: string = "Validate";

    constructor(
        animator: AnimationPlayer,
    ) {
        this.graph = new FA_Graph();
        this.animator = animator;
    }

    getRandomInt(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }


    /* generateNewColor(): Color {
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
    } */

    parse(area: string) {

        // Is code valid?
        const lines = area.split("\n");
        let valid = true;
        let currentNodeValue: string = "";

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];

            // Ignore comments
            if (line.startsWith('#') || line.startsWith('//')) continue;

            // If it doesn't start with a space, it is the start of a state definition
            if (!line.startsWith(' ') && line.includes(':')) {
                const value = line.split(":")[0];

                if (this.graph.get_node(value) == null) this.graph.create_node(value);

                currentNodeValue = value;
            }

            // If it does, it is a value in a state definition
            else {

                // Get rid of spaces
                const new_line = line.replace(/\s+/g, '');

                // Check if there is a : - if so, its a value, if not, its either Start or Final keywords
                if (new_line.includes(':')) {
                    const pointer = new_line.split(":")[0];
                    const weights = new_line
                        .split(":")[1]
                        .split(",")
                        .map(w => w.trim());

                    //this.states[currentState].push({state: state, values: values});

                    if (this.graph.get_node(pointer) == null) this.graph.create_node(pointer);

                    this.graph.add_node_pointers(currentNodeValue, weights, pointer);
                }
                // Keywords
                else {

                    // Set the starting state
                    if (new_line.toUpperCase() === "START") {
                        this.graph.set_starting_node(currentNodeValue);
                    }

                    // Add onto the final states
                    if (new_line.toUpperCase() === "FINAL") {
                        this.graph.add_final_node(currentNodeValue);
                    }
                }
            }
        }

        // Is there a starting state? If not, cause error
        if (!this.graph.has_starting_node()) {
            valid = false;
        }

        // Is there any final states? Is not, cause error
        if (!this.graph.has_one_final_node()) {
            valid = false;
        }

        // If valid, generate animation / structure
        if (valid) {

            this.animator.addInstruction(new FAAddAllInstruction(this.graph));

            /*
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
            } */

            this.animator.processInstructions();
        }

    }

    clear(): void {
        this.graph = new FA_Graph();
        const svg = d3.select("#svg-container").attr("width", 500).attr("height", 500);
        svg.selectAll("*").remove();

    }

    delete(value: string | number): void {
    }

    generate_random(min: number, max: number, size: number, allowStrings: boolean, allowNumbers: boolean, allowDecimal: boolean, maxDecimal: number, regex: string, stringLengthMin: number, stringLengthMax: number): void {
    }

    // Check to see if value is in FA
    insert(value: string | number): void {

        // Start from the starting node
        let current_node = this.graph.get_starting_node();
        let prev_node: FA_Node | null = null;

        this.animator.addInstruction(new FAHighlightInstruction(current_node?.get_value() as string, "START"));

        // Validate each letter until input crash
        for (let letter of value.toString()) {
            const pointers = current_node?.get_pointers();

            if (!pointers) return;

            let found = false;

            // Search through pointers to see if weight matches
            pointers.forEach((weights: (string | number)[], node: FA_Node) => {
                if (weights.includes(letter)) {
                    prev_node = current_node;
                    current_node = node;
                    found = true;
                }
            });

            if (prev_node != null) {
                this.animator.addInstruction(
                    new FAHighlightInstruction(
                        (prev_node as FA_Node).get_value() as string,
                        current_node?.get_value() as string
                    )
                );
            }

            // If no matches, input crash
            if (!found) {
                alert("Input Crash");
                break;
            }
        }

        // Check to see if the last landed node is a final state (If not, input crash)
        if (current_node == null || !this.graph.is_final_node(current_node.get_value())) {
            alert("Input Crash");
        }

        this.animator.processInstructions();
        //alert("Yes, the string is in the machine!");

    }

}
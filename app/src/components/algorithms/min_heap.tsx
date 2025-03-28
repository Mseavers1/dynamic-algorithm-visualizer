import { Algorithm } from "./algorithm_interface";
import {BinaryTree} from "../structures/binary_tree";
import {AnimationPlayer} from "../animation_player";
import {TreeAddInstruction} from "../Instructions/tree_add_instruction";
import {Node} from "../pictures/node"
import {TreeSwapInstruction} from "../Instructions/tree_swap_instruction";
import {TreeDeleteInstruction} from "../Instructions/tree_delete_instruction";
import {TreeClearInstruction} from "../Instructions/tree_clear_instruction";
import {TreeAddAllInstruction} from "../Instructions/tree_add_all_instruction";

export class MinHeap implements Algorithm {

    private tree : BinaryTree;
    private animator: AnimationPlayer;
    private maxSize:number = 5;

    private nodes : Node[] = [];

    constructor(
        private isDynamicSize: boolean,
        animator: AnimationPlayer,
    ) {
        this.tree = new BinaryTree();
        this.animator = animator;
    }

    getRandomString(lengthMin: number, lengthMax: number, regex: string): string {
        const chars = regex;
        const length = Math.floor(Math.random() * (lengthMax - lengthMin + 1)) + lengthMin;

        let result = "";
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }


    generate_random(min:number, max:number, size: number, allowStrings: boolean = false, allowNumbers: boolean = false, allowDecimal: boolean = true, maxDecimal: number = 3, regex: string = "", stringLengthMin: number = 1, stringLengthMax: number = 5): void {

        // Clear heap
        this.empty_tree();

        // Check if both are false
        if (!allowNumbers && !allowStrings) allowNumbers = true

        let numElement : number | null = null;
        let stringElement : string = "";

        let values = [];

        // Randomize
        for (let i = 0; i < size; i++) {

            if (allowNumbers) {

                if (allowDecimal) {
                    let additional = Math.pow(10, -maxDecimal);
                    numElement = parseFloat((Math.random() * (max - min + additional) + min).toFixed(maxDecimal));
                } else {
                    numElement = Math.floor(Math.random() * (max - min) + min);
                }
            }

            if (allowStrings) {
                stringElement = this.getRandomString(stringLengthMin, stringLengthMax, regex);
            }

            // If both are allowed, add only one
            if (allowNumbers && allowStrings) {

                let rand = Math.random();

                // Add number
                if (rand >= 0.5) {
                    this.tree?.add(numElement as number)
                    values.push(numElement as number)
                }
                // Add string
                else {
                    this.tree?.add(stringElement)
                    values.push(stringElement as string)
                }
            }
            // Only adds number
            else if (allowNumbers) {
                this.tree?.add(numElement as number)
                values.push(numElement as number)
            }
            // Only adds strings
            else {
                this.tree?.add(stringElement)
                values.push(stringElement as string)
            }
        }

        //alert(values)

        this.animator.addInstruction(new TreeAddAllInstruction(values, this.nodes))

        // Heapify
        this.heapify_full();

        this.animator.processInstructions();
    }

    clear() : void {
        this.empty_tree();
        this.animator.processInstructions();
    }

    empty_tree() : void {
        this.tree.clear();

        this.animator.addInstruction(new TreeClearInstruction(this.nodes));

        this.nodes = [];
    }

    insert(value: string | number): void {
        this.tree?.add(value);

        this.animator.addInstruction(new TreeAddInstruction(this.tree?.length - 1, value, this.nodes))

        this.heapifyUp();

        this.animator.processInstructions();

    }

    delete(value: string | number): void {
        const i = this.tree.search(value);

        if (i < 0) return;

        // Swap the last element with the element to be deleted (if not already in last)
        if (i < this.tree.length - 1) {
            this.tree.swap(i, this.tree.length - 1);

            this.animator.addInstruction(new TreeSwapInstruction(i, this.tree.length - 1, this.nodes));
        }

        this.tree.remove(this.tree.length - 1);

        this.animator.addInstruction(new TreeDeleteInstruction(this.tree.length, this.nodes));

        // Now restore the heap property after deletion (heapify down)
        this.heapifyDown(i);

        this.animator.processInstructions();
    }

    heapify_full(): void {
        let last_node_with_children = (this.tree.length / 2) - 1;

        for (let i = last_node_with_children; i >= 0; --i) {
            this.heapifyDown(i)
            //this.heapifyDownRecursive(i);
        }
    }

    heapifyUp(): void {
        let cur_index = this.tree.length - 1; // Start from the last node
        let parentIndex = this.tree.get_parent(cur_index);

        // Ensure the current index is greater than 0 (non-root node)
        while (cur_index > 0 && this.compareHeapValues(this.tree.get(cur_index), this.tree.get(parentIndex))) {
            this.tree.swap(cur_index, parentIndex);

            this.animator.addInstruction(new TreeSwapInstruction(cur_index, parentIndex, this.nodes));

            cur_index = parentIndex;
            parentIndex = this.tree.get_parent(cur_index);
        }
    }

    compareHeapValues(a: string | number, b: string | number): boolean {
        const numA = isNaN(Number(a)) ? a : Number(a);
        const numB = isNaN(Number(b)) ? b : Number(b);

        if (typeof numA === "number" && typeof numB === "number") {
            return numA < numB;
        }

        return String(numA) < String(numB);
    }

    heapifyDown(cur_index: number): void {

        let x = cur_index
        while (true) {
            const left = 2 * x + 1;
            const right = 2 * x + 2;
            let smallest = x;

            const vals = this.tree.values;
            if (left < this.tree.length && vals[left] < vals[smallest]) {
                smallest = left;
            }

            if (right < this.tree.length && vals[right] < vals[smallest]) {
                smallest = right;
            }

            if (smallest === x) break;

            // Swap current node with the smallest child
            this.tree.swap(x, smallest);
            this.animator.addInstruction(new TreeSwapInstruction(x, smallest, this.nodes));

            x = smallest;
        }
    }

    parse(area: string): void {
    }

    showClear: boolean = true;
    showDelete: boolean = true;
    showInsert: boolean = true;
    showRandomize: boolean = true;
    showSearch: boolean = true;

    /*heapifyDownRecursive(cur_index: number): void {

        const left = 2 * cur_index + 1;
        const right = 2 * cur_index + 2;
        let smallest = cur_index;

        const vals = this.tree.values;
        if (left < this.tree.length && vals[left] < vals[smallest]) {
            smallest = left;
        }

        if (right < this.tree.length && vals[right] < vals[smallest]) {
            smallest = right;
        }

        if (smallest === cur_index) return;

        this.tree.swap(cur_index, smallest);
        this.animator.addInstruction(new TreeSwapInstruction(smallest, cur_index, this.nodes));

        this.heapifyDownRecursive(smallest);
    } */

}


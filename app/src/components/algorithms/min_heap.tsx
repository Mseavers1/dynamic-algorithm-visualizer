import { Algorithm } from "./algorithm_interface";
import {BinaryTree} from "../structures/binary_tree";

import {Instruction} from "./tree_intructions";
import React from "react";
import {TreeAnimate} from "../structures/tree_animator";

export class MinHeap implements Algorithm {

    private tree : BinaryTree;
    private animator: TreeAnimate;
    private maxSize:number = 5;



    constructor(
        private isDynamicSize: boolean,
        animator: TreeAnimate,
    ) {
        this.tree = new BinaryTree();
        this.animator = animator;
    }

    getRandomString(length: number): string {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let result = "";
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    generate_random(min:number, max:number, size: number, allowStrings: boolean = false, allowNumbers: boolean = false, allowDecimal: boolean = true, maxDecimal: number = 3): void {

        // Clear heap
        this.clear();

        // Check if both are false
        if (!allowNumbers && !allowStrings) allowNumbers = true

        let numElement : number | null = null;
        let stringElement : string = "";

        let newInstruction: Instruction = {
            type: 'instant_add',
            value: 0,
            index: 0
        };

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
                stringElement = this.getRandomString(5);
            }

            // If both are allowed, add only one
            if (allowNumbers && allowStrings) {

                let rand = Math.random();

                // Add number
                if (rand >= 0.5) {
                    this.tree.add(numElement as number);

                    newInstruction = {
                        type: 'instant_add',
                        value: numElement as number,
                        index: this.tree.length - 1
                    };

                    this.animator.add_instruction(newInstruction);
                }
                // Add string
                else {
                    this.tree.add(stringElement);

                    newInstruction = {
                        type: 'instant_add',
                        value: stringElement,
                        index: this.tree.length - 1
                    };

                    this.animator.add_instruction(newInstruction);
                }
            }
            else if (allowNumbers) {
                this.tree.add(numElement as number);

                newInstruction = {
                    type: 'instant_add',
                    value: numElement as number,
                    index: this.tree.length - 1
                };

                this.animator.add_instruction(newInstruction);
            }
            else {
                this.tree.add(stringElement);

                newInstruction = {
                    type: 'instant_add',
                    value: stringElement,
                    index: this.tree.length - 1
                };

                this.animator.add_instruction(newInstruction);
            }
        }

        // Heapify Up
        this.heapifyUp();

        this.animator.start_processing()
    }

    clear() : void {
        this.tree.clear();

        const newInstruction: Instruction = {
            type: 'clear',
        };

        this.animator.add_instruction(newInstruction);
        this.animator.start_processing()
    }

    insert(value: string | number): void {
        this.tree?.add(value);

        const newInstruction: Instruction = {
            type: 'add',
            value: value,
            index: this.tree.length - 1,
        };
        this.animator.add_instruction(newInstruction);

        // Use heapifyUp to maintain the heap property after insertion
        this.heapifyUp();

        this.animator.start_processing();
    }

    delete(value: string | number): void {
        const i = this.tree.search(value);

        if (i < 0) return;

        // Swap the last element with the element to be deleted
        this.tree.swap(i, this.tree.length - 1);

        const newInstruction: Instruction = {
            type: 'swap',
            fromIndex: i,
            toIndex: this.tree.length - 1,
        };
        this.animator.add_instruction(newInstruction);

        this.tree.remove(this.tree.length - 1);

        this.animator.add_instruction({
            type: 'remove',
            index: i,
        });

        // Now restore the heap property after deletion (heapify down)
        this.heapifyDown(i);

        this.animator.start_processing();
    }

    heapify(cur_index : number): void {

        // At root, do not heapify.
        if (cur_index == 1) return;

        // Check if parent is less than the current index
        const cur = this.tree.get(cur_index);
        const par_index = this.tree.get_parent(cur_index);
        const par_val = this.tree.get(par_index);

        if (cur >= par_val) return;

        // If so swap the indexes
        this.tree.swap(cur_index, par_index);

        const newInstruction: Instruction = {
            type: 'swap',
            fromIndex: par_index - 1,
            toIndex: cur_index - 1,
        };

        //this.setInstructions((prevInstructions) => [...prevInstructions, newInstruction]);
        this.animator.add_instruction(newInstruction);

        // Heapify on the new cur index
        this.heapify(par_index);
    }

    heapifyUp(): void {
        let cur_index = this.tree.length - 1; // Start from the last node
        const parentIndex = this.tree.get_parent(cur_index);

        // Ensure the current index is greater than 0 (non-root node)
        while (cur_index > 0 && this.tree.get(cur_index) < this.tree.get(parentIndex)) {
            this.tree.swap(cur_index, parentIndex);
            this.animator.add_instruction({
                type: 'swap',
                fromIndex: cur_index,
                toIndex: parentIndex,
            });
            cur_index = parentIndex;
        }
    }

    heapifyDown(cur_index: number): void {
        while (true) {
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

            if (smallest === cur_index) break;

            // Swap current node with the smallest child
            this.tree.swap(cur_index, smallest);
            this.animator.add_instruction({
                type: 'swap',
                fromIndex: cur_index,
                toIndex: smallest,
            });

            cur_index = smallest;
        }
    }

}


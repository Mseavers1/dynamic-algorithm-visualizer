import { Algorithm } from "./algorithm_interface";
import {BinaryTree} from "../structures/binary_tree";

import {Instruction} from "./tree_intructions";
import React from "react";
import {TreeAnimate} from "../structures/tree_animator";

export class MinHeap implements Algorithm {

    private tree : BinaryTree;

    private animator: TreeAnimate;

    constructor(
        private isDynamicSize: boolean,
        animator: TreeAnimate,
    ) {
        this.tree = new BinaryTree();
        this.animator = animator;
    }

    insert(value: string | number) : void {

        this.tree?.add(value);

        const newInstruction: Instruction = {
            type: 'add',
            value: value,
            index: this.tree.length - 1,
        };

        //this.setInstructions((prevInstructions) => [...prevInstructions, newInstruction]);
        this.animator.add_instruction(newInstruction);

        this.heapify(this.tree.length);

        this.animator.start_processing()

        //alert(this.tree?.get_current_height())

        //if (this.isDynamicSize && current_height > this.current_max_height) this.current_max_height = current_height + 1;

    }

    delete(value: string | number) : void {

        const i = this.tree.search(value);

        if (i < 0) return;

        // First Swap current and Last index
        this.tree.swap(i + 1, this.tree.length);

        let newInstruction: Instruction = {
            type: 'swap',
            fromIndex: this.tree.length - 1,
            toIndex: i,
        };

        this.animator.add_instruction(newInstruction)

        this.tree?.remove(this.tree.length - 1);

        newInstruction = {
            type: 'remove',
            index: this.tree.length,
        };

        this.animator.add_instruction(newInstruction);

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

    heapifyDown(cur_index : number) : void {

        const left: number = 2 * cur_index + 1;
        const right: number = 2 * cur_index + 2;
        const vals = this.tree.values;

        const smallest = vals[left] > vals[right] ? right : left;

        if (vals[smallest] < vals[cur_index]) {
            this.tree.swap(cur_index, smallest);

            const newInstruction: Instruction = {
                type: 'swap',
                fromIndex: cur_index,
                toIndex: smallest,
            };

            this.animator.add_instruction(newInstruction);

            this.heapifyDown(smallest);
        }
    }
}


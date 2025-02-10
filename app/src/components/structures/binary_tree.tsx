import { ITree } from './ITree';
import {IData} from "./IData";

// Define the BinaryTree logic in a separate class (without React dependencies)
export class BinaryTree implements ITree, IData {
    values: (string | number)[] = [];
    length: number = 0;

    clear(): void {
        this.values = [];
        this.length = 0;
    }

    get_parent(nodeID: number): number {
        if (!Number.isInteger(nodeID)) throw new Error("NodeID must be an integer.");
        if (this.length <= 0 || nodeID <= 0) return -1;
        return Math.floor(nodeID / 2) - 1;
    }

    get_current_height(): number {
        return this.length > 0 ? Math.floor(Math.log2(this.length)) : 0;
    }

    is_empty(): boolean {
        return !this.length;
    }

    add(value: string | number): void {
        this.values.push(value);
        this.length++;
    }

    remove(): string | number {
        if (this.length <= 0) throw new Error("Cannot remove from an empty tree.");
        this.length--;
        return this.values.pop() as string | number;
    }

    size(): number {
        return this.length;
    }

    get(nodeID: number): number | string | null {
        if (!Number.isInteger(nodeID)) throw new Error("NodeID must be an integer.");
        if (nodeID > this.length || nodeID <= 0) return null;
        return this.values[nodeID - 1];
    }
}
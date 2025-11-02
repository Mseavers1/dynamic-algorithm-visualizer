export class FA_Node {

    private value: string | number;

    private pointers: Map<FA_Node, (string | number)[]>;

    constructor(value: string | number) {
        this.value = value;
        this.pointers = new Map();
    }

    add_pointer(node: FA_Node, weight: (string | number)[]): void {
        this.pointers.set(node, weight);
    }

    get_weights(node: FA_Node): (number | string)[] | null {
        return this.pointers.get(node) ?? null;
    }

    get_pointers() {
        return this.pointers;
    }

    get_value() {
        return this.value ?? null;
    }

}
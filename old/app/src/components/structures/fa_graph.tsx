import {FA_Node} from "./fa_node";

export class FA_Graph {

    private starting_node: FA_Node | null;
    private final_nodes: FA_Node[];

    private nodes: Map<string | number, FA_Node>;

    constructor() {
        this.starting_node = null;
        this.final_nodes = [];
        this.nodes = new Map<string | number, FA_Node>();
    }

    get_nodes() {
        return this.nodes;
    }

    get_node(node: string | number) {
        return this.nodes.get(node);
    }

    get_pointers(node: string | number) {
        return this.nodes.get(node)?.get_pointers();
    }

    create_node(node: (string | number), is_starting_node: boolean = false, is_final_node: boolean = false): void {
        this.nodes.set(node, new FA_Node(node));

        if (is_starting_node) {
            this.starting_node = this.nodes.get(node) ?? null;
        }

        if (is_final_node) {
            this.final_nodes.push(this.nodes.get(node) as FA_Node);
        }
    }

    add_node_pointers(value: string | number, weight: (string | number)[], pointsTo: string | number): void {
        const fromNode = this.nodes.get(value);
        const toNode = this.nodes.get(pointsTo);

        if (!fromNode || !toNode) {
            console.warn(`Cannot add pointer: ${value} or ${pointsTo} not found`);
            return;
        }

        fromNode.add_pointer(toNode, weight);
    }

    set_starting_node(value: string | number): void {
        this.starting_node = this.nodes.get(value) ?? null;
    }

    add_final_node(value: string | number) {
        this.final_nodes.push(this.nodes.get(value) as FA_Node);
    }

    has_starting_node(): boolean {
        return this.starting_node != null;
    }

    has_one_final_node(): boolean {
        return this.final_nodes.length > 0;
    }

    is_final_node(value: string | number): boolean {
        const node = this.nodes.get(value);
        if (!node) return false;
        return this.final_nodes.includes(node);
    }

    is_starting_node(value: string | number) {
        return this.starting_node == this.nodes.get(value);
    }

    get_starting_node() {
        return this.starting_node;
    }


}
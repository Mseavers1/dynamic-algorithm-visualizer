export interface ITree {

    add(value : string | number) : void;
    remove() : string | number;

    get_parent(nodeID : number) : number;
    get(nodeID : number) : number | string | null;

    is_empty() : boolean;
    size() : number;
    clear() : void;

}
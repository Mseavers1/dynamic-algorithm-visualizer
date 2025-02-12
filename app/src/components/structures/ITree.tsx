export interface ITree {

    add(value : string | number) : void;
    remove(index : number | null) : string | number;

    get_parent(nodeID : number) : number;
    get(nodeID : number) : number | string;

    is_empty() : boolean;
    size() : number;
    clear() : void;

}
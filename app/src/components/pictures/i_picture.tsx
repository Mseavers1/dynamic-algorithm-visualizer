export interface Picture {
    type: 'node' | 'edge';

    getSelf() : Picture;

}
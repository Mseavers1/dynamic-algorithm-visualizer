export interface Algorithm {
    render(): JSX.Element;
    insert(value: string | number): void;
}

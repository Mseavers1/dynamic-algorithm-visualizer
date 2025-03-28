export interface Algorithm {
    insert(value: string | number): void;
    delete(value: string | number): void;
    clear(): void;
    parse(area: string): void;
    generate_random(min:number, max:number, size: number, allowStrings: boolean, allowNumbers: boolean, allowDecimal: boolean, maxDecimal: number, regex: string, stringLengthMin: number, stringLengthMax: number): void;
    showInsert: boolean;
    showDelete: boolean;
    showSearch: boolean;
    showClear: boolean;
    showRandomize: boolean;
}

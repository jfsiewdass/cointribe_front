export interface Option {
    name: string;
    multiplierBy: number;
    amount: number;
}
export interface DiceBetResponse {
    options: Array<Option>;
    wallet: string;
    amount: number;
    result: Array<number>
}
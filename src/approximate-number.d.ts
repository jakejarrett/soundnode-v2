declare module 'approximate-number' {
    function approximateNumber(
        value: number,
        formatting: {
            decimal?: string;
            separator?: string;
            prefix?: string;
            suffix?: string;
            capital?: boolean;
            round?: boolean;
            min10k?: boolean;
        }): string;
    export = approximateNumber;
};
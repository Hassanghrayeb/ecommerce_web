export interface PaginationParametersModel {
    start: number;
    count: number;
}

export const DefaultPaginationParametersModel = {
    start: 0,
    count: 6,
};
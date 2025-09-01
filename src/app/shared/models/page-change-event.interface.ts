export interface PageChangeEvent {
    // Offset is the page that needs to be returned
    page: number;

    // Size is the number of rows in the current page or list
    size: number;
}

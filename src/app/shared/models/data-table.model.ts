export class DataTable<T> {
    constructor(
        public visibleRows?: T[],
        public filteredVisibleRows?: T[],
        public currentlyVisibleRows?: T[],
        public totalNumberOfVisibleRows?: number,
        // Suggested: Indicates the column which holds a numerical index used for ordering rows
        // public orderKey?: string
    ) { }
}
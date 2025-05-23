/**
 * Minimal mock implementation of a PCF DataSet property for testing.
 * Allows you to set columns, records, and basic paging/filtering logic.
 */
export class MockPCFDataSet implements ComponentFramework.PropertyTypes.DataSet {
    columns: ComponentFramework.PropertyHelper.DataSetApi.Column[] = [];
    error = false;
    errorMessage = "";
    filtering: ComponentFramework.PropertyHelper.DataSetApi.Filtering;
    linking: ComponentFramework.PropertyHelper.DataSetApi.Linking;
    loading = false;
    paging: ComponentFramework.PropertyHelper.DataSetApi.Paging;
    records: { [id: string]: ComponentFramework.PropertyHelper.DataSetApi.EntityRecord } = {};
    sortedRecordIds: string[] = [];
    sorting: ComponentFramework.PropertyHelper.DataSetApi.SortStatus[] = [];

    constructor(options?: Partial<ComponentFramework.PropertyTypes.DataSet>) {
        Object.assign(this, options);

        // Provide minimal no-op implementations for required methods if not supplied
        this.filtering = this.filtering ?? {
            getFilter: () => ({ conditions: [], filterOperator: 0 }),
            setFilter: () => {},
            clearFilter: () => {},
        };
        this.linking = this.linking ?? {
            getLinkedEntities: () => [],
            addLinkedEntity: () => {},
        };
        this.paging = this.paging ?? {
            totalResultCount: 0,
            firstPageNumber: 1,
            lastPageNumber: 1,
            pageSize: 50,
            hasNextPage: false,
            hasPreviousPage: false,
            loadNextPage: () => {},
            loadPreviousPage: () => {},
            reset: () => {},
            setPageSize: () => {},
            loadExactPage: () => {},
        };
        this.sortedRecordIds = this.sortedRecordIds ?? Object.keys(this.records);
    }

    clearSelectedRecordIds(): void {}
    getSelectedRecordIds(): string[] { return []; }
    getTargetEntityType(): string { return "mockentity"; }
    getTitle(): string { return "Mock DataSet"; }
    getViewId(): string { return "mock-view-id"; }
    openDatasetItem(entityReference: ComponentFramework.EntityReference): void {}
    refresh(): void {}
    setSelectedRecordIds(ids: string[]): void {}
}
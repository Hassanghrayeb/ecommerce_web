import { Directive, Injector, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ListDataTableComponent } from '../components/list-data-table/list-data-table.component';
import { DataTableColumnDefinition } from '../models/data-table-column-definition.model';
import { DataTable } from '../models/data-table.model';
import { PageChangeEvent } from '../models/page-change-event.interface';
import { PaginatorConfig } from '../models/paginator-config.model';
import { ConfigTypeEnum } from '../enums/config.enum';

@Directive()
export class DataTableBaseClass<RowModel> {
    @ViewChild(ListDataTableComponent) dataTableComponent?: ListDataTableComponent;
    dataTableData?: DataTable<RowModel>;
    dataTableColumnsDefinition?: DataTableColumnDefinition[];
    rowClickable = false;
    route: ActivatedRoute;
    router: Router;
    paginatorConfig = new PaginatorConfig();
    filter = null;

    constructor(protected injector: Injector) {
        this.router = this.injector.get(Router);
        this.route = this.injector.get(ActivatedRoute);
    }

    onPage(pageChangeEvent: PageChangeEvent) { }

    /**
     * It fills the dataTableData with the visible rows and the total number
     * @param response 
     * @param property 
     * @param withReset 
     */
     setDataTableData(response: any, withReset = true) {
        let dataTableData = new DataTable<any>();
        const rows = response ? response.content ? response.content : response : [];

        if (withReset) {
            this.resetPaginatorPageIndex()
        }

        dataTableData.visibleRows = rows;

        // Set the total number of rows received from backend on any call
        dataTableData.totalNumberOfVisibleRows = this.paginatorConfig.enabled == ConfigTypeEnum.BE ? response.totalElements : dataTableData?.visibleRows?.length;

        // Change the reference of the data variable so it triggers the change
        this.dataTableData = this.objectAssign([dataTableData]);
    }

    dataChanged() {
        // Change the reference of the data variable so it triggers the change
        this.dataTableData = this.objectAssign([this.dataTableData]);
    }

    /**
     * @param paginationObj 
     * @returns current params to get data list accordingly
     */
    getPaginationParam(paginationObj?: PageChangeEvent): PageChangeEvent | undefined {
        let pagParam: PageChangeEvent | undefined;
        if (paginationObj && this.isPaginatorEnabled()) {
            // The offset
            pagParam = paginationObj;
        }
        return pagParam;
    }

    clearDataTableData() {
        this.dataTableData = undefined;
    }

    resetDataTable() {
        if (this.dataTableComponent) {
            this.clearDataTableData();
            this.dataTableComponent?.resetDataTable();
        }
    }

    isPaginatorEnabled() { return this.paginatorConfig.enabled !== ConfigTypeEnum.NONE; }
    /**
     * Called to reset the pagination params to default
     */
    resetPaginatorPageIndex(): void {
        if (
            this.dataTableComponent &&
            this.isPaginatorEnabled()
        ) {
            this.dataTableComponent?.resetPaginator();
        }
    }

    objectAssign(entities: any, targetEntity = {}): any {
        return Object.assign(targetEntity, ...entities);
    }
}

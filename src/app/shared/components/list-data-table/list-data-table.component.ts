import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
// import { LanguageHelper } from '../../helper/lang.helper';
import { DataTableColumnDefinition } from '../../models/data-table-column-definition.model';
import { DataTable } from '../../models/data-table.model';
import { PageChangeEvent } from '../../models/page-change-event.interface';
import { PaginatorConfig } from '../../models/paginator-config.model';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfigTypeEnum } from '../../enums/config.enum';
import { DATA_TABLE_COLUMN_FORMAT } from '../../enums/data-table-column-format';
import {InputColor} from "../../enums/input-mode.enum";
import {MatCheckbox} from "@angular/material/checkbox";
import {MatSlideToggle} from "@angular/material/slide-toggle";

@Component({
  selector: 'list-data-table',
  templateUrl: './list-data-table.component.html',
  styleUrls: ['./list-data-table.component.sass'],
})
export class ListDataTableComponent implements OnInit {
  @Input('columnsDefinition') columnsDefinition?: DataTableColumnDefinition[];
  @Input('expColumnsDefinition') expColumnsDefinition?: DataTableColumnDefinition[];
  @Input('paginatorConfig') paginatorConfig: PaginatorConfig = new PaginatorConfig();
  @Input('data') data?: DataTable<any>;
  @Input('currentRolePermissions') rolePermissions?: any;
  @Input('noResultMessage') noResultMessage = 'No Results Found.';
  @Input() color: InputColor = InputColor.PRIMARY11;

  @Output('more') more = new EventEmitter<PageChangeEvent>();
  @Output('clickAction') clickAction = new EventEmitter<any>();
  @Output('clickToggle') clickToggle = new EventEmitter<any>();

  public columnFormat = DATA_TABLE_COLUMN_FORMAT;
  public columnsProperty?: string[];
  public pageChangeEvent?: PageChangeEvent;
  // public languageHelper = LanguageHelper;
  public configTypeEnum = ConfigTypeEnum;

  constructor(public dialog: MatDialog) {}

  /** Table Related */

  ngOnChanges(changes: SimpleChanges) {
    const columnsChange = changes['columnsDefinition'];
    const dataChange = changes['data'];
    if (dataChange && this.data) {
      // Show and hide the load more button if all the rows were loaded
      this.fillData();
    }

    // Update the columns in case they changed
    if (columnsChange) {
      const columnsDidChange =
        columnsChange.previousValue !== columnsChange.currentValue;
      if (columnsDidChange) {
        this.extractValuableInfoFromColumns(this.columnsDefinition);
      }
    }
  }

  /**
   * init the paginator
   */
  ngOnInit() {
  }

  getCurrentRows() {
    if (
      this.paginatorConfig.enabled !== this.configTypeEnum.NONE &&
      this.pageChangeEvent
    ) {
      let start = this.pageChangeEvent.page * this.pageChangeEvent.size;
      return this.data?.filteredVisibleRows?.slice(
        start,
        start + this.pageChangeEvent.size
      );
    } else {
      return this.data?.filteredVisibleRows;
    }
  }

  private applyPagination() {
    if (this.data) {
      if (this.paginatorConfig.enabled !== this.configTypeEnum.BE) {
        this.data.currentlyVisibleRows = this.getCurrentRows();
      } else {
        this.data.currentlyVisibleRows = this.data.filteredVisibleRows;
      }
    }
  }

  /**
   * Clear the data table
   */
  clearDataTable() {
    this.data = {
      visibleRows: [],
      filteredVisibleRows: [],
      currentlyVisibleRows: [],
      totalNumberOfVisibleRows: this.paginatorConfig.length,
    };
  }

  /**
   * On reset table: reset data in table and paginator
   */
  resetDataTable() {
    this.clearDataTable();
    this.resetPaginator();
  }

  extractValuableInfoFromColumns(
    columns: DataTableColumnDefinition[] | undefined
  ) {
    if (columns) {
      this.columnsProperty = columns
        .filter((col) => col.visible)
        .map((col) => col.property);
    }
  }

  /**
   * Add a class to the cell element based on the column type
   * @param column
   * @returns
   */
  getCellClass(column: DataTableColumnDefinition) {
    let result: any = {};
    if (column) {
      switch (column.format) {
        case this.columnFormat.Date:
          result = { 'date-cell': true };
          break;
        case this.columnFormat.Link:
          result = { 'link-cell': true };
          break;
        case this.columnFormat.Toggle:
          result = { 'toggle-cell': true };
          break;
        case this.columnFormat.Action:
          const actionClass = `${column.property}-action-cell`;
          result[actionClass] = true;
          break;
        case this.columnFormat.NAME_DESCRIPTION_CHIP:
          result = { 'name-desc-cell': true };
          break;
        default:
          break;
      }
      if (column.customClasses) {
        column.customClasses.forEach((className) => (result[className] = true));
      }
    }
    return result;
  }

  /**
   * Format the displayed value based on the column type
   * @param column
   * @param row
   * @returns
   */
  formatCellValue(column: DataTableColumnDefinition, row: any): string {
    if(row && column.property in row){
      return row[column.property];
    }
    else if (row && column.property.includes('.')) {
      return column.property.split('.').reduce((obj, key) => obj?.[key], row)
    }
    return '';
  }

  /**
   * Open an external link in new tab
   * @param link
   */
  actionClicked(col: any, row: any) {
    let action = { name: col.property, data: row };
    if (col.withConfirmation) {
      this.confirm()
        ?.afterClosed()
        .subscribe((isConfirmed) => {
          isConfirmed && this.clickAction.emit(action);
        });
    } else {
      this.clickAction.emit(action);
    }
  }

  toggleClicked(col: any, row: any, ev: any, componentRef: any) {
    ev.returnValue = false;
    let action = {
      name: col.property,
      data: row,
      value: !componentRef.checked,
      element: componentRef,
    };
    if (col.withConfirmation) {
      this.confirm()
        ?.afterClosed()
        .subscribe((isConfirmed) => {
          if (isConfirmed) {
            componentRef.toggle();
            this.clickToggle.emit(action);
          }
        });
    } else {
      componentRef.toggle();
      this.clickToggle.emit(action);
    }
  }

  private getPropertyValue(row: any, property?: string): any {
    if (!property) {
      return '';
    }
    if (row && property in row) {
      return row[property];
    }
    if (row && property.includes('.')) {
      return property.split('.').reduce((obj, key) => obj?.[key], row);
    }
    return '';
  }

  getNameDescriptionChipValues(column: DataTableColumnDefinition, row: any) {
    return {
      name: this.getPropertyValue(row, column.property),
      description: this.getPropertyValue(row, column.descriptionProperty),
      recommended: !!this.getPropertyValue(row, column.recommendedProperty),
    };
  }

  checkboxClicked(col: any, row: any, ev: MouseEvent, componentRef: MatCheckbox): void {
    ev.stopPropagation();

    const currentValue = row[col.property];
    const newValue = !currentValue;

    const action = {
      name: col.property,
      data: row,
      value: newValue,
      element: componentRef,
      col: col
    };

    const applyChange = () => {
      row[col.property] = newValue;
      this.clickToggle.emit(action);
    };

    if (col.withConfirmation) {
      this.confirm()
        ?.afterClosed()
        .subscribe((isConfirmed: boolean) => {
          if (isConfirmed) {
            applyChange();
          }
        });
    } else {
      applyChange();
    }
  }

  confirm(): MatDialogRef<any> | null {
    // return this.dialog.open(ConfirmComponent, {
    //   panelClass: "confirm-dialog",
    //   data: {
    //     confirmationMessage: 'confirmation_dialog.are_you_sure',
    //   }
    // });
    return null;
  }

  /** Pagination Related */

  /**
   * Increment the offset to indicate the next page
   * Emit the event to get the data for next page
   */
  public clickPage(isNext: any, all?: any) {
    let offset = 0;
    if (all) {
      offset = isNext ? this.getPageNb() - 1 : 0;
    } else {
      offset = this.pageChangeEvent?.page != null
      ? this.pageChangeEvent?.page + (isNext ? 1 : -1)
      : 0;
    }
    this.setPageChangeEvent({
      page: offset,
      size: this.pageChangeEvent?.size ?? 10,
    });
    if (this.paginatorConfig.enabled === this.configTypeEnum.BE) {
      this.more.emit(this.pageChangeEvent);
    }
    this.applyPagination();
  }

  resetPaginator() {
    this.setPageChangeEvent(this.paginatorConfig);
  }

  /**
   *
   * @param pageEvent
   */
  setPageChangeEvent(pageEvent: PageChangeEvent) {
    if (this.paginatorConfig.enabled !== ConfigTypeEnum.NONE) {
      this.pageChangeEvent = {
        page: pageEvent.page,
        size: pageEvent.size,
      };
    }
  }

  getPageChangeEvent() {
    return this.pageChangeEvent;
  }

  getCheckedVal(col: any, row: any) {
    return col.property.startsWith('!')
      ? !row[col.property.substring(1)]
      : row[col.property];
  }

  public getPageNb() {
    let total = this.data?.totalNumberOfVisibleRows ?? 0;
    let size = this.pageChangeEvent?.size ?? 10;
    return Math.ceil(total / size);
  }

  private applyFEFilter() {
    if (this.data) {
      let columnsToFilter = this.columnsDefinition?.filter((f) => f.filterable);
      this.data.filteredVisibleRows = [];
      if (
        this.data.visibleRows &&
        this.data.visibleRows.length != 0 &&
        columnsToFilter
      ) {
        for (let element of this.data.visibleRows) {
          for (let col of columnsToFilter) {
            if (
              this.formatCellValue(col, element)
            ) {
              this.data.filteredVisibleRows.push(element);
              break;
            }
          }
        }
      }
    }
  }

  public executeFilter() {
    this.applyFEFilter();
    if (this.data) {
      this.data.totalNumberOfVisibleRows =
        this.data.filteredVisibleRows?.length;
    }
    this.resetPaginator();
    this.applyPagination();
  }

  private fillData() {

      if (this.data) {
        this.data.filteredVisibleRows = this.data.visibleRows;
      }
    if (
      !this.pageChangeEvent &&
      this.paginatorConfig.enabled !== this.configTypeEnum.NONE
    ) {
      this.resetPaginator();
    }
    this.applyPagination();
  }

  public getMatToolTipMessage(label: string | undefined): string {
    return label ? label : '';
  }

}

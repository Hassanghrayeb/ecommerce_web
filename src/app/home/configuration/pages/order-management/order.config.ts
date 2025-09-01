import { DATA_TABLE_COLUMN_FORMAT } from 'src/app/shared/enums/data-table-column-format';
import { DataTableColumnDefinition } from 'src/app/shared/models/data-table-column-definition.model';

export const OrdersColumnDef: DataTableColumnDefinition[] = [
  new DataTableColumnDefinition(
    'total',
    'configuration_module.order_management.total',
    '15%'
  ),
  new DataTableColumnDefinition(
    'items',
    'configuration_module.order_management.products',
    '20%',
    DATA_TABLE_COLUMN_FORMAT.List,
  ),
  new DataTableColumnDefinition(
    'currency',
    'configuration_module.order_management.currency',
    '20%'
  ),
  new DataTableColumnDefinition(
    'status',
    'configuration_module.order_management.status',
    '20%'
  )
];
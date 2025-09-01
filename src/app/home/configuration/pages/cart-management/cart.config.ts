import { DATA_TABLE_COLUMN_FORMAT } from 'src/app/shared/enums/data-table-column-format';
import { DataTableColumnDefinition } from 'src/app/shared/models/data-table-column-definition.model';

export const CartsColumnDef: DataTableColumnDefinition[] = [
  new DataTableColumnDefinition(
    'userId',
    'configuration_module.cart_management.userId',
    '15%'
  ),
  new DataTableColumnDefinition(
    'items',
    'configuration_module.cart_management.items',
    '20%',
    DATA_TABLE_COLUMN_FORMAT.List,
  ),
  new DataTableColumnDefinition(
    'delete',
    '',
    '4%',
    DATA_TABLE_COLUMN_FORMAT.Action,
    undefined,
    'delete',
    false,
    false,
    true,
    false,
    undefined,
    'general.delete'
  ),
];
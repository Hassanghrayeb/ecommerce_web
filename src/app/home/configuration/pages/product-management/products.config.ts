import { DATA_TABLE_COLUMN_FORMAT } from 'src/app/shared/enums/data-table-column-format';
import { DataTableColumnDefinition } from 'src/app/shared/models/data-table-column-definition.model';

export const ProductsColumnDef: DataTableColumnDefinition[] = [
  new DataTableColumnDefinition(
    'sku',
    'configuration_module.product_management.product_form.sku',
    '30%'
  ),
  new DataTableColumnDefinition(
    'name',
    'configuration_module.product_management.product_form.name',
    '20%'
  ),
  new DataTableColumnDefinition(
    'description',
    'configuration_module.product_management.product_form.description',
    '20%'
  ),
  new DataTableColumnDefinition(
    'currency',
    'configuration_module.product_management.product_form.currency',
    '20%'
  ),
 new DataTableColumnDefinition(
    'price',
    'configuration_module.product_management.product_form.price',
    '20%'
  ),
  new DataTableColumnDefinition(
    'stock',
    'configuration_module.product_management.product_form.stock',
    '20%'
  ),
  new DataTableColumnDefinition(
    'enabled',
    'configuration_module.product_management.product_form.enabled',
    '10%',
    DATA_TABLE_COLUMN_FORMAT.Toggle,
    undefined,
    undefined,
    false,
    false,
    true,
    false
  ),
  new DataTableColumnDefinition(
    'edit',
    '',
    '4%',
    DATA_TABLE_COLUMN_FORMAT.Action,
    undefined,
    'edit',
    false,
    false,
    true,
    false,
    undefined,
    'general.edit'
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

export const LowStockProductsColumnDef: DataTableColumnDefinition[] = [
  new DataTableColumnDefinition(
    'sku',
    'configuration_module.product_management.product_form.sku',
    '30%'
  ),
  new DataTableColumnDefinition(
    'name',
    'configuration_module.product_management.product_form.name',
    '20%'
  ),
  new DataTableColumnDefinition(
    'description',
    'configuration_module.product_management.product_form.description',
    '20%'
  ),
  new DataTableColumnDefinition(
    'currency',
    'configuration_module.product_management.product_form.currency',
    '20%'
  ),
 new DataTableColumnDefinition(
    'price',
    'configuration_module.product_management.product_form.price',
    '20%'
  ),
  new DataTableColumnDefinition(
    'stock',
    'configuration_module.product_management.product_form.stock',
    '20%'
  ),
];
import { DATA_TABLE_COLUMN_FORMAT } from 'src/app/shared/enums/data-table-column-format';
import { DataTableColumnDefinition } from 'src/app/shared/models/data-table-column-definition.model';

export const RolesColumnDef: DataTableColumnDefinition[] = [
  new DataTableColumnDefinition(
    'name',
    'settings_module.role_management.role_form.name',
    '20%'
  ),
  new DataTableColumnDefinition(
    'description',
    'settings_module.role_management.role_form.description',
    '40%'
  ),
  new DataTableColumnDefinition(
    'edit',
    '',
    '20%',
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
    '20%',
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

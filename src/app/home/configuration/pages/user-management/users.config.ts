import { DATA_TABLE_COLUMN_FORMAT } from 'src/app/shared/enums/data-table-column-format';
import { DataTableColumnDefinition } from 'src/app/shared/models/data-table-column-definition.model';

export const UsersColumnDef: DataTableColumnDefinition[] = [
  new DataTableColumnDefinition(
    'person.email',
    'landing.email_address',
    '30%'
  ),
  new DataTableColumnDefinition(
    'username',
    'admin_module.users.username',
    '20%'
  ),
  new DataTableColumnDefinition(
    'roles',
    'admin_module.users.access',
    '20%',
    DATA_TABLE_COLUMN_FORMAT.List,
  ),
  new DataTableColumnDefinition(
    'enabled',
    'admin_module.users.enabled',
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
    'view',
    '',
    '4%',
    DATA_TABLE_COLUMN_FORMAT.Action,
    undefined,
    'visibility',
    false,
    false,
    true,
    false,
    undefined,
    'general.view'
  )
];

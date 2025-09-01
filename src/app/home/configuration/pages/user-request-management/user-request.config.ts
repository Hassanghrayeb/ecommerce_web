import { DATA_TABLE_COLUMN_FORMAT } from 'src/app/shared/enums/data-table-column-format';
import { DataTableColumnDefinition } from 'src/app/shared/models/data-table-column-definition.model';

export const UsersRequestColumnDef: DataTableColumnDefinition[] = [
  new DataTableColumnDefinition(
    'firstName',
    'configuration_module.user_request_management.firstName',
    '30%'
  ),
  new DataTableColumnDefinition(
    'lastName',
    'configuration_module.user_request_management.lastName',
    '20%'
  ),
  new DataTableColumnDefinition(
    'emailAddress',
    'configuration_module.user_request_management.emailAddress',
    '20%'
  ),
  new DataTableColumnDefinition(
    'approve',
    '',
    '4%',
    DATA_TABLE_COLUMN_FORMAT.Action,
    undefined,
    'check',
    false,
    false,
    true,
    false,
    undefined,
    'configuration_module.user_request_management.approve_request'
  )
];
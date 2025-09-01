export interface RoleModel {
  id: number;
  name: string;
  description: string;
  permissions?: PermissionModel[];
}

export interface PermissionModel {
  id: number;
  name: string;
  description: string;
}

export interface NavItem {
    label: string;
    icon: string;
    routerLink: string;
    alt?: string;
    allowedRoles?: string[];
    isDisabled?: boolean;
  }

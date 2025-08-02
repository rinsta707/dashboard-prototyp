export interface User {
  status: number;
  id: number;
  username: string;
  locale: string;
  roles: string[];
  rolesTranslations: { value: string, name: string }[];
  actions: any;
  paginatorDefault: number;
  notifications: boolean;
  active:boolean;
}

export interface LiferayConfig {
  baseUrl: string;
  companyId: number;
  oAuthToken: string;
  basicAuth: string;
  siteId: number;
}

export interface Role {
  id: number;
  name: string;
  description: string;
  type: 'Regular' | 'Organization' | 'Site' | 'System';
  subtype: string;
  userCount: number;
  createDate: string;
  modifiedDate: string;
}

export interface User {
  id: number;
  screenName: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
  active: boolean;
  roles: string[];
}

export interface AssetPermission {
  id: number;
  assetName: string;
  assetType: string;
  actions: PermissionAction[];
}

export interface PermissionAction {
  actionId: string;
  name: string;
  supported: boolean;
}

export interface RolePermission {
  roleId: number;
  roleName: string;
  permissions: AssetPermission[];
}

export interface HousekeepingTask {
  id: string;
  name: string;
  description: string;
  category: 'roles' | 'folders' | 'objects' | 'calendar' | 'general';
  status: 'idle' | 'running' | 'completed' | 'failed';
  lastRun?: string;
  itemCount?: number;
  icon: string;
}

export interface CleanupResult {
  taskId: string;
  success: boolean;
  itemsProcessed: number;
  itemsRemoved: number;
  duration: number;
  message: string;
  timestamp: string;
}

export type PageType = 'dashboard' | 'roles' | 'membership' | 'permissions' | 'housekeeping' | 'configuration';

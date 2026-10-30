/**
 * Liferay DXP REST API Service Layer
 * 
 * This module provides functions to interact with Liferay's Headless REST APIs.
 * Replace the mock data in your pages with these API calls for production use.
 * 
 * Liferay DXP 2026.Q1 Headless API Reference:
 * https://learn.liferay.com/dxp/latest/en/headless-api/index.html
 */

import { LiferayConfig, Role, User, RolePermission } from '../types';

// ============================================================================
// API Client Setup
// ============================================================================

function getHeaders(config: LiferayConfig): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  if (config.oAuthToken) {
    headers['Authorization'] = `Bearer ${config.oAuthToken}`;
  } else if (config.basicAuth) {
    headers['Authorization'] = `Basic ${btoa(config.basicAuth)}`;
  }

  return headers;
}

async function apiRequest<T>(
  config: LiferayConfig,
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${config.baseUrl}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      ...getHeaders(config),
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

// ============================================================================
// Role Management API
// ============================================================================

interface LiferayRole {
  id: number;
  name: string;
  description: string;
  roleType: string;
  roleSubtype: string;
  dateCreated: string;
  dateModified: string;
  memberCount?: number;
}

interface LiferayPage<T> {
  items: T[];
  totalCount: number;
  page: number;
  lastPage: number;
}

/**
 * Get all roles from Liferay
 * GET /o/headless-admin-user/v1.0/roles
 */
export async function getRoles(config: LiferayConfig): Promise<Role[]> {
  const response = await apiRequest<LiferayPage<LiferayRole>>(
    config,
    '/o/headless-admin-user/v1.0/roles?pageSize=100'
  );

  return response.items.map(item => ({
    id: item.id,
    name: item.name,
    description: item.description,
    type: mapRoleType(item.roleType),
    subtype: item.roleSubtype || '',
    userCount: item.memberCount || 0,
    createDate: item.dateCreated,
    modifiedDate: item.dateModified,
  }));
}

/**
 * Create a new role
 * POST /o/headless-admin-user/v1.0/roles
 */
export async function createRole(
  config: LiferayConfig,
  role: { name: string; description: string; type: string }
): Promise<Role> {
  const response = await apiRequest<LiferayRole>(
    config,
    '/o/headless-admin-user/v1.0/roles',
    {
      method: 'POST',
      body: JSON.stringify({
        name: role.name,
        description: role.description,
        roleType: mapToLiferayRoleType(role.type),
      }),
    }
  );

  return {
    id: response.id,
    name: response.name,
    description: response.description,
    type: mapRoleType(response.roleType),
    subtype: response.roleSubtype || '',
    userCount: 0,
    createDate: response.dateCreated,
    modifiedDate: response.dateModified,
  };
}

/**
 * Update an existing role
 * PUT /o/headless-admin-user/v1.0/roles/{roleId}
 */
export async function updateRole(
  config: LiferayConfig,
  roleId: number,
  updates: { name?: string; description?: string }
): Promise<Role> {
  const response = await apiRequest<LiferayRole>(
    config,
    `/o/headless-admin-user/v1.0/roles/${roleId}`,
    {
      method: 'PUT',
      body: JSON.stringify(updates),
    }
  );

  return {
    id: response.id,
    name: response.name,
    description: response.description,
    type: mapRoleType(response.roleType),
    subtype: response.roleSubtype || '',
    userCount: response.memberCount || 0,
    createDate: response.dateCreated,
    modifiedDate: response.dateModified,
  };
}

/**
 * Delete a role
 * DELETE /o/headless-admin-user/v1.0/roles/{roleId}
 */
export async function deleteRole(
  config: LiferayConfig,
  roleId: number
): Promise<void> {
  await apiRequest(
    config,
    `/o/headless-admin-user/v1.0/roles/${roleId}`,
    { method: 'DELETE' }
  );
}

// ============================================================================
// User Management API
// ============================================================================

interface LiferayUser {
  id: number;
  alternateName: string;
  givenName: string;
  familyName: string;
  emailAddress: string;
  active: boolean;
  roles?: { items: { name: string }[] };
}

/**
 * Get all users
 * GET /o/headless-admin-user/v1.0/user-accounts
 */
export async function getUsers(config: LiferayConfig): Promise<User[]> {
  const response = await apiRequest<LiferayPage<LiferayUser>>(
    config,
    '/o/headless-admin-user/v1.0/user-accounts?pageSize=100'
  );

  return response.items.map(item => ({
    id: item.id,
    screenName: item.alternateName,
    firstName: item.givenName,
    lastName: item.familyName,
    emailAddress: item.emailAddress,
    active: item.active,
    roles: item.roles?.items.map(r => r.name) || [],
  }));
}

/**
 * Assign a user to a role
 * POST /o/headless-admin-user/v1.0/roles/{roleId}/user-accounts
 */
export async function assignUserToRole(
  config: LiferayConfig,
  roleId: number,
  userId: number
): Promise<void> {
  await apiRequest(
    config,
    `/o/headless-admin-user/v1.0/roles/${roleId}/user-accounts`,
    {
      method: 'POST',
      body: JSON.stringify({ id: userId }),
    }
  );
}

/**
 * Remove a user from a role
 * DELETE /o/headless-admin-user/v1.0/roles/{roleId}/user-accounts/{userId}
 */
export async function removeUserFromRole(
  config: LiferayConfig,
  roleId: number,
  userId: number
): Promise<void> {
  await apiRequest(
    config,
    `/o/headless-admin-user/v1.0/roles/${roleId}/user-accounts/${userId}`,
    { method: 'DELETE' }
  );
}

// ============================================================================
// Permission Management API
// ============================================================================

interface LiferayRolePermission {
  name: string;
  rolePermissions: {
    resourcePermission: {
      scope: string;
      name: string;
      actionIds: string[];
    };
  }[];
}

/**
 * Get role permissions
 * GET /o/headless-admin-role/v1.0/roles/{roleId}/role-permissions
 */
export async function getRolePermissions(
  config: LiferayConfig,
  roleId: number
): Promise<RolePermission> {
  const response = await apiRequest<LiferayRolePermission>(
    config,
    `/o/headless-admin-role/v1.0/roles/${roleId}/role-permissions`
  );

  // Transform Liferay response to our format
  return {
    roleId,
    roleName: response.name,
    permissions: response.rolePermissions.map((rp, idx) => ({
      id: idx + 1,
      assetName: rp.resourcePermission.name,
      assetType: rp.resourcePermission.name,
      actions: rp.resourcePermission.actionIds.map(actionId => ({
        actionId,
        name: formatActionName(actionId),
        supported: true,
      })),
    })),
  };
}

/**
 * Set role permissions
 * POST /o/headless-admin-role/v1.0/roles/{roleId}/role-permissions
 */
export async function setRolePermissions(
  config: LiferayConfig,
  roleId: number,
  permissions: { resourceName: string; scope: string; actionIds: string[] }[]
): Promise<void> {
  await apiRequest(
    config,
    `/o/headless-admin-role/v1.0/roles/${roleId}/role-permissions`,
    {
      method: 'POST',
      body: JSON.stringify({
        rolePermissions: permissions.map(p => ({
          resourcePermission: {
            scope: p.scope,
            name: p.resourceName,
            actionIds: p.actionIds,
          },
        })),
      }),
    }
  );
}

// ============================================================================
// Housekeeping / Maintenance API
// ============================================================================

/**
 * Trigger search reindex
 * POST /o/headless-batch-engine/v1.0/task
 */
export async function reindexSearch(config: LiferayConfig): Promise<void> {
  await apiRequest(
    config,
    '/api/jsonws/search-engine-indexer/reindex-all',
    { method: 'POST' }
  );
}

/**
 * Empty the recycle bin for a group
 * DELETE /o/headless-admin-user/v1.0/trash
 */
export async function emptyTrash(config: LiferayConfig, groupId: number): Promise<void> {
  await apiRequest(
    config,
    `/api/jsonws/trashentry/delete-trash-entries/group-id/${groupId}`,
    { method: 'POST' }
  );
}

// ============================================================================
// Helper Functions
// ============================================================================

function mapRoleType(liferayType: string): Role['type'] {
  switch (liferayType) {
    case 'regular': return 'Regular';
    case 'site': return 'Site';
    case 'organization': return 'Organization';
    case 'system': return 'System';
    default: return 'Regular';
  }
}

function mapToLiferayRoleType(type: string): string {
  switch (type) {
    case 'Regular': return 'regular';
    case 'Site': return 'site';
    case 'Organization': return 'organization';
    case 'System': return 'system';
    default: return 'regular';
  }
}

function formatActionName(actionId: string): string {
  const names: Record<string, string> = {
    'VIEW': 'View',
    'UPDATE': 'Update',
    'DELETE': 'Delete',
    'PERMISSIONS': 'Permissions',
    'ADD_ENTRY': 'Add',
    'ADD_FOLDER': 'Add Folder',
    'ADD_FILE': 'Add File',
    'ADD_PAGE': 'Add Page',
    'ADD_MESSAGE': 'Add Message',
    'ADD_BOOKING': 'Add Booking',
  };
  return names[actionId] || actionId;
}

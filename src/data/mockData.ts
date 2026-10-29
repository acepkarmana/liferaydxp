import { Role, User, RolePermission, HousekeepingTask, LiferayConfig } from '../types';

export const defaultConfig: LiferayConfig = {
  baseUrl: 'http://localhost:8080',
  companyId: 20116,
  oAuthToken: '',
  basicAuth: 'test@liferay.com:test',
  siteId: 20120,
};

export const mockRoles: Role[] = [
  {
    id: 20101,
    name: 'Administrator',
    description: 'Full system access with all permissions',
    type: 'Regular',
    subtype: '',
    userCount: 3,
    createDate: '2024-01-15T10:30:00Z',
    modifiedDate: '2026-01-10T08:00:00Z',
  },
  {
    id: 20102,
    name: 'Content Editor',
    description: 'Can create, edit, and publish web content',
    type: 'Regular',
    subtype: '',
    userCount: 12,
    createDate: '2024-02-20T14:00:00Z',
    modifiedDate: '2026-01-08T12:30:00Z',
  },
  {
    id: 20103,
    name: 'Site Member',
    description: 'Basic site access with view permissions',
    type: 'Site',
    subtype: 'Site Member',
    userCount: 45,
    createDate: '2024-03-10T09:00:00Z',
    modifiedDate: '2026-01-05T16:45:00Z',
  },
  {
    id: 20104,
    name: 'Organization Administrator',
    description: 'Manages organization-level resources',
    type: 'Organization',
    subtype: 'Organization Administrator',
    userCount: 5,
    createDate: '2024-04-01T11:00:00Z',
    modifiedDate: '2025-12-20T10:00:00Z',
  },
  {
    id: 20105,
    name: 'Power User',
    description: 'Extended permissions for advanced users',
    type: 'Regular',
    subtype: '',
    userCount: 8,
    createDate: '2024-05-15T13:30:00Z',
    modifiedDate: '2026-01-12T09:15:00Z',
  },
  {
    id: 20106,
    name: 'Guest',
    description: 'Unauthenticated user with limited access',
    type: 'System',
    subtype: '',
    userCount: 0,
    createDate: '2024-01-01T00:00:00Z',
    modifiedDate: '2024-01-01T00:00:00Z',
  },
  {
    id: 20107,
    name: 'Owner',
    description: 'System owner with highest privileges',
    type: 'System',
    subtype: '',
    userCount: 1,
    createDate: '2024-01-01T00:00:00Z',
    modifiedDate: '2024-01-01T00:00:00Z',
  },
  {
    id: 20108,
    name: 'User',
    description: 'Default role for all portal users',
    type: 'System',
    subtype: '',
    userCount: 73,
    createDate: '2024-01-01T00:00:00Z',
    modifiedDate: '2024-01-01T00:00:00Z',
  },
];

export const mockUsers: User[] = [
  { id: 10001, screenName: 'test', firstName: 'Test', lastName: 'User', emailAddress: 'test@liferay.com', active: true, roles: ['Administrator', 'User'] },
  { id: 10002, screenName: 'jbloggs', firstName: 'Joe', lastName: 'Bloggs', emailAddress: 'joe.bloggs@liferay.com', active: true, roles: ['Content Editor', 'Site Member', 'User'] },
  { id: 10003, screenName: 'msmith', firstName: 'Mary', lastName: 'Smith', emailAddress: 'mary.smith@example.com', active: true, roles: ['Site Member', 'User'] },
  { id: 10004, screenName: 'admin2', firstName: 'Super', lastName: 'Admin', emailAddress: 'admin@company.com', active: true, roles: ['Administrator', 'Power User', 'User'] },
  { id: 10005, screenName: 'jdoe', firstName: 'John', lastName: 'Doe', emailAddress: 'john.doe@example.com', active: false, roles: ['Site Member', 'User'] },
  { id: 10006, screenName: 'mwilson', firstName: 'Mike', lastName: 'Wilson', emailAddress: 'mike.wilson@example.com', active: true, roles: ['Content Editor', 'Power User', 'User'] },
  { id: 10007, screenName: 'agarcia', firstName: 'Ana', lastName: 'Garcia', emailAddress: 'ana.garcia@example.com', active: true, roles: ['Organization Administrator', 'User'] },
  { id: 10008, screenName: 'lchen', firstName: 'Li', lastName: 'Chen', emailAddress: 'li.chen@example.com', active: true, roles: ['Site Member', 'User'] },
  { id: 10009, screenName: 'pkumar', firstName: 'Priya', lastName: 'Kumar', emailAddress: 'priya.kumar@example.com', active: true, roles: ['Content Editor', 'Site Member', 'User'] },
  { id: 10010, screenName: 'rbrown', firstName: 'Robert', lastName: 'Brown', emailAddress: 'robert.brown@example.com', active: false, roles: ['User'] },
];

export const mockRolePermissions: RolePermission[] = [
  {
    roleId: 20101,
    roleName: 'Administrator',
    permissions: [
      { id: 1, assetName: 'Web Content', assetType: 'com.liferay.journal.model.JournalArticle', actions: [{ actionId: 'VIEW', name: 'View', supported: true }, { actionId: 'UPDATE', name: 'Update', supported: true }, { actionId: 'DELETE', name: 'Delete', supported: true }, { actionId: 'PERMISSIONS', name: 'Permissions', supported: true }, { actionId: 'ADD_ENTRY', name: 'Add', supported: true }] },
      { id: 2, assetName: 'Documents and Media', assetType: 'com.liferay.document.library.model.DLFolder', actions: [{ actionId: 'VIEW', name: 'View', supported: true }, { actionId: 'UPDATE', name: 'Update', supported: true }, { actionId: 'DELETE', name: 'Delete', supported: true }, { actionId: 'ADD_FOLDER', name: 'Add Folder', supported: true }, { actionId: 'ADD_FILE', name: 'Add File', supported: true }] },
      { id: 3, assetName: 'Blogs', assetType: 'com.liferay.blogs.model.BlogsEntry', actions: [{ actionId: 'VIEW', name: 'View', supported: true }, { actionId: 'UPDATE', name: 'Update', supported: true }, { actionId: 'DELETE', name: 'Delete', supported: true }, { actionId: 'ADD_ENTRY', name: 'Add', supported: true }] },
      { id: 4, assetName: 'Wiki', assetType: 'com.liferay.wiki.model.WikiPage', actions: [{ actionId: 'VIEW', name: 'View', supported: true }, { actionId: 'UPDATE', name: 'Update', supported: true }, { actionId: 'DELETE', name: 'Delete', supported: true }, { actionId: 'ADD_PAGE', name: 'Add Page', supported: true }] },
      { id: 5, assetName: 'Message Boards', assetType: 'com.liferay.message.boards.model.MBMessage', actions: [{ actionId: 'VIEW', name: 'View', supported: true }, { actionId: 'UPDATE', name: 'Update', supported: true }, { actionId: 'DELETE', name: 'Delete', supported: true }, { actionId: 'ADD_MESSAGE', name: 'Add Message', supported: true }] },
      { id: 6, assetName: 'Calendar', assetType: 'com.liferay.calendar.model.CalendarBooking', actions: [{ actionId: 'VIEW', name: 'View', supported: true }, { actionId: 'UPDATE', name: 'Update', supported: true }, { actionId: 'DELETE', name: 'Delete', supported: true }, { actionId: 'ADD_BOOKING', name: 'Add Booking', supported: true }] },
      { id: 7, assetName: 'Object Entries', assetType: 'com.liferay.object.model.ObjectEntry', actions: [{ actionId: 'VIEW', name: 'View', supported: true }, { actionId: 'UPDATE', name: 'Update', supported: true }, { actionId: 'DELETE', name: 'Delete', supported: true }, { actionId: 'ADD_ENTRY', name: 'Add', supported: true }] },
    ],
  },
  {
    roleId: 20102,
    roleName: 'Content Editor',
    permissions: [
      { id: 1, assetName: 'Web Content', assetType: 'com.liferay.journal.model.JournalArticle', actions: [{ actionId: 'VIEW', name: 'View', supported: true }, { actionId: 'UPDATE', name: 'Update', supported: true }, { actionId: 'DELETE', name: 'Delete', supported: false }, { actionId: 'PERMISSIONS', name: 'Permissions', supported: false }, { actionId: 'ADD_ENTRY', name: 'Add', supported: true }] },
      { id: 2, assetName: 'Documents and Media', assetType: 'com.liferay.document.library.model.DLFolder', actions: [{ actionId: 'VIEW', name: 'View', supported: true }, { actionId: 'UPDATE', name: 'Update', supported: true }, { actionId: 'DELETE', name: 'Delete', supported: false }, { actionId: 'ADD_FOLDER', name: 'Add Folder', supported: false }, { actionId: 'ADD_FILE', name: 'Add File', supported: true }] },
      { id: 3, assetName: 'Blogs', assetType: 'com.liferay.blogs.model.BlogsEntry', actions: [{ actionId: 'VIEW', name: 'View', supported: true }, { actionId: 'UPDATE', name: 'Update', supported: true }, { actionId: 'DELETE', name: 'Delete', supported: false }, { actionId: 'ADD_ENTRY', name: 'Add', supported: true }] },
    ],
  },
  {
    roleId: 20103,
    roleName: 'Site Member',
    permissions: [
      { id: 1, assetName: 'Web Content', assetType: 'com.liferay.journal.model.JournalArticle', actions: [{ actionId: 'VIEW', name: 'View', supported: true }, { actionId: 'UPDATE', name: 'Update', supported: false }, { actionId: 'DELETE', name: 'Delete', supported: false }, { actionId: 'PERMISSIONS', name: 'Permissions', supported: false }, { actionId: 'ADD_ENTRY', name: 'Add', supported: false }] },
      { id: 2, assetName: 'Documents and Media', assetType: 'com.liferay.document.library.model.DLFolder', actions: [{ actionId: 'VIEW', name: 'View', supported: true }, { actionId: 'UPDATE', name: 'Update', supported: false }, { actionId: 'DELETE', name: 'Delete', supported: false }, { actionId: 'ADD_FOLDER', name: 'Add Folder', supported: false }, { actionId: 'ADD_FILE', name: 'Add File', supported: false }] },
      { id: 3, assetName: 'Blogs', assetType: 'com.liferay.blogs.model.BlogsEntry', actions: [{ actionId: 'VIEW', name: 'View', supported: true }, { actionId: 'UPDATE', name: 'Update', supported: false }, { actionId: 'DELETE', name: 'Delete', supported: false }, { actionId: 'ADD_ENTRY', name: 'Add', supported: false }] },
      { id: 4, assetName: 'Calendar', assetType: 'com.liferay.calendar.model.CalendarBooking', actions: [{ actionId: 'VIEW', name: 'View', supported: true }, { actionId: 'UPDATE', name: 'Update', supported: false }, { actionId: 'DELETE', name: 'Delete', supported: false }, { actionId: 'ADD_BOOKING', name: 'Add Booking', supported: false }] },
    ],
  },
];

export const mockHousekeepingTasks: HousekeepingTask[] = [
  { id: 'reset-role-perms', name: 'Reset Role Permissions', description: 'Reset all role permissions to their default values. This will remove any custom permission configurations.', category: 'roles', status: 'idle', icon: 'shield-reset' },
  { id: 'cleanup-dl-folders', name: 'Cleanup Empty Folders', description: 'Remove empty document library folders that have no files or subfolders.', category: 'folders', status: 'idle', icon: 'folder-clean' },
  { id: 'cleanup-dl-files', name: 'Cleanup Orphaned Files', description: 'Remove files that are not referenced by any content or asset entry.', category: 'folders', status: 'idle', icon: 'file-clean' },
  { id: 'cleanup-object-entries', name: 'Cleanup Object Entries', description: 'Remove orphaned or expired Liferay Object entries from the database.', category: 'objects', status: 'idle', icon: 'database-clean' },
  { id: 'cleanup-calendar', name: 'Cleanup Calendar Events', description: 'Remove past calendar events and bookings older than the configured retention period.', category: 'calendar', status: 'idle', icon: 'calendar-clean' },
  { id: 'cleanup-expired-sessions', name: 'Cleanup Expired Sessions', description: 'Remove expired user sessions from the session store.', category: 'general', status: 'idle', icon: 'session-clean' },
  { id: 'cleanup-trash', name: 'Empty Trash', description: 'Permanently delete all items in the Recycle Bin across all sites.', category: 'general', status: 'idle', icon: 'trash-clean' },
  { id: 'reindex-search', name: 'Reindex Search Index', description: 'Rebuild the search index for all indexed assets across all sites.', category: 'general', status: 'idle', icon: 'search-index' },
];

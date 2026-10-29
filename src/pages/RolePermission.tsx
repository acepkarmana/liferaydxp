import { useState } from 'react';
import { mockRolePermissions, mockRoles } from '../data/mockData';
import { RolePermission as RolePermissionType } from '../types';
import { Shield, ChevronDown, ChevronRight, Check, X, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RolePermission() {
  const [rolePermissions] = useState<RolePermissionType[]>(mockRolePermissions);
  const [selectedRoleId, setSelectedRoleId] = useState<number>(mockRolePermissions[0]?.roleId || 0);
  const [expandedAssets, setExpandedAssets] = useState<Set<number>>(new Set());
  const [localPermissions, setLocalPermissions] = useState<RolePermissionType[]>(mockRolePermissions);

  const selectedRolePerms = localPermissions.find(rp => rp.roleId === selectedRoleId);
  const allRoles = mockRoles;

  const toggleAsset = (assetId: number) => {
    const newExpanded = new Set(expandedAssets);
    if (newExpanded.has(assetId)) {
      newExpanded.delete(assetId);
    } else {
      newExpanded.add(assetId);
    }
    setExpandedAssets(newExpanded);
  };

  const togglePermission = (assetId: number, actionId: string) => {
    setLocalPermissions(prev => prev.map(rp => {
      if (rp.roleId !== selectedRoleId) return rp;
      return {
        ...rp,
        permissions: rp.permissions.map(p => {
          if (p.id !== assetId) return p;
          return {
            ...p,
            actions: p.actions.map(a => {
              if (a.actionId !== actionId) return a;
              return { ...a, supported: !a.supported };
            }),
          };
        }),
      };
    }));
  };

  const toggleAllPermissions = (assetId: number, enable: boolean) => {
    setLocalPermissions(prev => prev.map(rp => {
      if (rp.roleId !== selectedRoleId) return rp;
      return {
        ...rp,
        permissions: rp.permissions.map(p => {
          if (p.id !== assetId) return p;
          return {
            ...p,
            actions: p.actions.map(a => ({ ...a, supported: enable })),
          };
        }),
      };
    }));
  };

  const handleSave = () => {
    toast.success('Permissions saved successfully');
  };

  const handleReset = () => {
    setLocalPermissions(mockRolePermissions);
    toast.success('Permissions reset to defaults');
  };

  const getPermissionCount = (rp: RolePermissionType) => {
    const total = rp.permissions.reduce((acc, p) => acc + p.actions.length, 0);
    const granted = rp.permissions.reduce((acc, p) => acc + p.actions.filter(a => a.supported).length, 0);
    return { total, granted };
  };

  const currentCount = selectedRolePerms ? getPermissionCount(selectedRolePerms) : { total: 0, granted: 0 };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Role Permissions</h1>
          <p className="text-sm text-gray-500 mt-1">View and manage resource permissions for each role</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <AlertTriangle size={14} />
            Reset to Default
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            <Check size={14} />
            Save Changes
          </button>
        </div>
      </div>

      {/* Role Selector */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Role</label>
            <select
              value={selectedRoleId}
              onChange={(e) => { setSelectedRoleId(Number(e.target.value)); setExpandedAssets(new Set()); }}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {allRoles.map(role => (
                <option key={role.id} value={role.id}>
                  {role.name} ({role.type})
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{currentCount.granted}</p>
              <p className="text-xs text-gray-500">Granted</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-400">{currentCount.total - currentCount.granted}</p>
              <p className="text-xs text-gray-500">Denied</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-700">{currentCount.total}</p>
              <p className="text-xs text-gray-500">Total</p>
            </div>
          </div>
        </div>
      </div>

      {/* Permissions List */}
      {selectedRolePerms ? (
        <div className="space-y-3">
          {selectedRolePerms.permissions.map((asset) => {
            const isExpanded = expandedAssets.has(asset.id);
            const grantedCount = asset.actions.filter(a => a.supported).length;
            const totalCount = asset.actions.length;

            return (
              <div key={asset.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                {/* Asset Header */}
                <button
                  onClick={() => toggleAsset(asset.id)}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center">
                      <Shield size={18} className="text-indigo-600" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-gray-900">{asset.assetName}</p>
                      <p className="text-xs text-gray-500 font-mono">{asset.assetType}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      grantedCount === totalCount ? 'bg-green-100 text-green-700' :
                      grantedCount === 0 ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {grantedCount}/{totalCount} permissions
                    </span>
                    {isExpanded ? <ChevronDown size={16} className="text-gray-400" /> : <ChevronRight size={16} className="text-gray-400" />}
                  </div>
                </button>

                {/* Asset Actions */}
                {isExpanded && (
                  <div className="border-t border-gray-100 p-4 bg-gray-50">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-medium text-gray-500 uppercase">Actions</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => toggleAllPermissions(asset.id, true)}
                          className="px-2 py-1 text-xs bg-green-50 text-green-700 rounded hover:bg-green-100"
                        >
                          Grant All
                        </button>
                        <button
                          onClick={() => toggleAllPermissions(asset.id, false)}
                          className="px-2 py-1 text-xs bg-red-50 text-red-700 rounded hover:bg-red-100"
                        >
                          Deny All
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                      {asset.actions.map((action) => (
                        <label
                          key={action.actionId}
                          className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                            action.supported
                              ? 'bg-green-50 border-green-200'
                              : 'bg-white border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className={`w-5 h-5 rounded flex items-center justify-center ${
                            action.supported ? 'bg-green-500' : 'bg-gray-200'
                          }`}>
                            {action.supported && <Check size={12} className="text-white" />}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-700">{action.name}</p>
                            <p className="text-xs text-gray-500 font-mono">{action.actionId}</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={action.supported}
                            onChange={() => togglePermission(asset.id, action.actionId)}
                            className="sr-only"
                          />
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <Shield size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">No permissions configured for this role.</p>
          <p className="text-sm text-gray-400 mt-1">Select a different role or configure permissions.</p>
        </div>
      )}

      {/* API Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle size={16} className="text-blue-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-800">Liferay REST API</p>
            <p className="text-xs text-blue-600 mt-1">
              In production, permissions are managed via <code className="bg-blue-100 px-1 rounded">/o/headless-admin-role/v1.0/roles/{'{roleId}'}/role-permissions</code>
            </p>
            <p className="text-xs text-blue-600 mt-1">
              Resource permissions use the format: <code className="bg-blue-100 px-1 rounded">/api/jsonws/resourcepermission/set-resource-permissions</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

import { PageType } from '../types';
import { mockRoles, mockUsers, mockHousekeepingTasks } from '../data/mockData';
import {
  Shield,
  Users,
  Key,
  Wrench,
  TrendingUp,
  Activity,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Download,
} from 'lucide-react';
import { downloadProjectSource } from '../services/downloadService';
import toast from 'react-hot-toast';
import { useState } from 'react';

interface DashboardProps {
  onNavigate: (page: PageType) => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const [downloading, setDownloading] = useState(false);
  const totalRoles = mockRoles.length;
  const totalUsers = mockUsers.length;
  const activeUsers = mockUsers.filter(u => u.active).length;
  const totalTasks = mockHousekeepingTasks.length;
  const systemRoles = mockRoles.filter(r => r.type === 'System').length;
  const customRoles = mockRoles.filter(r => r.type !== 'System').length;

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await downloadProjectSource();
      toast.success('Source code downloaded! Check your downloads folder.');
    } catch (error) {
      toast.error('Download failed. Please try again.');
    }
    setDownloading(false);
  };

  const stats = [
    { label: 'Total Roles', value: totalRoles, icon: <Shield size={24} />, color: 'bg-blue-500', lightColor: 'bg-blue-50 text-blue-700', page: 'roles' as PageType },
    { label: 'Total Users', value: totalUsers, icon: <Users size={24} />, color: 'bg-green-500', lightColor: 'bg-green-50 text-green-700', page: 'membership' as PageType },
    { label: 'Active Users', value: activeUsers, icon: <Activity size={24} />, color: 'bg-purple-500', lightColor: 'bg-purple-50 text-purple-700', page: 'membership' as PageType },
    { label: 'Housekeeping Tasks', value: totalTasks, icon: <Wrench size={24} />, color: 'bg-orange-500', lightColor: 'bg-orange-50 text-orange-700', page: 'housekeeping' as PageType },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Liferay DXP 2026.Q1 Administration Console</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-50 shadow-md"
          >
            <Download size={16} className={downloading ? 'animate-bounce' : ''} />
            {downloading ? 'Downloading...' : 'Download Source'}
          </button>
          <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
            Client Extension
          </span>
          <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
            v1.0.0
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <button
            key={stat.label}
            onClick={() => onNavigate(stat.page)}
            className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-all text-left group"
          >
            <div className="flex items-center justify-between">
              <div className={`w-12 h-12 rounded-lg ${stat.lightColor} flex items-center justify-center`}>
                {stat.icon}
              </div>
              <ArrowRight size={16} className="text-gray-400 group-hover:text-gray-600 transition-colors" />
            </div>
            <div className="mt-4">
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Role Distribution */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Role Distribution</h3>
            <button onClick={() => onNavigate('roles')} className="text-sm text-blue-600 hover:text-blue-800">
              View All →
            </button>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">Regular Roles</span>
              </div>
              <span className="text-sm font-bold text-gray-900">
                {mockRoles.filter(r => r.type === 'Regular').length}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">Site Roles</span>
              </div>
              <span className="text-sm font-bold text-gray-900">
                {mockRoles.filter(r => r.type === 'Site').length}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">Organization Roles</span>
              </div>
              <span className="text-sm font-bold text-gray-900">
                {mockRoles.filter(r => r.type === 'Organization').length}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">System Roles</span>
              </div>
              <span className="text-sm font-bold text-gray-900">{systemRoles}</span>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-sm">
            <span className="text-gray-500">Custom roles: <strong className="text-gray-700">{customRoles}</strong></span>
            <span className="text-gray-500">System roles: <strong className="text-gray-700">{systemRoles}</strong></span>
          </div>
        </div>

        {/* Recent Activity / Quick Actions */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => onNavigate('roles')}
              className="flex flex-col items-center gap-2 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <Shield size={24} className="text-blue-600" />
              <span className="text-xs font-medium text-blue-700 text-center">Manage Roles</span>
            </button>
            <button
              onClick={() => onNavigate('membership')}
              className="flex flex-col items-center gap-2 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
            >
              <Users size={24} className="text-green-600" />
              <span className="text-xs font-medium text-green-700 text-center">User Membership</span>
            </button>
            <button
              onClick={() => onNavigate('permissions')}
              className="flex flex-col items-center gap-2 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
            >
              <Key size={24} className="text-purple-600" />
              <span className="text-xs font-medium text-purple-700 text-center">Permissions</span>
            </button>
            <button
              onClick={() => onNavigate('housekeeping')}
              className="flex flex-col items-center gap-2 p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
            >
              <Wrench size={24} className="text-orange-600" />
              <span className="text-xs font-medium text-orange-700 text-center">Housekeeping</span>
            </button>
          </div>
        </div>

        {/* System Health */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Health</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-green-500" />
                <span className="text-sm text-gray-700">API Connection</span>
              </div>
              <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">Healthy</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-green-500" />
                <span className="text-sm text-gray-700">Database</span>
              </div>
              <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">Healthy</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle size={16} className="text-yellow-500" />
                <span className="text-sm text-gray-700">Search Index</span>
              </div>
              <span className="text-xs font-medium text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded-full">Needs Reindex</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-green-500" />
                <span className="text-sm text-gray-700">Document Library</span>
              </div>
              <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">Healthy</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle size={16} className="text-yellow-500" />
                <span className="text-sm text-gray-700">Trash / Recycle Bin</span>
              </div>
              <span className="text-xs font-medium text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded-full">23 items</span>
            </div>
          </div>
        </div>

        {/* Liferay REST API Info */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">REST API Endpoints</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded text-xs font-mono">
              <span className="px-1.5 py-0.5 bg-green-100 text-green-700 rounded">GET</span>
              <span className="text-gray-600">/o/headless-admin-user/v1.0/roles</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded text-xs font-mono">
              <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded">POST</span>
              <span className="text-gray-600">/o/headless-admin-user/v1.0/roles</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded text-xs font-mono">
              <span className="px-1.5 py-0.5 bg-green-100 text-green-700 rounded">GET</span>
              <span className="text-gray-600">/o/headless-admin-user/v1.0/accounts</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded text-xs font-mono">
              <span className="px-1.5 py-0.5 bg-yellow-100 text-yellow-700 rounded">PUT</span>
              <span className="text-gray-600">/o/headless-admin-user/v1.0/roles/{'{id}'}</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded text-xs font-mono">
              <span className="px-1.5 py-0.5 bg-red-100 text-red-700 rounded">DEL</span>
              <span className="text-gray-600">/o/headless-admin-user/v1.0/roles/{'{id}'}</span>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
            <TrendingUp size={12} />
            <span>Headless API (Liferay DXP 2026.Q1)</span>
          </div>
        </div>
      </div>
    </div>
  );
}

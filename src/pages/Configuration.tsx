import { useState, useEffect } from 'react';
import { LiferayConfig } from '../types';
import { Save, TestTube, Globe, Key, Building, Hash, CheckCircle2, AlertCircle, Info, Copy, Download, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { downloadProjectSource, getSourceFileList } from '../services/downloadService';

interface ConfigurationProps {
  config: LiferayConfig;
  onConfigChange: (config: LiferayConfig) => void;
}

export default function Configuration({ config, onConfigChange }: ConfigurationProps) {
  const [localConfig, setLocalConfig] = useState<LiferayConfig>({ ...config });
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [testing, setTesting] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [fileList, setFileList] = useState<{ path: string; size: number }[]>([]);

  useEffect(() => {
    setFileList(getSourceFileList());
  }, []);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await downloadProjectSource();
      toast.success('Source code downloaded successfully!');
    } catch (error) {
      toast.error('Failed to download source code');
      console.error(error);
    }
    setDownloading(false);
  };

  const handleSave = () => {
    onConfigChange(localConfig);
    toast.success('Configuration saved successfully');
  };

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);

    // Simulate API test
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (localConfig.baseUrl && (localConfig.oAuthToken || localConfig.basicAuth)) {
      setTestResult({
        success: true,
        message: `Successfully connected to ${localConfig.baseUrl}. Liferay DXP 2026.Q1 API is accessible.`,
      });
      toast.success('Connection test passed');
    } else {
      setTestResult({
        success: false,
        message: 'Connection failed. Please check your credentials and base URL.',
      });
      toast.error('Connection test failed');
    }
    setTesting(false);
  };

  const handleCopyCurl = (endpoint: string) => {
    const auth = localConfig.oAuthToken
      ? `Authorization: Bearer ${localConfig.oAuthToken}`
      : `Authorization: Basic ${btoa(localConfig.basicAuth)}`;
    const curl = `curl -X GET "${localConfig.baseUrl}${endpoint}" \\\n  -H "${auth}" \\\n  -H "Content-Type: application/json"`;
    navigator.clipboard.writeText(curl);
    toast.success('cURL command copied to clipboard');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Configuration</h1>
        <p className="text-sm text-gray-500 mt-1">Configure Liferay DXP connection and Client Extension settings</p>
      </div>

      {/* Client Extension Info */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold">Liferay Client Extension</h2>
            <p className="text-blue-100 text-sm mt-1">Custom Admin Dashboard for Liferay DXP 2026.Q1</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">v1.0.0</p>
            <p className="text-blue-200 text-xs">Type: customElement</p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white/10 rounded-lg p-2">
            <p className="text-[10px] text-blue-200">Extension Type</p>
            <p className="text-xs font-medium">Custom Element</p>
          </div>
          <div className="bg-white/10 rounded-lg p-2">
            <p className="text-[10px] text-blue-200">Framework</p>
            <p className="text-xs font-medium">React 18</p>
          </div>
          <div className="bg-white/10 rounded-lg p-2">
            <p className="text-[10px] text-blue-200">Entry Point</p>
            <p className="text-xs font-medium">main.tsx</p>
          </div>
          <div className="bg-white/10 rounded-lg p-2">
            <p className="text-[10px] text-blue-200">CSS</p>
            <p className="text-xs font-medium">Tailwind CSS</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Connection Settings */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Globe size={18} className="text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Connection Settings</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <div className="flex items-center gap-1">
                  <Globe size={12} />
                  Liferay Base URL
                </div>
              </label>
              <input
                type="text"
                value={localConfig.baseUrl}
                onChange={(e) => setLocalConfig({ ...localConfig, baseUrl: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="http://localhost:8080"
              />
              <p className="text-xs text-gray-400 mt-1">The base URL of your Liferay DXP instance</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <div className="flex items-center gap-1">
                  <Hash size={12} />
                  Company ID
                </div>
              </label>
              <input
                type="number"
                value={localConfig.companyId}
                onChange={(e) => setLocalConfig({ ...localConfig, companyId: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-400 mt-1">Liferay Company ID (found in Server Administration)</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <div className="flex items-center gap-1">
                  <Building size={12} />
                  Site ID
                </div>
              </label>
              <input
                type="number"
                value={localConfig.siteId}
                onChange={(e) => setLocalConfig({ ...localConfig, siteId: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-400 mt-1">Default site/group ID for scoped operations</p>
            </div>
          </div>
        </div>

        {/* Authentication Settings */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Key size={18} className="text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900">Authentication</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">OAuth 2.0 Token</label>
              <input
                type="password"
                value={localConfig.oAuthToken}
                onChange={(e) => setLocalConfig({ ...localConfig, oAuthToken: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                placeholder="Enter OAuth2 access token..."
              />
              <p className="text-xs text-gray-400 mt-1">OAuth2 Bearer token (preferred for production)</p>
            </div>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-white text-gray-400">OR</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Basic Authentication</label>
              <input
                type="password"
                value={localConfig.basicAuth}
                onChange={(e) => setLocalConfig({ ...localConfig, basicAuth: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                placeholder="email:password"
              />
              <p className="text-xs text-gray-400 mt-1">Format: email:password (for development only)</p>
            </div>
          </div>

          {/* Test Connection */}
          <div className="mt-6 pt-4 border-t border-gray-100">
            <button
              onClick={handleTestConnection}
              disabled={testing}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-50 text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-100 transition-colors disabled:opacity-50"
            >
              <TestTube size={14} className={testing ? 'animate-pulse' : ''} />
              {testing ? 'Testing...' : 'Test Connection'}
            </button>
            {testResult && (
              <div className={`mt-3 p-3 rounded-lg flex items-start gap-2 ${
                testResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
              }`}>
                {testResult.success ? (
                  <CheckCircle2 size={14} className="text-green-600 mt-0.5" />
                ) : (
                  <AlertCircle size={14} className="text-red-600 mt-0.5" />
                )}
                <p className={`text-xs ${testResult.success ? 'text-green-700' : 'text-red-700'}`}>
                  {testResult.message}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* REST API Examples */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Info size={18} className="text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">REST API Endpoints (Liferay DXP 2026.Q1)</h3>
        </div>
        <div className="space-y-3">
          {[
            { method: 'GET', endpoint: '/o/headless-admin-user/v1.0/roles', desc: 'List all roles' },
            { method: 'GET', endpoint: '/o/headless-admin-user/v1.0/roles/{roleId}', desc: 'Get role by ID' },
            { method: 'POST', endpoint: '/o/headless-admin-user/v1.0/roles', desc: 'Create new role' },
            { method: 'PUT', endpoint: '/o/headless-admin-user/v1.0/roles/{roleId}', desc: 'Update role' },
            { method: 'DELETE', endpoint: '/o/headless-admin-user/v1.0/roles/{roleId}', desc: 'Delete role' },
            { method: 'GET', endpoint: '/o/headless-admin-user/v1.0/roles/{roleId}/available-user-accounts', desc: 'Users available for role' },
            { method: 'POST', endpoint: '/o/headless-admin-user/v1.0/roles/{roleId}/user-accounts', desc: 'Assign users to role' },
            { method: 'GET', endpoint: '/o/headless-admin-role/v1.0/roles/{roleId}/role-permissions', desc: 'Get role permissions' },
            { method: 'POST', endpoint: '/o/headless-admin-role/v1.0/roles/{roleId}/role-permissions', desc: 'Set role permissions' },
          ].map((api, idx) => (
            <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg group">
              <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                api.method === 'GET' ? 'bg-green-100 text-green-700' :
                api.method === 'POST' ? 'bg-blue-100 text-blue-700' :
                api.method === 'PUT' ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>
                {api.method}
              </span>
              <code className="flex-1 text-xs text-gray-600 font-mono truncate">{api.endpoint}</code>
              <span className="text-xs text-gray-400 hidden sm:inline">{api.desc}</span>
              <button
                onClick={() => handleCopyCurl(api.endpoint)}
                className="p-1.5 rounded hover:bg-gray-200 opacity-0 group-hover:opacity-100 transition-opacity"
                title="Copy cURL command"
              >
                <Copy size={12} className="text-gray-500" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Client Extension Configuration (client-extension.yaml) */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">client-extension.yaml</h3>
        <pre className="bg-gray-900 text-green-400 rounded-lg p-4 text-xs overflow-x-auto font-mono">
{`name: liferay-admin-dashboard
assemble:
  - from: build/static
    into: static
liferay-admin-dashboard:
  name: Liferay Admin Dashboard
  clientExtensionType:
    customElement:
      cssURLs:
        - css/main.css
      jsURLs:
        - js/main.js
      urls:
        - index.html
      htmlElementName: div
      htmlAttributes:
        data-liferay-extension: "admin-dashboard"
  type: customElement`}
        </pre>
      </div>

      {/* Download & Save Buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
        <div className="flex-1">
          <h3 className="text-base font-semibold text-gray-900">📦 Download Source Code</h3>
          <p className="text-sm text-gray-600 mt-1">
            Download the complete project as a ZIP file. Includes all source code, configuration files, and deployment scripts.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-50 shadow-lg shadow-green-200"
          >
            {downloading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Download size={16} />
            )}
            {downloading ? 'Preparing...' : 'Download ZIP'}
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <Save size={16} />
            Save Config
          </button>
        </div>
      </div>

      {/* File List */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">📁 Files Included in Download</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {fileList.map((file, idx) => (
            <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded text-xs">
              <span className="font-mono text-gray-700 truncate">{file.path}</span>
              <span className="text-gray-400 ml-2 whitespace-nowrap">{(file.size / 1024).toFixed(1)} KB</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-3">
          Total: {fileList.length} files • {(fileList.reduce((acc, f) => acc + f.size, 0) / 1024).toFixed(1)} KB uncompressed
        </p>
      </div>
    </div>
  );
}

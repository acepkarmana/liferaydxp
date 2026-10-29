import { LiferayConfig } from '../types';
import { Menu, Bell, Wifi, WifiOff } from 'lucide-react';

interface HeaderProps {
  onToggleSidebar: () => void;
  config: LiferayConfig;
}

export default function Header({ onToggleSidebar, config }: HeaderProps) {
  const isConnected = config.baseUrl !== '';

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors lg:hidden"
        >
          <Menu size={20} className="text-gray-600" />
        </button>
        <div className="hidden sm:flex items-center gap-2">
          <span className="text-sm text-gray-500">Connected to:</span>
          <span className="text-sm font-medium text-gray-800">{config.baseUrl || 'Not configured'}</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Connection Status */}
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
          isConnected ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
        }`}>
          {isConnected ? <Wifi size={12} /> : <WifiOff size={12} />}
          {isConnected ? 'Connected' : 'Disconnected'}
        </div>

        {/* Company ID */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-medium">
          <span>Company:</span>
          <span className="font-bold">{config.companyId}</span>
        </div>

        {/* Notifications */}
        <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <Bell size={18} className="text-gray-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* User Avatar */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
            A
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-gray-800">Admin</p>
            <p className="text-xs text-gray-500">Administrator</p>
          </div>
        </div>
      </div>
    </header>
  );
}

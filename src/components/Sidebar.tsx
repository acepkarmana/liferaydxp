import { PageType } from '../types';
import {
  LayoutDashboard,
  Shield,
  Users,
  Key,
  Wrench,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface SidebarProps {
  currentPage: PageType;
  onNavigate: (page: PageType) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const navItems: { id: PageType; label: string; icon: React.ReactNode; section?: string }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} />, section: 'Overview' },
  { id: 'roles', label: 'Role Management', icon: <Shield size={20} />, section: 'Roles & Permissions' },
  { id: 'membership', label: 'Role Membership', icon: <Users size={20} /> },
  { id: 'permissions', label: 'Role Permissions', icon: <Key size={20} /> },
  { id: 'housekeeping', label: 'Housekeeping', icon: <Wrench size={20} />, section: 'Maintenance' },
  { id: 'configuration', label: 'Configuration', icon: <Settings size={20} />, section: 'Settings' },
];

export default function Sidebar({ currentPage, onNavigate, isOpen, onToggle }: SidebarProps) {
  let currentSection = '';

  return (
    <aside
      className={`${
        isOpen ? 'w-64' : 'w-16'
      } bg-gradient-to-b from-slate-900 to-slate-800 text-white flex flex-col transition-all duration-300 relative`}
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-slate-700">
        {isOpen ? (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center font-bold text-sm">
              LR
            </div>
            <div>
              <h1 className="text-sm font-bold">Liferay Admin</h1>
              <p className="text-[10px] text-slate-400">DXP 2026.Q1</p>
            </div>
          </div>
        ) : (
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center font-bold text-sm mx-auto">
            LR
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto">
        {navItems.map((item) => {
          const showSection = isOpen && item.section && item.section !== currentSection;
          if (item.section) currentSection = item.section;

          return (
            <div key={item.id}>
              {showSection && (
                <p className="px-4 pt-4 pb-1 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                  {item.section}
                </p>
              )}
              <button
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                  currentPage === item.id
                    ? 'bg-blue-600/20 text-blue-400 border-r-2 border-blue-400'
                    : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                } ${!isOpen ? 'justify-center' : ''}`}
                title={!isOpen ? item.label : undefined}
              >
                {item.icon}
                {isOpen && <span>{item.label}</span>}
              </button>
            </div>
          );
        })}
      </nav>

      {/* Toggle button */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-20 w-6 h-6 bg-slate-700 border border-slate-600 rounded-full flex items-center justify-center text-slate-300 hover:bg-slate-600 hover:text-white transition-colors"
      >
        {isOpen ? <ChevronLeft size={12} /> : <ChevronRight size={12} />}
      </button>

      {/* Footer */}
      {isOpen && (
        <div className="p-4 border-t border-slate-700">
          <button
            onClick={() => {
              import('../services/downloadService').then(({ downloadProjectSource }) => {
                downloadProjectSource();
              });
            }}
            className="w-full flex items-center gap-2 px-3 py-2 bg-green-600/20 text-green-400 rounded-lg text-xs font-medium hover:bg-green-600/30 transition-colors mb-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Download Source Code
          </button>
          <div className="text-[10px] text-slate-500">
            <p>Client Extension v1.0.0</p>
            <p>Liferay DXP 2026.Q1</p>
          </div>
        </div>
      )}
    </aside>
  );
}

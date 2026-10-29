import { useState } from 'react';
import { PageType, LiferayConfig } from './types';
import { defaultConfig } from './data/mockData';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import RoleManagement from './pages/RoleManagement';
import RoleMembership from './pages/RoleMembership';
import RolePermission from './pages/RolePermission';
import Housekeeping from './pages/Housekeeping';
import Configuration from './pages/Configuration';
import { Toaster } from 'react-hot-toast';

function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [config, setConfig] = useState<LiferayConfig>(defaultConfig);

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentPage} />;
      case 'roles':
        return <RoleManagement />;
      case 'membership':
        return <RoleMembership />;
      case 'permissions':
        return <RolePermission />;
      case 'housekeeping':
        return <Housekeeping config={config} />;
      case 'configuration':
        return <Configuration config={config} onConfigChange={setConfig} />;
      default:
        return <Dashboard onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      <Sidebar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          config={config}
        />
        <main className="flex-1 overflow-y-auto p-6">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

export default App;

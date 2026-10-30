/**
 * Complete Source Code Bundle for Liferay Admin Dashboard
 * Contains ALL source files generated in this session
 */

export interface SourceFile {
  path: string;
  content: string;
}

export const sourceFiles: SourceFile[] = [
  // Configuration Files
  {
    path: 'package.json',
    content: `{
  "name": "liferay-admin-dashboard",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "lucide-react": "^0.294.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-hot-toast": "^2.4.1",
    "jszip": "^3.10.1",
    "file-saver": "^2.0.5"
  },
  "devDependencies": {
    "@types/file-saver": "^2.0.7",
    "@types/react": "^18.2.37",
    "@types/react-dom": "^18.2.15",
    "@vitejs/plugin-react": "^4.2.0",
    "@tailwindcss/vite": "^4.0.0",
    "tailwindcss": "^4.0.0",
    "typescript": "^5.2.2",
    "vite": "^6.0.0"
  }
}`
  },
  {
    path: 'tsconfig.json',
    content: `{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"]
}`
  },
  {
    path: 'vite.config.js',
    content: `import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
  server: {
    host: "0.0.0.0",
    port: 3000,
    strictPort: true,
    hmr: {
      port: 3000,
    },
  },
});`
  },
  {
    path: 'index.html',
    content: `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Liferay DXP Admin Dashboard | 2026.Q1</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`
  },
  {
    path: 'client-extension.yaml',
    content: `assemble:
  - from: dist
    into: static
liferay-admin-dashboard:
  clientExtensionType:
    customElement:
      cssURLs:
        - css/*.css
      jsURLs:
        - js/*.js
      htmlElementName: div
      htmlAttributes:
        id: liferay-admin-dashboard
  name: Liferay Admin Dashboard
  type: customElement`
  },
  {
    path: 'build-cx.sh',
    content: `#!/bin/bash
set -e
echo "Building Liferay Admin Dashboard Client Extension..."
npm install
npm run build
PACKAGE_DIR="liferay-admin-dashboard-package"
rm -rf "$PACKAGE_DIR"
mkdir -p "$PACKAGE_DIR/static"
cp client-extension.yaml "$PACKAGE_DIR/"
cp -r dist/* "$PACKAGE_DIR/static/"
cd "$PACKAGE_DIR"
zip -r ../liferay-admin-dashboard.zip .
cd ..
rm -rf "$PACKAGE_DIR"
echo "✅ Package created: liferay-admin-dashboard.zip"`
  },
  // Source Files
  {
    path: 'src/main.tsx',
    content: `import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);`
  },
  {
    path: 'src/index.css',
    content: `@import "tailwindcss";`
  },
  {
    path: 'src/App.tsx',
    content: `import { useState } from 'react';
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
import SourceCode from './pages/SourceCode';
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
      case 'source':
        return <SourceCode />;
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

export default App;`
  },
  {
    path: 'README.md',
    content: `# Liferay DXP Admin Dashboard - Client Extension

A comprehensive administrator dashboard for maintaining Liferay DXP 2026.Q1 web applications.

## 🚀 Quick Start

\`\`\`bash
npm install
npm run dev
\`\`\`

Visit http://localhost:3000

## 📦 Build for Production

\`\`\`bash
npm run build
./build-cx.sh
\`\`\`

## 🎯 Deploy to Liferay

1. Copy \`liferay-admin-dashboard.zip\` to \`$LIFERAY_HOME/deploy/\`
2. Or upload via **Control Panel → Client Extensions → Add → Upload**

## ✨ Features

- **Role Management** - CRUD operations for Liferay roles
- **Role Membership** - User-role assignment management  
- **Role Permissions** - Asset-level permission matrix
- **Housekeeping** - Cleanup tasks (folders, files, objects, calendar, trash)
- **Configuration** - Adjustable Liferay connection settings
- **Source Code Browser** - View and download all source files

## 🔌 Liferay REST API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | /o/headless-admin-user/v1.0/roles | List roles |
| POST | /o/headless-admin-user/v1.0/roles | Create role |
| PUT | /o/headless-admin-user/v1.0/roles/{id} | Update role |
| DELETE | /o/headless-admin-user/v1.0/roles/{id} | Delete role |

## 📝 License

MIT`
  },
];

# Liferay DXP Admin Dashboard - Client Extension

A comprehensive administrator dashboard for maintaining Liferay DXP 2026.Q1 web applications, built as a **Liferay Client Extension**.

## 📋 Features

| Module | Description |
|--------|-------------|
| **Role Management** | Create, edit, delete roles (Regular, Site, Organization, System) |
| **Role Membership** | Assign/remove users from roles with bulk operations |
| **Role Permissions** | View and manage asset-level permissions per role |
| **Housekeeping** | Cleanup tasks: folders, files, objects, calendar, trash, reindex |
| **Configuration** | Adjustable Liferay connection settings (Base URL, Auth, Company ID) |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────┐
│           Liferay DXP Portal                │
│  ┌───────────────────────────────────────┐  │
│  │   Client Extension (Custom Element)   │  │
│  │  ┌─────────────────────────────────┐  │  │
│  │  │   React 18 + Tailwind CSS       │  │  │
│  │  │   (This Dashboard)              │  │  │
│  │  └─────────────────────────────────┘  │  │
│  │              ↕ REST API               │  │
│  │  ┌─────────────────────────────────┐  │  │
│  │  │   Liferay Headless API          │  │  │
│  │  │   /o/headless-admin-*/v1.0/     │  │  │
│  │  └─────────────────────────────────┘  │  │
│  └───────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
```

---

## 🚀 Deployment Options

### Option 1: Liferay Workspace (Recommended)

This is the standard approach for Liferay DXP deployments.

#### Prerequisites
- Liferay DXP 2026.Q1 (or 7.4+)
- Liferay Workspace (Blade CLI)
- Node.js 18+ and npm

#### Step 1: Create a Liferay Workspace

```bash
# Install Blade CLI if not already installed
curl -L https://releases.liferay.com/tools/workspace/latest/liferay-workspace.jar -o liferay-workspace.jar
java -jar liferay-workspace.jar init my-liferay-project

cd my-liferay-project
```

#### Step 2: Create a Client Extension module

```bash
blade create -t client-extension liferay-admin-dashboard
```

#### Step 3: Copy this project into the module

```bash
# Copy the built files into the client extension module
cp -r /path/to/this/project/dist/* liferay-admin-dashboard/src/main/resources/META-INF/resources/
cp client-extension.yaml liferay-admin-dashboard/client-extension.yaml
```

#### Step 4: Build and Deploy

```bash
# From the workspace root
./gradlew deploy

# The .lpkg file will be in:
# deploy/liferay-admin-dashboard-1.0.0.lpkg
```

#### Step 5: Install in Liferay

1. Go to **Control Panel → Apps → App Manager**
2. Click the **+** button → **Install from File**
3. Upload the `.lpkg` file
4. The extension will appear in **Control Panel → Client Extensions**

---

### Option 2: Standalone Deployment (Quick Start)

For quick testing without a full Liferay Workspace.

#### Step 1: Build the project

```bash
npm install
npm run build
```

#### Step 2: Create the Client Extension ZIP

```bash
# Create the deployment package
./build-cx.sh
```

This creates `liferay-admin-dashboard.zip` with the following structure:

```
liferay-admin-dashboard.zip
├── client-extension.yaml
└── static/
    ├── index.html
    └── assets/
        ├── index-*.js
        └── index-*.css
```

#### Step 3: Deploy to Liferay

**Method A: Via deploy folder**
```bash
# Copy the zip to Liferay's deploy folder
cp liferay-admin-dashboard.zip $LIFERAY_HOME/deploy/

# Liferay will automatically deploy it
```

**Method B: Via Control Panel**
1. Go to **Control Panel → Client Extensions**
2. Click **Add** → **Upload**
3. Upload the ZIP file
4. Configure the extension settings

---

### Option 3: Direct File Deployment (Development)

For rapid development and testing.

```bash
# Build the project
npm run build

# Copy directly to Liferay's document library
# or use the Liferay JS Tooling

# Using Liferay JS Generator
npx @liferay/js-generator

# Or manually copy to the theme/resources folder
cp -r dist/* $LIFERAY_HOME/osgi/modules/liferay-admin-dashboard/
```

---

## 🔧 Configuration

After deployment, configure the extension in **Control Panel → Client Extensions → Liferay Admin Dashboard**:

| Setting | Description | Default |
|---------|-------------|---------|
| **Base URL** | Liferay instance URL | `http://localhost:8080` |
| **Company ID** | Liferay Company ID | `20116` |
| **Site ID** | Default site/group ID | `20120` |
| **OAuth Token** | OAuth2 Bearer token | (empty) |
| **Basic Auth** | email:password format | `test@liferay.com:test` |

---

## 🔌 Liferay REST API Endpoints Used

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/o/headless-admin-user/v1.0/roles` | List roles |
| `POST` | `/o/headless-admin-user/v1.0/roles` | Create role |
| `PUT` | `/o/headless-admin-user/v1.0/roles/{id}` | Update role |
| `DELETE` | `/o/headless-admin-user/v1.0/roles/{id}` | Delete role |
| `GET` | `/o/headless-admin-role/v1.0/roles/{id}/role-permissions` | Get permissions |
| `POST` | `/o/headless-admin-role/v1.0/roles/{id}/role-permissions` | Set permissions |
| `GET` | `/o/headless-admin-user/v1.0/user-accounts` | List users |
| `POST` | `/o/headless-admin-user/v1.0/roles/{id}/user-accounts` | Assign users |

---

## 🔐 Authentication Setup

### OAuth 2.0 (Production)

1. Go to **Control Panel → Server Administration → OAuth 2.0**
2. Create a new application:
   - **Name**: Admin Dashboard
   - **Callback URL**: `http://localhost:8080/o/oauth2/redirect`
   - **Scopes**: `Liferay.Headless.Admin.Role`, `Liferay.Headless.Admin.User`
3. Copy the **Client ID** and **Client Secret**
4. Generate an access token and paste it in the Configuration page

### Basic Authentication (Development Only)

```
Format: email@company.com:password
Example: test@liferay.com:test
```

⚠️ **Warning**: Basic auth should only be used in development environments.

---

## 📁 Project Structure

```
liferay-admin-dashboard/
├── client-extension.yaml      # Liferay CX descriptor
├── build-cx.sh                # Build script for CX package
├── package.json               # Node dependencies
├── vite.config.js             # Vite build configuration
├── tsconfig.json              # TypeScript configuration
├── index.html                 # Entry HTML
├── src/
│   ├── main.tsx               # React entry point
│   ├── App.tsx                # Main application component
│   ├── index.css              # Global styles (Tailwind)
│   ├── types/
│   │   └── index.ts           # TypeScript type definitions
│   ├── data/
│   │   └── mockData.ts        # Mock data (replace with API calls)
│   ├── components/
│   │   ├── Sidebar.tsx        # Navigation sidebar
│   │   └── Header.tsx         # Top header bar
│   └── pages/
│       ├── Dashboard.tsx      # Overview dashboard
│       ├── RoleManagement.tsx # Role CRUD operations
│       ├── RoleMembership.tsx # User-role assignments
│       ├── RolePermission.tsx # Permission matrix
│       ├── Housekeeping.tsx   # Cleanup tasks
│       └── Configuration.tsx  # Connection settings
└── dist/                      # Build output
    ├── index.html
    └── assets/
        ├── index-*.js
        └── index-*.css
```

---

## 🔄 Connecting to Real Liferay APIs

To replace mock data with actual Liferay API calls, update the data layer:

```typescript
// src/services/liferayApi.ts
const API_BASE = '${config.baseUrl}/o';

export async function getRoles(config: LiferayConfig) {
  const response = await fetch(
    `${API_BASE}/headless-admin-user/v1.0/roles`,
    {
      headers: {
        'Authorization': `Bearer ${config.oAuthToken}`,
        'Content-Type': 'application/json',
      },
    }
  );
  return response.json();
}

export async function getRolePermissions(config: LiferayConfig, roleId: number) {
  const response = await fetch(
    `${API_BASE}/headless-admin-role/v1.0/roles/${roleId}/role-permissions`,
    {
      headers: {
        'Authorization': `Bearer ${config.oAuthToken}`,
        'Content-Type': 'application/json',
      },
    }
  );
  return response.json();
}
```

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Extension not appearing | Check `deploy/` folder, restart Liferay |
| CORS errors | Add your domain to Liferay's CORS configuration |
| 401 Unauthorized | Verify OAuth token or Basic Auth credentials |
| Blank page | Check browser console for JS errors |
| CSS not loading | Ensure CSS files are in the correct path |
| API calls failing | Verify Base URL and Company ID |

---

## 📝 License

This project is provided as-is for Liferay DXP administration purposes.

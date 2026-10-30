# Quick Fix: Jericho HTML Parser Error

## 🚨 The Problem

You're seeing this error in Liferay logs:
```
ERROR [jericho:53] Encountered possible EndTag at (r239,c72,p1280) 
whose content does not match a registered EndTagType
```

## ✅ The Fix (3 Steps)

### Step 1: Update client-extension.yaml

Replace your `client-extension.yaml` with this:

```yaml
assemble:
  - from: dist
    into: static
liferay-admin-dashboard:
  name: Liferay Admin Dashboard
  clientExtensionType:
    customElement:
      cssURLs:
        - static/assets/*.css
      jsURLs:
        - static/assets/*.js
      htmlElementName: liferay-admin-dashboard
  type: customElement
```

**Key changes:**
- ✅ `htmlElementName: liferay-admin-dashboard` (NOT `div`)
- ✅ CSS/JS paths: `static/assets/*.css` and `static/assets/*.js`

### Step 2: Update src/main.tsx

Replace your `src/main.tsx` with this:

```typescript
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

// Register as a custom element for Liferay
class LiferayAdminDashboard extends HTMLElement {
  connectedCallback() {
    const root = ReactDOM.createRoot(this);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  }
}

// Register the custom element
if (!customElements.get('liferay-admin-dashboard')) {
  customElements.define('liferay-admin-dashboard', LiferayAdminDashboard);
}

// Also render to #root for standalone development
const rootElement = document.getElementById("root");
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
```

**Key changes:**
- ✅ Registers `liferay-admin-dashboard` as a custom element
- ✅ Prevents Liferay from parsing JS as HTML

### Step 3: Rebuild and Redeploy

```bash
# Rebuild the project
npm run build

# Create the package
./build-cx.sh

# Remove old deployment
rm -f $LIFERAY_HOME/deploy/liferay-admin-dashboard.zip
rm -f $LIFERAY_HOME/osgi/modules/liferay-admin-dashboard*.jar

# Copy new package
cp liferay-admin-dashboard.zip $LIFERAY_HOME/deploy/

# Restart Liferay
cd $LIFERAY_HOME/tomcat/bin
./shutdown.sh
./startup.sh
```

## 🔍 Verify the Fix

After restarting Liferay, check:

1. **No Jericho errors in logs:**
   ```bash
   tail -f $LIFERAY_HOME/tomcat/logs/catalina.out | grep -i jericho
   ```
   Should show no errors.

2. **Extension appears in Control Panel:**
   - Go to: Control Panel → Client Extensions
   - You should see "Liferay Admin Dashboard"

3. **Extension loads correctly:**
   - Add the extension to a page
   - It should display without errors

## 🧪 Run Validation

Use the validation script to check your deployment:

```bash
chmod +x validate-deployment.sh
./validate-deployment.sh
```

This will check for common issues and tell you if everything is configured correctly.

## 📋 What Changed?

| Before (❌ Broken) | After (✅ Fixed) |
|-------------------|-----------------|
| `htmlElementName: div` | `htmlElementName: liferay-admin-dashboard` |
| `cssURLs: css/*.css` | `cssURLs: static/assets/*.css` |
| `jsURLs: js/*.js` | `jsURLs: static/assets/*.js` |
| No custom element registration | Custom element registered in main.tsx |

## 🆘 Still Having Issues?

1. **Clear Liferay cache:**
   ```bash
   rm -rf $LIFERAY_HOME/osgi/state
   rm -rf $LIFERAY_HOME/tomcat/temp/*
   rm -rf $LIFERAY_HOME/tomcat/work/*
   ```

2. **Check file permissions:**
   ```bash
   chmod 644 $LIFERAY_HOME/deploy/liferay-admin-dashboard.zip
   ```

3. **Verify ZIP structure:**
   ```bash
   unzip -l liferay-admin-dashboard.zip
   ```
   Should show:
   ```
   client-extension.yaml
   static/index.html
   static/assets/index-*.js
   static/assets/index-*.css
   ```

4. **Check Liferay version:**
   - Must be DXP 2026.Q1 or 7.4+
   - Older versions may not support client extensions

## 📚 Additional Resources

- [Full Troubleshooting Guide](./TROUBLESHOOTING.md)
- [Liferay Client Extensions Documentation](https://learn.liferay.com/dxp/latest/en/developing-applications/extending-liferay-with-client-extensions.html)
- [Docker Deployment Guide](./DOCKER_DEPLOYMENT.md)

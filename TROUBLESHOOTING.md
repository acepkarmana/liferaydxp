# Troubleshooting: Jericho HTML Parser Error

## Error Message
```
ERROR [jericho:53] Encountered possible EndTag at (r239,c72,p1280) whose content does not match a registered EndTagType
```

## Root Cause

This error occurs when Liferay's Jericho HTML parser tries to parse your JavaScript bundle as HTML content. This happens because:

1. **Incorrect `htmlElementName`**: Using standard HTML tags like `div` causes Liferay to process the content
2. **Wrong file paths**: CSS/JS URLs don't match the actual build output structure
3. **Content processing**: Liferay's content filter is processing static resources

## Solution

### 1. Fix client-extension.yaml

**❌ WRONG (causes the error):**
```yaml
liferay-admin-dashboard:
  clientExtensionType:
    customElement:
      htmlElementName: div  # ❌ Standard HTML tag
      cssURLs:
        - css/*.css         # ❌ Wrong path
      jsURLs:
        - js/*.js           # ❌ Wrong path
```

**✅ CORRECT:**
```yaml
assemble:
  - from: dist
    into: static
liferay-admin-dashboard:
  name: Liferay Admin Dashboard
  clientExtensionType:
    customElement:
      cssURLs:
        - static/assets/*.css    # ✅ Correct path
      jsURLs:
        - static/assets/*.js     # ✅ Correct path
      htmlElementName: liferay-admin-dashboard  # ✅ Custom element name
  type: customElement
```

### 2. Register Custom Element in main.tsx

Your `src/main.tsx` must register the custom element:

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

### 3. Verify Build Output Structure

After running `npm run build`, your `dist/` folder should contain:

```
dist/
├── index.html
└── assets/
    ├── index-*.js
    └── index-*.css
```

### 4. Verify Package Structure

After running `./build-cx.sh`, the ZIP should contain:

```
liferay-admin-dashboard.zip
├── client-extension.yaml
└── static/
    ├── index.html
    └── assets/
        ├── index-*.js
        └── index-*.css
```

### 5. Check portal-ext.properties

Add these properties to `$LIFERAY_HOME/portal-ext.properties`:

```properties
# Disable HTML parsing for static resources
com.liferay.portal.servlet.filters.etag.EtagFilter=false

# Increase parser tolerance (if needed)
com.liferay.portal.security.html.HTMLParserImpl.jericho.logger.level=ERROR
```

### 6. Restart Liferay

After making changes:

```bash
# Stop Liferay
cd $LIFERAY_HOME/tomcat/bin
./shutdown.sh

# Clear OSGi cache
rm -rf ../osgi/state

# Start Liferay
./startup.sh
```

### 7. Verify Deployment

1. Check **Control Panel → Client Extensions**
2. Verify the extension is listed
3. Check Liferay logs for errors:
   ```bash
   tail -f $LIFERAY_HOME/tomcat/logs/catalina.out | grep -i "admin-dashboard"
   ```

## Common Issues

### Issue 1: Extension Not Appearing
**Solution:** Check that the ZIP structure is correct and `client-extension.yaml` is at the root level.

### Issue 2: Blank Page After Deployment
**Solution:** 
- Check browser console for JavaScript errors
- Verify the custom element is registered: `document.querySelector('liferay-admin-dashboard')`
- Check that CSS/JS files are loading (Network tab)

### Issue 3: Styles Not Applied
**Solution:**
- Ensure Tailwind CSS is properly configured
- Check that CSS file is being loaded
- Verify there are no CORS issues

### Issue 4: Still Getting Jericho Error
**Solution:**
1. Double-check `htmlElementName` is a custom element (contains hyphen)
2. Verify CSS/JS URLs match the actual file paths
3. Clear Liferay's document library cache
4. Check file permissions on the deployed files

## Debugging Steps

### Step 1: Check File MIME Types
```bash
# In browser DevTools → Network tab
# Verify JS files have Content-Type: application/javascript
# Verify CSS files have Content-Type: text/css
```

### Step 2: Test Custom Element Registration
```javascript
// In browser console
customElements.get('liferay-admin-dashboard')
// Should return the class constructor, not undefined
```

### Step 3: Check Liferay Logs
```bash
# Look for client extension loading
grep -i "client.*extension" $LIFERAY_HOME/tomcat/logs/catalina.out

# Look for resource loading errors
grep -i "resource.*not.*found" $LIFERAY_HOME/tomcat/logs/catalina.out
```

### Step 4: Verify Static Resources
```bash
# Check if files are accessible
curl -I http://localhost:8080/o/client-extension/liferay-admin-dashboard/static/assets/index-*.js
# Should return 200 OK with correct MIME type
```

## Alternative: Use Static Resource Type

If the custom element approach continues to cause issues, you can use the `staticResource` type instead:

```yaml
assemble:
  - from: dist
    into: static
liferay-admin-dashboard:
  name: Liferay Admin Dashboard
  clientExtensionType:
    staticResource:
      urls:
        - static/index.html
  type: staticResource
```

Then access it via: `http://localhost:8080/o/client-extension/liferay-admin-dashboard/static/index.html`

## Support

If you continue to experience issues:

1. Check Liferay version: Must be DXP 2026.Q1 or 7.4+
2. Verify Node.js version: 18+
3. Check build logs for warnings
4. Review Liferay's official documentation: https://learn.liferay.com/dxp/latest/en/developing-applications/extending-liferay-with-client-extensions.html

# Configuration After Deployment - Complete Guide

## 🎯 The Issue

After deploying the Liferay Admin Dashboard to Liferay DXP, you noticed there's no configuration option in **Control Panel → Client Extensions → Liferay Admin Dashboard**.

## ✅ The Solution

**This is expected behavior!** In Liferay DXP, Client Extensions handle configuration **within the application itself**, not through Control Panel.

## 📍 How to Configure (3 Methods)

### Method 1: Through the Dashboard (Primary Method)

1. **Add the extension to a page:**
   ```
   Site Builder → Pages → Add Widget → Client Extensions → Liferay Admin Dashboard
   ```

2. **Open the dashboard and navigate to Configuration:**
   - Look for **⚙️ Configuration** in the left sidebar (bottom section)
   - Click on it to open the configuration page

3. **Set up your connection:**
   - **Base URL**: `http://localhost:8080` (or your Liferay URL)
   - **Company ID**: Found in Control Panel → Server Administration
   - **Site ID**: Your site's group ID
   - **Authentication**: Basic Auth or OAuth 2.0

4. **Test and save:**
   - Click **Test Connection** to verify
   - Click **Save Configuration**

### Method 2: Direct URL Access

Access the standalone configuration page directly:

```
http://your-liferay-url/o/client-extension/liferay-admin-dashboard/static/configuration.html
```

This page provides:
- ✅ Clean configuration interface
- ✅ Connection testing
- ✅ Settings saved to browser local storage

### Method 3: Using the Configuration Page in Dashboard

The dashboard includes a full-featured configuration page with:
- Connection settings
- Authentication setup
- REST API endpoint reference
- cURL command generator
- Configuration file preview

## 🔧 Configuration Properties

| Property | Description | Where to Find |
|----------|-------------|---------------|
| **Base URL** | Liferay instance URL | Your Liferay URL |
| **Company ID** | Liferay Company ID | Control Panel → Server Administration |
| **Site ID** | Site/Group ID | Site Settings → General |
| **Auth Type** | Authentication method | - |
| **Basic Auth** | email:password | Your admin credentials |
| **OAuth Token** | OAuth 2.0 token | Control Panel → OAuth 2.0 |

## 🔐 Setting Up Authentication

### For Development (Basic Auth)
```
Email: test@liferay.com
Password: test
Format: test@liferay.com:test
```

### For Production (OAuth 2.0)
1. Go to **Control Panel → Server Administration → OAuth 2.0**
2. Create new application:
   - Name: Admin Dashboard
   - Scopes: `Liferay.Headless.Admin.Role.everything`, `Liferay.Headless.Admin.User.everything`
3. Generate access token
4. Copy token to configuration

## 💾 Where Settings Are Stored

Configuration is stored in **browser local storage**:
- Key: `liferay-admin-dashboard-config`
- Scope: Per browser/per device
- Persistence: Survives page reloads

To reset:
```javascript
localStorage.removeItem('liferay-admin-dashboard-config');
location.reload();
```

## 🆘 Troubleshooting

### Issue: Can't find Configuration in Control Panel
**This is normal!** Configuration is done through the dashboard, not Control Panel.

### Issue: Configuration page not loading
**Solutions:**
1. Verify the extension is deployed: Check Control Panel → Client Extensions
2. Check the URL: `http://your-liferay/o/client-extension/liferay-admin-dashboard/static/configuration.html`
3. Clear browser cache and reload
4. Check Liferay logs for errors

### Issue: Connection test fails
**Solutions:**
1. Verify Base URL is correct and accessible
2. Check Company ID matches your Liferay instance
3. Verify authentication credentials
4. Check browser console for CORS errors
5. Add CORS config to `portal-ext.properties` (see below)

### CORS Configuration
Add to `$LIFERAY_HOME/portal-ext.properties`:
```properties
com.liferay.portal.security.cors.CORSConfigurationImpl.allowedOrigins=*
com.liferay.portal.security.cors.CORSConfigurationImpl.allowedMethods=GET,POST,PUT,DELETE,OPTIONS
com.liferay.portal.security.cors.CORSConfigurationImpl.allowedHeaders=Authorization,Content-Type,Accept
```

## 📋 Why No Control Panel Configuration?

Liferay Client Extensions are designed to be **self-contained applications**. This approach provides:

✅ **Better UX**: Configuration is integrated into the application  
✅ **Real-time testing**: Test connection before saving  
✅ **No restart needed**: Changes take effect immediately  
✅ **Per-user settings**: Each user can have their own configuration  
✅ **Simpler deployment**: No need to configure in multiple places  

If you need **system-wide configuration**, you can:
1. Use `portal-ext.properties` for global settings
2. Create a separate configuration portlet
3. Use Liferay's Configuration API

## 🚀 Quick Start Checklist

- [ ] Deploy `liferay-admin-dashboard.zip` to `$LIFERAY_HOME/deploy/`
- [ ] Restart Liferay
- [ ] Add extension to a page
- [ ] Navigate to Configuration in sidebar
- [ ] Set Base URL (e.g., `http://localhost:8080`)
- [ ] Set Company ID (from Server Administration)
- [ ] Configure authentication (Basic or OAuth)
- [ ] Test connection
- [ ] Save configuration
- [ ] Start using the dashboard!

## 📚 Documentation

- **CONFIGURATION_GUIDE.md** - Detailed configuration guide
- **QUICK_FIX.md** - Quick troubleshooting
- **TROUBLESHOOTING.md** - Comprehensive troubleshooting
- **README.md** - Project overview

## ✨ Summary

The configuration is accessible through:
1. **Dashboard sidebar** → Configuration (primary method)
2. **Direct URL** → `/o/client-extension/liferay-admin-dashboard/static/configuration.html`

There is **no configuration option in Control Panel** because Client Extensions handle configuration within the application itself. This is the **correct and intended behavior** for Liferay DXP Client Extensions.

Simply add the extension to a page, open it, and click **Configuration** in the sidebar to set up your connection!

# Configuration Guide - Liferay Admin Dashboard

## 📍 How to Access Configuration

After deploying the Liferay Admin Dashboard to Liferay DXP, there are **two ways** to configure it:

### Method 1: Through the Dashboard (Recommended)

1. **Add the extension to a Liferay page:**
   - Go to any page in your Liferay site
   - Click **Add** → **Widgets** → **Client Extensions**
   - Drag "Liferay Admin Dashboard" to the page
   - Or use a Fragment Entry to embed it

2. **Navigate to Configuration:**
   - Once the dashboard loads, click **Configuration** in the left sidebar
   - Or look for the **⚙️ Settings** section at the bottom of the sidebar

3. **Configure your settings:**
   - **Liferay Base URL**: Your Liferay instance URL (e.g., `http://localhost:8080`)
   - **Company ID**: Found in Control Panel → Server Administration
   - **Site ID**: Default site/group ID for operations
   - **Authentication**: OAuth 2.0 token or Basic Auth credentials

4. **Test the connection:**
   - Click **Test Connection** to verify settings
   - Save the configuration

### Method 2: Direct URL Access

You can also access the configuration page directly:

```
http://your-liferay-url/o/client-extension/liferay-admin-dashboard/static/configuration.html
```

This standalone configuration page allows you to:
- Set up connection parameters
- Test the API connection
- Save settings to browser local storage

## 🔧 Configuration Properties

| Property | Description | Example |
|----------|-------------|---------|
| **Base URL** | Liferay DXP instance URL | `http://localhost:8080` |
| **Company ID** | Liferay Company ID | `20116` |
| **Site ID** | Default site/group ID | `20120` |
| **Auth Type** | Authentication method | `basic` or `oauth` |
| **Basic Auth** | Email:password format | `test@liferay.com:test` |
| **OAuth Token** | OAuth 2.0 Bearer token | (generated token) |

## 🔐 Setting Up Authentication

### Option 1: Basic Authentication (Development)

1. Use your Liferay admin credentials:
   ```
   Email: test@liferay.com
   Password: test
   ```

2. Enter in the format: `test@liferay.com:test`

⚠️ **Warning**: Only use Basic Auth in development environments!

### Option 2: OAuth 2.0 (Production)

1. Go to **Control Panel → Server Administration → OAuth 2.0**
2. Click **Add** → **OAuth 2.0 Application**
3. Configure:
   - **Name**: Admin Dashboard
   - **Client Profile**: Web Application
   - **Callback URLs**: `http://localhost:8080/o/oauth2/redirect`
   - **Scopes**: 
     - `Liferay.Headless.Admin.Role.everything`
     - `Liferay.Headless.Admin.User.everything`
4. Generate an access token
5. Copy the token to the Configuration page

## 📋 Finding Your Company ID

1. Log in to Liferay as an administrator
2. Go to **Control Panel → Configuration → Server Administration**
3. Look for **Company ID** in the server information
4. It's typically a number like `20116`

## 🌐 Finding Your Site ID

1. Go to **Control Panel → Sites**
2. Click on your site
3. Look at the URL - it will contain the site ID
4. Or check **Site Settings → General** for the Group ID

## 💾 Where Configuration is Stored

The configuration is stored in your **browser's local storage**:
- Key: `liferay-admin-dashboard-config`
- Scope: Per browser/per device
- Persistence: Survives page reloads

To clear the configuration:
```javascript
localStorage.removeItem('liferay-admin-dashboard-config');
location.reload();
```

## 🔍 Troubleshooting Configuration Issues

### Issue: "Configuration not found"
**Solution**: Navigate to the Configuration page and set up your connection settings.

### Issue: "Connection test failed"
**Solutions**:
1. Verify the Base URL is correct and accessible
2. Check that Company ID matches your Liferay instance
3. Verify authentication credentials are correct
4. Check browser console for CORS errors
5. Ensure the user has proper permissions

### Issue: "CORS error in browser console"
**Solution**: Add CORS configuration to `portal-ext.properties`:
```properties
com.liferay.portal.security.cors.CORSConfigurationImpl.allowedOrigins=*
com.liferay.portal.security.cors.CORSConfigurationImpl.allowedMethods=GET,POST,PUT,DELETE,OPTIONS
com.liferay.portal.security.cors.CORSConfigurationImpl.allowedHeaders=Authorization,Content-Type,Accept
```

### Issue: "401 Unauthorized"
**Solutions**:
1. Verify authentication credentials
2. Check that the user has administrator permissions
3. For OAuth, ensure the token hasn't expired
4. Regenerate the OAuth token if needed

## 🎯 Why No Configuration in Control Panel?

In Liferay DXP, **Client Extensions** are designed to be self-contained applications. The configuration is handled **within the application itself** rather than through Control Panel.

This approach provides:
- ✅ Better user experience
- ✅ Real-time configuration testing
- ✅ No need to restart Liferay after configuration changes
- ✅ Configuration is stored per-user/per-browser

If you need system-wide configuration, you can:
1. Use `portal-ext.properties` for global settings
2. Create a separate configuration portlet
3. Use Liferay's Configuration API

## 📚 Additional Resources

- [Liferay Client Extensions Documentation](https://learn.liferay.com/dxp/latest/en/developing-applications/extending-liferay-with-client-extensions.html)
- [Liferay Headless API Reference](https://learn.liferay.com/dxp/latest/en/headless-api/index.html)
- [OAuth 2.0 Configuration](https://learn.liferay.com/dxp/latest/en/users-and-organizations/oauth2.html)

## 🆘 Need Help?

If you're still having configuration issues:

1. Check the browser console for errors
2. Verify Liferay logs: `tail -f $LIFERAY_HOME/tomcat/logs/catalina.out`
3. Test the API directly with curl:
   ```bash
   curl -u test@liferay.com:test \
     http://localhost:8080/o/headless-admin-user/v1.0/roles
   ```
4. Review the [Troubleshooting Guide](./TROUBLESHOOTING.md)

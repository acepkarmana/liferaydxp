# Liferay Workspace Integration Guide

This guide shows how to integrate the Admin Dashboard into a Liferay Workspace project.

## 📁 Workspace Structure

```
my-liferay-workspace/
├── build.gradle
├── settings.gradle
├── gradle.properties
├── configs/
│   ├── common/
│   ├── dev/
│   ├── local/
│   ├── prod/
│   └── uat/
├── modules/
│   └── liferay-admin-dashboard/          ← Client Extension Module
│       ├── build.gradle
│       ├── client-extension.yaml
│       ├── package.json
│       ├── vite.config.js
│       ├── tsconfig.json
│       └── src/
│           ├── main/
│           │   └── resources/
│           │       └── META-INF/
│           │           └── resources/
│           │               ├── index.html
│           │               └── assets/
│           │                   ├── index-*.js
│           │                   └── index-*.css
│           └── main.js (or main.tsx)
└── themes/
```

## 🔧 Step-by-Step Setup

### 1. Create the Workspace

```bash
# Using Blade CLI
blade init -v 7.4 my-liferay-workspace
cd my-liferay-workspace
```

### 2. Create the Client Extension Module

```bash
blade create -t client-extension -p com.mycompany.modules liferay-admin-dashboard
```

### 3. Configure `build.gradle`

```groovy
// modules/liferay-admin-dashboard/build.gradle

plugins {
    id 'com.liferay.node' version 'latest.release'
}

node {
    nodeVersion = '18.17.0'
}

task buildClientExtension(type: Exec) {
    workingDir '.'
    commandLine 'npm', 'run', 'build'
}

task copyBuildOutput(type: Copy) {
    dependsOn buildClientExtension
    from 'dist'
    into 'src/main/resources/META-INF/resources'
}

processResources {
    dependsOn copyBuildOutput
}
```

### 4. Configure `client-extension.yaml`

```yaml
# modules/liferay-admin-dashboard/client-extension.yaml

assemble:
  - from: src/main/resources/META-INF/resources
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
  type: customElement
```

### 5. Build and Deploy

```bash
# From workspace root
./gradlew :modules:liferay-admin-dashboard:deploy

# Or build everything
./gradlew deploy
```

### 6. Verify Deployment

1. Start Liferay: `./gradlew bundleSupport start`
2. Go to: `http://localhost:8080`
3. Navigate to: **Control Panel → Client Extensions**
4. Verify "Liferay Admin Dashboard" is listed

---

## 🎯 Adding to a Liferay Page

### Method 1: Fragment Entry (Recommended)

Create a Fragment Entry to embed the dashboard:

```html
<!-- fragments/liferay-admin-dashboard/fragment.html -->
<div id="liferay-admin-dashboard"></div>

<script type="module">
  // The client extension auto-mounts to this element
</script>
```

### Method 2: Content Widget

1. Go to **Site Builder → Pages**
2. Add a **Widget** → **Client Extension**
3. Select "Liferay Admin Dashboard"

### Method 3: Direct URL

Access the dashboard directly:
```
http://localhost:8080/o/admin-dashboard
```

---

## 🔐 Security Configuration

### Add CORS Configuration

In `configs/common/portal-ext.properties`:

```properties
# Enable CORS for the client extension
com.liferay.portal.security.cors.CORSConfigurationImpl.allowedOrigins=http://localhost:3000,http://localhost:8080
com.liferay.portal.security.cors.CORSConfigurationImpl.allowedMethods=GET,POST,PUT,DELETE,OPTIONS
com.liferay.portal.security.cors.CORSConfigurationImpl.allowedHeaders=Authorization,Content-Type,Accept
com.liferay.portal.security.cors.CORSConfigurationImpl.supportedCredentials=true
```

### OAuth 2.0 Application Setup

1. Go to **Control Panel → Server Administration → OAuth 2.0**
2. Click **Add** → **OAuth 2.0 Application**
3. Configure:
   - **Name**: Admin Dashboard
   - **Client Profile**: Web Application
   - **Callback URLs**: `http://localhost:8080/o/oauth2/redirect`
   - **Site**: Global (or specific site)
   - **Scopes**: 
     - `Liferay.Headless.Admin.Role.everything`
     - `Liferay.Headless.Admin.User.everything`

---

## 🌍 Environment-Specific Configuration

### `configs/dev/portal-ext.properties`

```properties
# Development settings
module.framework.properties.osgi.console=0.0.0.0:11311
web.server.http.port=8080
```

### `configs/prod/portal-ext.properties`

```properties
# Production settings
web.server.http.port=443
web.server.https.port=443
company.default.web.id=your-company.com
```

---

## 📦 Deployment Checklist

- [ ] Build the project: `npm run build`
- [ ] Verify `client-extension.yaml` is correct
- [ ] Test locally: `./gradlew deploy` + start Liferay
- [ ] Check **Control Panel → Client Extensions**
- [ ] Configure OAuth2 or Basic Auth
- [ ] Test API connectivity
- [ ] Add to a Liferay page
- [ ] Verify permissions work correctly
- [ ] Test housekeeping tasks
- [ ] Deploy to staging/production

---

## 🐛 Common Issues

### Extension Not Appearing

```bash
# Check if the module is deployed
ls $LIFERAY_HOME/osgi/modules/ | grep admin-dashboard

# Check Liferay logs
tail -f $LIFERAY_HOME/tomcat/logs/catalina.out | grep admin-dashboard
```

### CORS Errors

Add your origin to the CORS configuration in `portal-ext.properties`.

### 403 Forbidden

Ensure the OAuth2 application has the correct scopes and the user has the necessary permissions.

### Blank Page

Check browser console for JavaScript errors. Ensure all assets are properly served.

---

## 📚 Additional Resources

- [Liferay Client Extensions Documentation](https://learn.liferay.com/dxp/latest/en/developing-applications/extending-liferay-with-client-extensions.html)
- [Liferay Headless API Reference](https://learn.liferay.com/dxp/latest/en/headless-api/index.html)
- [Liferay Workspace Guide](https://learn.liferay.com/dxp/latest/en/developing-applications/tooling/liferay-workspace.html)
- [OAuth 2.0 Configuration](https://learn.liferay.com/dxp/latest/en/users-and-organizations/oauth2.html)

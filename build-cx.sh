#!/bin/bash
set -e

echo "🔨 Building Liferay Admin Dashboard Client Extension..."
echo "=================================================="

# Step 1: Install dependencies
echo "📦 Installing dependencies..."
npm install

# Step 2: Build the project
echo "🏗️  Building project..."
npm run build

# Step 3: Verify configuration.html exists
if [ ! -f "dist/configuration.html" ]; then
    echo "⚠️  WARNING: configuration.html not found in dist/"
    echo "   Copying from public/ folder..."
    if [ -f "public/configuration.html" ]; then
        cp public/configuration.html dist/
    else
        echo "❌ ERROR: configuration.html not found in public/ either"
        exit 1
    fi
fi

# Step 4: Create the package directory structure
PACKAGE_DIR="liferay-admin-dashboard-package"
rm -rf "$PACKAGE_DIR"
mkdir -p "$PACKAGE_DIR/static"

# Step 5: Copy client-extension.yaml
echo "📋 Copying client-extension.yaml..."
cp client-extension.yaml "$PACKAGE_DIR/"

# Step 6: Copy build output to static folder
echo "📂 Copying build artifacts..."
cp -r dist/* "$PACKAGE_DIR/static/"

# Step 7: Create the ZIP file
echo "📦 Creating deployment package..."
cd "$PACKAGE_DIR"
zip -r ../liferay-admin-dashboard.zip .
cd ..

# Step 8: Cleanup
rm -rf "$PACKAGE_DIR"

echo ""
echo "=================================================="
echo "✅ Build complete!"
echo ""
echo "📦 Package: liferay-admin-dashboard.zip"
echo ""
echo "📁 Package structure:"
echo "   liferay-admin-dashboard.zip"
echo "   ├── client-extension.yaml"
echo "   └── static/"
echo "       ├── index.html"
echo "       ├── configuration.html  ← Configuration page"
echo "       └── assets/"
echo "           ├── index-*.js"
echo "           └── index-*.css"
echo ""
echo "🚀 Deployment:"
echo "   1. Copy to Liferay deploy folder:"
echo "      cp liferay-admin-dashboard.zip \$LIFERAY_HOME/deploy/"
echo ""
echo "   2. Restart Liferay"
echo ""
echo "⚙️  Configuration:"
echo "   After deployment, access configuration via:"
echo "   - Dashboard: Click 'Configuration' in sidebar"
echo "   - Direct URL: http://your-liferay/o/client-extension/liferay-admin-dashboard/static/configuration.html"
echo ""
echo "📚 Documentation:"
echo "   - CONFIGURATION_GUIDE.md - How to configure the extension"
echo "   - QUICK_FIX.md - Quick troubleshooting"
echo "   - TROUBLESHOOTING.md - Detailed troubleshooting"
echo "=================================================="

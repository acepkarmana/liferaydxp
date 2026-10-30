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

# Step 3: Create the package directory structure
PACKAGE_DIR="liferay-admin-dashboard-package"
rm -rf "$PACKAGE_DIR"
mkdir -p "$PACKAGE_DIR/static"

# Step 4: Copy client-extension.yaml
echo "📋 Copying client-extension.yaml..."
cp client-extension.yaml "$PACKAGE_DIR/"

# Step 5: Copy build output to static folder
echo "📂 Copying build artifacts..."
cp -r dist/* "$PACKAGE_DIR/static/"

# Step 6: Create the ZIP file
echo "📦 Creating deployment package..."
cd "$PACKAGE_DIR"
zip -r ../liferay-admin-dashboard.zip .
cd ..

# Step 7: Cleanup
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
echo "       └── assets/"
echo "           ├── index-*.js"
echo "           └── index-*.css"
echo ""
echo "🚀 Deployment:"
echo "   1. Copy to Liferay deploy folder:"
echo "      cp liferay-admin-dashboard.zip \$LIFERAY_HOME/deploy/"
echo ""
echo "   2. Or upload via Control Panel:"
echo "      Control Panel → Client Extensions → Add → Upload"
echo ""
echo "⚠️  Note: If you encounter Jericho parser errors, ensure:"
echo "   - htmlElementName in client-extension.yaml is a custom element name"
echo "   - CSS/JS URLs match the actual build output paths"
echo "   - The static folder structure is correct"
echo "=================================================="

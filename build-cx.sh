#!/bin/bash

# ============================================================
# Liferay Client Extension Build Script
# Builds and packages the Admin Dashboard for Liferay DXP
# ============================================================

set -e

echo "🔨 Building Liferay Admin Dashboard Client Extension..."
echo "=================================================="

# Step 1: Install dependencies
echo "📦 Installing dependencies..."
npm install

# Step 2: Build the project
echo "🏗️  Building project..."
npm run build

# Step 3: Create the package directory
PACKAGE_DIR="liferay-admin-dashboard-package"
rm -rf "$PACKAGE_DIR"
mkdir -p "$PACKAGE_DIR/static"

# Step 4: Copy client-extension.yaml
echo "📋 Copying client-extension.yaml..."
cp client-extension.yaml "$PACKAGE_DIR/"

# Step 5: Copy build output
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
echo "🚀 Deployment options:"
echo "   1. Copy to Liferay deploy folder:"
echo "      cp liferay-admin-dashboard.zip \$LIFERAY_HOME/deploy/"
echo ""
echo "   2. Upload via Control Panel:"
echo "      Control Panel → Client Extensions → Add → Upload"
echo ""
echo "   3. Import into Liferay Workspace:"
echo "      Copy contents to your workspace module"
echo "=================================================="

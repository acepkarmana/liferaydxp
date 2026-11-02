#!/bin/bash
# Validation script for Liferay Admin Dashboard deployment

echo "🔍 Validating Liferay Admin Dashboard deployment..."
echo "=================================================="

ERRORS=0

# Check 1: Verify client-extension.yaml exists
echo "✓ Checking client-extension.yaml..."
if [ ! -f "client-extension.yaml" ]; then
    echo "  ❌ ERROR: client-extension.yaml not found"
    ERRORS=$((ERRORS + 1))
else
    echo "  ✅ client-extension.yaml found"
    
    # Check for common issues
    if grep -q "htmlElementName: div" client-extension.yaml; then
        echo "  ⚠️  WARNING: htmlElementName is 'div' - this may cause Jericho parser errors"
        echo "     Fix: Change to 'htmlElementName: liferay-admin-dashboard'"
        ERRORS=$((ERRORS + 1))
    fi
    
    if ! grep -q "htmlElementName: liferay-admin-dashboard" client-extension.yaml; then
        echo "  ⚠️  WARNING: htmlElementName should be 'liferay-admin-dashboard'"
    fi
fi

# Check 2: Verify build output
echo ""
echo "✓ Checking build output..."
if [ ! -d "dist" ]; then
    echo "  ❌ ERROR: dist/ folder not found. Run 'npm run build' first"
    ERRORS=$((ERRORS + 1))
else
    echo "  ✅ dist/ folder found"
    
    if [ ! -f "dist/index.html" ]; then
        echo "  ❌ ERROR: dist/index.html not found"
        ERRORS=$((ERRORS + 1))
    else
        echo "  ✅ dist/index.html found"
    fi
    
    if [ ! -d "dist/assets" ]; then
        echo "  ❌ ERROR: dist/assets/ folder not found"
        ERRORS=$((ERRORS + 1))
    else
        echo "  ✅ dist/assets/ folder found"
        
        JS_COUNT=$(find dist/assets -name "*.js" | wc -l)
        CSS_COUNT=$(find dist/assets -name "*.css" | wc -l)
        
        if [ $JS_COUNT -eq 0 ]; then
            echo "  ❌ ERROR: No JavaScript files found in dist/assets/"
            ERRORS=$((ERRORS + 1))
        else
            echo "  ✅ Found $JS_COUNT JavaScript file(s)"
        fi
        
        if [ $CSS_COUNT -eq 0 ]; then
            echo "  ❌ ERROR: No CSS files found in dist/assets/"
            ERRORS=$((ERRORS + 1))
        else
            echo "  ✅ Found $CSS_COUNT CSS file(s)"
        fi
    fi
fi

# Check 3: Verify main.tsx has custom element registration
echo ""
echo "✓ Checking custom element registration..."
if [ -f "src/main.tsx" ]; then
    if grep -q "customElements.define" src/main.tsx; then
        echo "  ✅ Custom element registration found in main.tsx"
        
        if grep -q "liferay-admin-dashboard" src/main.tsx; then
            echo "  ✅ Custom element name matches: liferay-admin-dashboard"
        else
            echo "  ⚠️  WARNING: Custom element name might not match client-extension.yaml"
        fi
    else
        echo "  ❌ ERROR: No custom element registration found in main.tsx"
        echo "     This will cause Jericho parser errors in Liferay"
        ERRORS=$((ERRORS + 1))
    fi
else
    echo "  ❌ ERROR: src/main.tsx not found"
    ERRORS=$((ERRORS + 1))
fi

# Check 4: Verify package structure
echo ""
echo "✓ Checking package structure..."
if [ -f "liferay-admin-dashboard.zip" ]; then
    echo "  ✅ Package ZIP found"
    
    # Extract and check structure
    TEMP_DIR=$(mktemp -d)
    unzip -q liferay-admin-dashboard.zip -d "$TEMP_DIR"
    
    if [ ! -f "$TEMP_DIR/client-extension.yaml" ]; then
        echo "  ❌ ERROR: client-extension.yaml not at root of ZIP"
        ERRORS=$((ERRORS + 1))
    else
        echo "  ✅ client-extension.yaml at root of ZIP"
    fi
    
    if [ ! -d "$TEMP_DIR/static" ]; then
        echo "  ❌ ERROR: static/ folder not found in ZIP"
        ERRORS=$((ERRORS + 1))
    else
        echo "  ✅ static/ folder found in ZIP"
        
        if [ ! -f "$TEMP_DIR/static/index.html" ]; then
            echo "  ❌ ERROR: static/index.html not found"
            ERRORS=$((ERRORS + 1))
        else
            echo "  ✅ static/index.html found"
        fi
    fi
    
    rm -rf "$TEMP_DIR"
else
    echo "  ⚠️  WARNING: Package ZIP not found. Run './build-cx.sh' to create it"
fi

# Summary
echo ""
echo "=================================================="
if [ $ERRORS -eq 0 ]; then
    echo "✅ All checks passed! Ready for deployment."
    echo ""
    echo "Next steps:"
    echo "1. Copy liferay-admin-dashboard.zip to \$LIFERAY_HOME/deploy/"
    echo "2. Or upload via Control Panel → Client Extensions → Add → Upload"
    echo "3. Restart Liferay if the extension doesn't appear"
else
    echo "❌ Found $ERRORS error(s). Please fix them before deploying."
    echo ""
    echo "Run './build-cx.sh' to rebuild the package after fixing issues."
fi
echo "=================================================="

exit $ERRORS

#/bin/sh
# Load project version
PKG_VERSION=$(cat ./package.json | jq -r ".version")
# First, clean the project and prevous releases
echo "Removing old files..."
rm -rf ./dist/ ./node_modules/ ./*.tar.gz
# Compile it again
echo "Compiling code..."
npm ci && npm run build && mage -v
# Make distribution files
echo "Compacting release files..."
cd ./dist/
tar --exclude="gpx*arm*" -cvzf ../albertowd-oraclegrafana-datasource-bundle-${PKG_VERSION}.tar.gz ./
tar --exclude="gpx*arm*" --exclude="gpx*linux*" --exclude="gpx*windows*" -cvzf ../albertowd-oraclegrafana-datasource-${PKG_VERSION}-darwin-amd64.tar.gz ./
tar --exclude="gpx*arm*" --exclude="gpx*darwin*" --exclude="gpx*windows*" -cvzf ../albertowd-oraclegrafana-datasource-${PKG_VERSION}-linux-amd64.tar.gz ./
tar --exclude="gpx*arm*" --exclude="gpx*darwin*" --exclude="gpx*linux*" -cvzf ../albertowd-oraclegrafana-datasource-${PKG_VERSION}-windows-amd64.tar.gz ./
cd ../
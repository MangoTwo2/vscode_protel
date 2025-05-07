# PROTEL2 Syntax Highlighter - Install Script
Write-Host "=== PROTEL2 Syntax Highlighter Installation ===" -ForegroundColor Blue

# Check if Node.js is installed
try {
    $nodeVersion = node -v
    Write-Host "Found Node.js: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "Node.js is not installed. Please install Node.js from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Install dependencies
Write-Host "Installing dependencies..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to install dependencies." -ForegroundColor Red
    exit 1
}
Write-Host "Dependencies installed successfully." -ForegroundColor Green

# Build the extension
Write-Host "Building extension..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to build extension." -ForegroundColor Red
    exit 1
}
Write-Host "Extension built successfully." -ForegroundColor Green

# Get extension file name
$packageJson = Get-Content "./package.json" | ConvertFrom-Json
$extensionFileName = "$($packageJson.name)-$($packageJson.version).vsix"
Write-Host "Extension package created: $extensionFileName" -ForegroundColor Green

# Determine VS Code extensions directory
$extensionsDir = "$env:USERPROFILE\.vscode\extensions"

# Ask user if they want to install
Write-Host "To install the extension, you have the following options:" -ForegroundColor Yellow
Write-Host "1. Install directly in VS Code:" -ForegroundColor Blue
Write-Host "   - Open VS Code"
Write-Host "   - Go to Extensions view (Ctrl+Shift+X)"
Write-Host "   - Click on '...' menu (top-right of Extensions view)"
Write-Host "   - Select 'Install from VSIX...' and choose $extensionFileName"
Write-Host ""
Write-Host "2. Restart VS Code to apply the changes" -ForegroundColor Blue
Write-Host ""
Write-Host "Setup complete!" -ForegroundColor Green 
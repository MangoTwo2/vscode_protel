const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

// Define colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m'
};

console.log(`${colors.blue}=== PROTEL2 Syntax Highlighter Setup ===${colors.reset}\n`);

// Install dependencies
try {
  console.log(`${colors.yellow}Installing dependencies...${colors.reset}`);
  execSync('npm install', { stdio: 'inherit' });
  console.log(`${colors.green}Dependencies installed successfully.${colors.reset}\n`);
} catch (error) {
  console.error(`${colors.red}Failed to install dependencies:${colors.reset}`, error);
  process.exit(1);
}

// Build the extension
try {
  console.log(`${colors.yellow}Building extension...${colors.reset}`);
  execSync('npm run build', { stdio: 'inherit' });
  console.log(`${colors.green}Extension built successfully.${colors.reset}\n`);
} catch (error) {
  console.error(`${colors.red}Failed to build extension:${colors.reset}`, error);
  process.exit(1);
}

// Get the extension file name
const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
const extensionFileName = `${packageJson.name}-${packageJson.version}.vsix`;

// Determine the VS Code extensions directory
let extensionsDir;
switch (process.platform) {
  case 'win32':
    extensionsDir = path.join(os.homedir(), '.vscode', 'extensions');
    break;
  case 'darwin':
    extensionsDir = path.join(os.homedir(), '.vscode', 'extensions');
    break;
  case 'linux':
    extensionsDir = path.join(os.homedir(), '.vscode', 'extensions');
    break;
  default:
    console.warn(`${colors.yellow}Unsupported platform: ${process.platform}. Please install the extension manually.${colors.reset}`);
    process.exit(0);
}

// Ask the user if they want to install
console.log(`${colors.blue}Extension package created: ${extensionFileName}${colors.reset}`);
console.log(`${colors.yellow}To install the extension, you have the following options:${colors.reset}`);
console.log(`${colors.blue}1. Install directly in VS Code:${colors.reset}`);
console.log(`   - Open VS Code`);
console.log(`   - Go to Extensions view (Ctrl+Shift+X)`);
console.log(`   - Click on "..." menu (top-right of Extensions view)`);
console.log(`   - Select "Install from VSIX..." and choose ${extensionFileName}\n`);

console.log(`${colors.blue}2. Restart VS Code to apply the changes${colors.reset}`);
console.log(`\n${colors.green}Setup complete!${colors.reset}`); 
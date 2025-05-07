const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Read the current version from package.json
const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
const currentVersion = packageJson.version;

// Determine which version component to increment (patch, minor, or major)
// Default to patch if not specified
const args = process.argv.slice(2);
const versionType = args[0] || 'patch';

if (!['patch', 'minor', 'major'].includes(versionType)) {
  console.error('Invalid version type. Use "patch", "minor", or "major".');
  process.exit(1);
}

console.log(`Current version: ${currentVersion}`);
console.log(`Incrementing ${versionType} version...`);

try {
  // Run npm version command to increment the version
  execSync(`npm run ${versionType}`, { stdio: 'inherit' });

  // Read the new version from package.json
  const updatedPackageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
  const newVersion = updatedPackageJson.version;
  console.log(`New version: ${newVersion}`);

  // Package the extension
  console.log('Packaging extension...');
  execSync('npm run package', { stdio: 'inherit' });

  console.log(`Successfully built and packaged version ${newVersion}`);
} catch (error) {
  console.error('Error during build process:', error);
  process.exit(1);
} 
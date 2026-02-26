#!/usr/bin/env node

/**
 * Angular 21 + PrimeNG Project Initialization Script
 * 
 * This script automates the setup of a new Angular project with PrimeNG UI framework.
 * Cross-platform compatible (Windows, Linux, macOS).
 * 
 * Usage:
 *   node init-angular-project.js <project-name>
 * 
 * Example:
 *   node init-angular-project.js my-frontend-app
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

function executeCommand(command, description) {
  console.log(`\n📌 ${description}...`);
  try {
    execSync(command, { stdio: 'inherit' });
    console.log(`✅ ${description} completed`);
    return true;
  } catch (error) {
    console.error(`❌ ${description} failed:`, error.message);
    return false;
  }
}

function createDirectory(dirPath, description) {
  try {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      console.log(`✅ Created: ${description}`);
    } else {
      console.log(`ℹ️  Already exists: ${description}`);
    }
    return true;
  } catch (error) {
    console.error(`❌ Failed to create ${description}:`, error.message);
    return false;
  }
}

async function main() {
  console.log('🚀 Angular 21 + PrimeNG Project Initializer\n');

  // Get project name
  let projectName = process.argv[2];
  if (!projectName) {
    projectName = await question('Enter project name: ');
  }

  if (!projectName) {
    console.error('❌ Project name is required');
    process.exit(1);
  }

  console.log(`\nInitializing project: ${projectName}\n`);

  // Step 1: Create Angular project
  if (!executeCommand(
    `ng new ${projectName} --routing --style=scss --skip-git`,
    'Creating Angular project'
  )) {
    process.exit(1);
  }

  const projectPath = path.join(process.cwd(), projectName);
  process.chdir(projectPath);

  // Step 2: Install PrimeNG
  if (!executeCommand(
    'npm install primeng primeicons',
    'Installing PrimeNG and icons'
  )) {
    process.exit(1);
  }

  // Step 3: Create directory structure
  console.log('\n📁 Creating project directory structure...\n');

  const directories = [
    // Main app directories
    { path: 'src/app/components/share', desc: 'Share components' },
    { path: 'src/app/components/block', desc: 'Block components' },
    { path: 'src/app/components/layout', desc: 'Layout components' },
    { path: 'src/app/constant', desc: 'Constants' },
    { path: 'src/app/guard', desc: 'Route guards' },
    { path: 'src/app/interceptors', desc: 'HTTP interceptors' },
    { path: 'src/app/layout/content', desc: 'Content layout' },
    { path: 'src/app/layout/full', desc: 'Full layout' },
    { path: 'src/app/modules', desc: 'Modules' },
    { path: 'src/app/pipes', desc: 'Pipes' },
    { path: 'src/app/routes', desc: 'Routes' },
    { path: 'src/app/services/cache', desc: 'Cache services' },
    { path: 'src/app/utils', desc: 'Utilities' },
    { path: 'src/app/views/content', desc: 'Content views' },
    { path: 'src/app/views/full', desc: 'Full views' },
    
    // API library
    { path: 'src/api-library/lib/api', desc: 'API services' },
    { path: 'src/api-library/lib/model', desc: 'API models' },
    { path: 'src/api-library/lib/util', desc: 'API utilities' },
  ];

  directories.forEach(dir => {
    createDirectory(dir.path, dir.desc);
  });

  // Step 4: Create base configuration files
  console.log('\n📝 Creating base configuration files...\n');

  // Create environment files
  const envDev = `export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080',
  RefreshTokenInterval: 300000, // 5 minutes
};
`;

  const envProd = `export const environment = {
  production: true,
  apiUrl: 'https://api.production.com',
  RefreshTokenInterval: 300000,
};
`;

  fs.writeFileSync('src/environments/environment.ts', envDev);
  fs.writeFileSync('src/environments/environment.prod.ts', envProd);
  console.log('✅ Created environment files');

  // Update angular.json for PrimeNG
  const angularJsonPath = 'angular.json';
  const angularJson = JSON.parse(fs.readFileSync(angularJsonPath, 'utf8'));
  
  const styles = angularJson.projects[projectName].architect.build.options.styles;
  if (!styles.includes('node_modules/primeng/resources/themes/lara-light-blue/theme.css')) {
    styles.unshift(
      'node_modules/primeng/resources/themes/lara-light-blue/theme.css',
      'node_modules/primeng/resources/primeng.min.css',
      'node_modules/primeicons/primeicons.css'
    );
    fs.writeFileSync(angularJsonPath, JSON.stringify(angularJson, null, 2));
    console.log('✅ Updated angular.json with PrimeNG styles');
  }

  // Step 5: Create README
  const readme = `# ${projectName}

Angular 21 + PrimeNG Frontend Application

## Prerequisites

- Node.js 24.x
- Angular CLI 21.x

## Installation

\`\`\`bash
npm install
\`\`\`

## Development Server

\`\`\`bash
npm start
# Navigate to http://localhost:4200/
\`\`\`

## Build

\`\`\`bash
npm run build
# Build artifacts will be stored in the dist/ directory
\`\`\`

## Project Structure

- \`src/app/components/\` - Reusable components (share, block, layout)
- \`src/app/services/\` - Application services
- \`src/app/views/\` - Feature views
- \`src/api-library/\` - API integration layer
- \`src/environments/\` - Environment configurations

## Architecture

This project follows a modular architecture with:
- Component-based design (share, block, layout)
- Centralized API layer with type-safe models
- Reactive forms with validation
- HTTP interceptor for global concerns
- Route guards for access control

## Development Guidelines

1. Extend BaseContainer for all feature components
2. Use TypeScript namespace pattern for API models
3. Follow directory structure for routes
4. Leverage PrimeNG components for UI
5. Implement form validation consistently
`;

  fs.writeFileSync('README.md', readme);
  console.log('✅ Created README.md');

  // Complete
  console.log('\n✨ Project initialization completed!\n');
  console.log('Next steps:');
  console.log(`  1. cd ${projectName}`);
  console.log('  2. npm start');
  console.log('  3. Open http://localhost:4200/\n');
  console.log('📚 Refer to frontend-skill SKILL.md for development guidance');

  rl.close();
}

main().catch(error => {
  console.error('❌ Initialization failed:', error);
  rl.close();
  process.exit(1);
});

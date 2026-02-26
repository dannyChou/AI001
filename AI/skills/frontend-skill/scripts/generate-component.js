#!/usr/bin/env node

/**
 * Component Generator Script
 * 
 * Generates Angular components based on type (share, block, layout, view)
 * with appropriate structure and boilerplate code.
 * Cross-platform compatible (Windows, Linux, macOS).
 * 
 * Usage:
 *   node generate-component.js
 *   (Interactive prompts will guide you)
 * 
 * Or with arguments:
 *   node generate-component.js <type> <name> [--path <path>]
 * 
 * Examples:
 *   node generate-component.js share custom-input
 *   node generate-component.js view user-profile --path src/app/views/content
 */

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

const COMPONENT_TYPES = {
  share: {
    desc: 'Share Component (single, reusable element)',
    defaultPath: 'src/app/components/share',
    extendsBase: false
  },
  block: {
    desc: 'Block Component (composite component)',
    defaultPath: 'src/app/components/block',
    extendsBase: false
  },
  layout: {
    desc: 'Layout Component (page structure)',
    defaultPath: 'src/app/components/layout',
    extendsBase: false
  },
  view: {
    desc: 'View Component (feature page)',
    defaultPath: 'src/app/views/content',
    extendsBase: true
  }
};

function toPascalCase(str) {
  return str
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
}

function toKebabCase(str) {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}

function generateComponentTS(componentName, className, type) {
  const extendsBase = COMPONENT_TYPES[type].extendsBase;
  
  let imports = `import { Component } from '@angular/core';`;
  let classDeclaration = `export class ${className}`;
  
  if (extendsBase) {
    imports = `import { Component } from '@angular/core';
import BaseContainer from '@app/utils/base-container';
import { SharedModule } from '@app/modules/shared-module';
import { FormGroup } from '@angular/forms';`;
    
    classDeclaration = `export class ${className} extends BaseContainer`;
  }

  const inputs = type === 'share' ? `
  // Add @Input() properties as needed
  // Example:
  // @Input({ required: true }) form!: FormGroup;
  // @Input() placeholder: string = '';` : '';

  const formGroup = extendsBase ? `
  form: FormGroup = new FormGroup({});

  ngOnInit() {
    // Initialize component
  }` : '';

  const constructor = extendsBase ? `
  constructor() {
    super();
  }` : '';

  return `${imports}

@Component({
  selector: 'app-${componentName}',
  ${extendsBase ? `imports: [SharedModule],` : ''}
  templateUrl: './${componentName}.component.html',
  styleUrl: './${componentName}.component.scss',
})
${classDeclaration} {${inputs}${formGroup}${constructor}
}
`;
}

function generateComponentHTML(componentName, type) {
  if (type === 'share') {
    return `<!-- ${componentName} Component -->
<div class="${componentName}-container">
  <!-- Add your template here -->
</div>
`;
  }

  if (type === 'view') {
    return `<!-- ${componentName} View -->
<div class="container">
  <form [formGroup]="form" class="flow-container">
    <!-- Add your form fields here -->
    
    <div class="flow-btn-center mt-4">
      <app-button default="fill" label="Submit" (onClick)="submit()" />
      <app-button default="outline" label="Back" (onClick)="back()" />
    </div>
  </form>
</div>
`;
  }

  return `<!-- ${componentName} Component -->
<div class="${componentName}-wrapper">
  <!-- Add your template here -->
</div>
`;
}

function generateComponentSCSS(componentName) {
  return `.${componentName}-container,
.${componentName}-wrapper {
  // Add your styles here
}
`;
}

function generateComponentSpec(componentName, className) {
  return `import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ${className} } from './${componentName}.component';

describe('${className}', () => {
  let component: ${className};
  let fixture: ComponentFixture<${className}>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [${className}]
    })
    .compileComponents();

    fixture = TestBed.createComponent(${className});
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
`;
}

async function main() {
  console.log('🎨 Angular Component Generator\n');

  // Parse arguments
  let type = process.argv[2];
  let name = process.argv[3];
  let customPath = null;

  // Check for --path flag
  const pathIndex = process.argv.indexOf('--path');
  if (pathIndex !== -1 && process.argv[pathIndex + 1]) {
    customPath = process.argv[pathIndex + 1];
  }

  // Interactive mode if arguments not provided
  if (!type) {
    console.log('Available component types:');
    Object.entries(COMPONENT_TYPES).forEach(([key, value]) => {
      console.log(`  ${key.padEnd(10)} - ${value.desc}`);
    });
    
    type = await question('\nEnter component type: ');
  }

  type = type.toLowerCase();
  if (!COMPONENT_TYPES[type]) {
    console.error(`❌ Invalid component type: ${type}`);
    console.log('Valid types: share, block, layout, view');
    rl.close();
    process.exit(1);
  }

  if (!name) {
    name = await question('Enter component name (kebab-case): ');
  }

  if (!name) {
    console.error('❌ Component name is required');
    rl.close();
    process.exit(1);
  }

  // Normalize name to kebab-case
  const componentName = toKebabCase(name);
  const className = toPascalCase(componentName) + 'Component';

  // Determine path
  const basePath = customPath || COMPONENT_TYPES[type].defaultPath;
  const componentPath = path.join(process.cwd(), basePath, componentName);

  console.log(`\n📦 Generating ${type} component: ${componentName}`);
  console.log(`📁 Location: ${componentPath}\n`);

  // Create component directory
  if (!fs.existsSync(componentPath)) {
    fs.mkdirSync(componentPath, { recursive: true });
    console.log(`✅ Created directory: ${componentPath}`);
  } else {
    const overwrite = await question('⚠️  Directory exists. Overwrite? (y/N): ');
    if (overwrite.toLowerCase() !== 'y') {
      console.log('Cancelled');
      rl.close();
      process.exit(0);
    }
  }

  // Generate files
  const files = [
    {
      name: `${componentName}.component.ts`,
      content: generateComponentTS(componentName, className, type),
      desc: 'TypeScript component'
    },
    {
      name: `${componentName}.component.html`,
      content: generateComponentHTML(componentName, type),
      desc: 'HTML template'
    },
    {
      name: `${componentName}.component.scss`,
      content: generateComponentSCSS(componentName),
      desc: 'SCSS styles'
    },
    {
      name: `${componentName}.component.spec.ts`,
      content: generateComponentSpec(componentName, className),
      desc: 'Unit test'
    }
  ];

  files.forEach(file => {
    const filePath = path.join(componentPath, file.name);
    fs.writeFileSync(filePath, file.content);
    console.log(`✅ Created: ${file.desc} (${file.name})`);
  });

  // Generate routing file for view components
  if (type === 'view') {
    const routesContent = `import { Routes } from '@angular/router';
import { ${className} } from './${componentName}.component';

export const routes: Routes = [
  {
    path: '',
    component: ${className}
  }
];
`;
    const routesPath = path.join(componentPath, `${componentName}.routes.ts`);
    fs.writeFileSync(routesPath, routesContent);
    console.log(`✅ Created: Routes configuration (${componentName}.routes.ts)`);
  }

  console.log('\n✨ Component generated successfully!\n');
  console.log('Next steps:');
  console.log('  1. Import the component where needed');
  if (type === 'view') {
    console.log('  2. Add route to your routing module');
    console.log(`     path: '${componentName}', loadChildren: () => import('./${componentName}/${componentName}.routes').then(m => m.routes)`);
  }
  if (COMPONENT_TYPES[type].extendsBase) {
    console.log('  3. Implement form initialization and API calls');
  }
  console.log('  4. Customize the template and logic as needed\n');

  rl.close();
}

main().catch(error => {
  console.error('❌ Generation failed:', error);
  rl.close();
  process.exit(1);
});

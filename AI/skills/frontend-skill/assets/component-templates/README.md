# Component Templates

This directory contains template files extracted from production Angular projects, demonstrating best practices and common patterns.

## Available Templates

### base-container.ts
Base class that all feature components should extend.

**Purpose**: Provides common functionality and service injections

**Includes**:
- Router, FormBuilder, Services injections
- Form validation helpers
- Utility methods (JSON formatting, etc.)
- Route data access

**Usage**:
```typescript
export class MyComponent extends BaseContainer {
  constructor() {
    super();
  }
}
```

### share-input.component.ts
Reusable text input component with validation support.

**Purpose**: Single, atomic input field for reactive forms

**Features**:
- Form binding (FormGroup + FormControl)
- Validation error display
- Input restrictions (numeric, alphanumeric, etc.)
- PrimeNG styling

**Usage**:
```html
<app-share-input 
  [form]="form" 
  controlName="username" 
  placeholder="Enter username"
  maxlength="50" />
```

## How to Use These Templates

1. **Copy** the template file to your project
2. **Customize** according to your needs
3. **Update** imports and references
4. **Test** thoroughly

## Template Files

Due to the nature of skill packaging, full template files are referenced from the sample project in `templates/frontend/sample/`.

**Key files to reference**:
- `app/utils/base-container.ts` - Base container pattern
- `app/components/share/input/input.component.ts` - Share component example
- `app/services/auth.service.ts` - Authentication service
- `app/interceptors/token-interceptor.ts` - HTTP interceptor

## Creating Your Own Templates

When you identify a frequently used pattern:

1. Extract the core logic
2. Remove project-specific details
3. Add configuration options (@Input properties)
4. Document usage clearly
5. Test in isolation

## Best Practices

- **Keep templates generic** - Avoid hard-coded values
- **Document thoroughly** - Explain usage and customization
- **Test independently** - Ensure templates work standalone
- **Version appropriately** - Note Angular/PrimeNG versions

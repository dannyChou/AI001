---
name: frontend-skill
description: Comprehensive Angular 21 + PrimeNG frontend development guidance covering project architecture, component development, API integration, and feature implementation with detailed AI collaboration best practices. Use when: (1) Initializing a new Angular project, (2) Developing reusable components (share/block/layout), (3) Implementing CRUD features with form handling and API integration, (4) Setting up project infrastructure (interceptors, services, routing), (5) Need AI assistance prompts for frontend development tasks.
---

# Frontend Development (Angular 21 + PrimeNG)

## Overview

This skill provides comprehensive guidance for building modern frontend applications using Angular 21 and PrimeNG UI framework, based on proven production architecture patterns. It covers the complete development lifecycle from project initialization to deployment, with special focus on AI-assisted development workflows.

## Prerequisites

- Node.js 24.x
- Angular CLI 21.x
- TypeScript knowledge
- PrimeNG UI Framework
- Basic understanding of reactive forms and RxJS

## Workflow Decision Tree

Choose your entry point based on current task:

```
User Need → Workflow Path
├─ New Project? → Phase 1: Project Initialization
├─ Create Component? → Phase 2: Component Development
├─ API Integration? → Phase 3: API Design & Integration
├─ Feature Development? → Phase 4: Complete Feature Workflow
└─ Testing? → Phase 5: Testing & Optimization
```

## Phase 1: Project Architecture & Initialization

### 1.1 Project Initialization

**Using Angular CLI (Recommended)**:
```bash
ng new <project-name> --routing --style=scss
cd <project-name>
npm install primeng primeicons
```

**Project Structure** (See `references/architecture-guide.md` for details):
```
src/
├── main-project/
│   ├── app/
│   │   ├── components/      # Reusable components
│   │   │   ├── share/       # Single components
│   │   │   ├── block/       # Composite components
│   │   │   └── layout/      # Layout components
│   │   ├── constant/        # Static constants & enums
│   │   ├── guard/           # Route guards
│   │   ├── interceptors/    # HTTP interceptors
│   │   ├── layout/          # Main layouts
│   │   │   ├── content/     # Authenticated layout
│   │   │   └── full/        # Public layout
│   │   ├── modules/         # Module management
│   │   ├── pipes/           # Custom pipes
│   │   ├── routes/          # Routing configuration
│   │   ├── services/        # Services
│   │   ├── utils/           # Utility functions
│   │   └── views/           # Feature views
│   │       ├── content/     # Authenticated views
│   │       └── full/        # Public views
│   ├── assets/              # Static assets
│   └── environments/        # Environment configs
└── api-library/
    └── lib/
        ├── api/             # API service implementations
        ├── model/           # API request/response models
        └── util/            # API utilities
```

### 1.2 Routing Strategy

**Route Naming Convention**: Align route paths with directory structure.

Example: `views/system/setting/ad-manage/query` → route: `system/setting/ad-manage/query`

**Two Route Types**:

1. **Simple Routes** (single component):
```typescript
{
  path: 'system/query/batch-job-query',
  data: { txid: 'SQ10001' },
  component: BatchJobQueryComponent,
}
```

2. **Workflow Routes** (multi-step process with lazy loading):
```typescript
{
  path: 'system/setting/ad-manage',
  data: { txid: 'SA10006' },
  loadChildren: () => import('./views/.../ad-manage-routes').then(m => m.routes)
}
```

See `references/architecture-guide.md` Section 2 for complete routing patterns.

### 1.3 Core Infrastructure Setup

**Essential Services to Implement**:

1. **Authentication Service** (`auth.service.ts`)
   - Token management
   - Login/logout/refresh token
   - User state management

2. **HTTP Interceptor** (`token-interceptor.ts`)
   - Add authentication headers
   - Handle request/response
   - Global error handling
   - Loading mask management

3. **Base Container** (`utils/base-container.ts`)
   - Common injections (Router, FormBuilder, Services)
   - Shared utility methods
   - Form validation helpers
   - All feature components extend this

4. **State Management Services**:
   - Form state persistence
   - Table state (pagination, sorting)
   - Memory service for cross-component data

See example implementations in `assets/component-templates/`.

## Phase 2: Component Development

### 2.1 Component Analysis & Design

**AI-Assisted Component Breakdown**:

When you have a UI design (e.g., from Figma), use AI to analyze and decompose:

**Prompt Template**:
```
Analyze this UI design and identify:
1. Single components (buttons, inputs, dropdowns) - potential "share" components
2. Composite components (forms, cards, dialogs) - potential "block" components
3. Data flow between components
4. Which components should have form binding
5. Reusability across different views

Design: [paste screenshot or describe UI]
```

See `references/ai-prompts-library.md` Section 1 for detailed component analysis prompts.

### 2.2 Component Implementation

**Component Types**:

1. **Share Components** (`components/share/`)
   - Single, highly reusable elements
   - Example: `input.component.ts`, `button.component.ts`, `dropdown.component.ts`
   - Always use `@Input()` for configuration
   - Use `@Output()` for events
   - Support form binding with `FormControl`

2. **Block Components** (`components/block/`)
   - Composite components combining multiple share components
   - Example: `search-form.component.ts`, `data-table.component.ts`
   - Encapsulate specific business logic

3. **Layout Components** (`components/layout/`)
   - Page structure components
   - Example: `header.component.ts`, `sidebar.component.ts`

**Generate Component with AI**:

Use prompts from `references/ai-prompts-library.md` Section 2. Example:

```
Create a PrimeNG-based share component with these specifications:

Component Type: Input field with validation
Requirements:
- @Input() form: FormGroup (required)
- @Input() controlName: string (required)
- @Input() placeholder: string
- @Input() maxlength: string
- @Input() restrict: 'num' | 'enNum' | 'none' (input restriction)
- Display validation errors below input
- Support reactive forms
- Use PrimeNG's p-input styling

Reference: templates/frontend/sample/app/components/share/input/input.component.ts
```

**Key Principle**: Before creating a new component, check if an existing component can be reused or extended.

## Phase 3: API Integration

### 3.1 API Library Architecture

**Model Definition** (using TypeScript namespace pattern):

```typescript
// api-library/lib/model/AdminAPI/Auth-api-model.ts
export namespace Login {
  export interface Req {
    UID: string;              // User ID
    UPP: string;              // Password
    CheckOutReLogin: string;  // Re-login flag
  }

  export interface Res {
    AccessToken: string;
    RefreshToken: string;
    AccessTokenExpiredIn: string;
    RefreshTokenExpiredIn: string;
    UUName: string;
    UserGroup: string;
  }
}
```

**Benefits of Namespace Pattern**:
- Clear grouping of related types
- No naming conflicts
- Easy to locate models
- Type-safe request/response

### 3.2 API Service Implementation

```typescript
// api-library/lib/api/AdminAPI/EQ10001-api.ts
export default class EQ10001API {
  httpClient = inject(HttpClient);

  /**
   * @description Employee Login Query - Index
   */
  index(): Promise<ResponseBody<EQ10001Index.Res>> {
    return promisePack(this.httpClient.post<ResponseModel<EQ10001Index.Res>>(
      `${environment.apiUrl}/AdminAPI/api/EQ10001/Index`, {}
    ));
  }
  
  /**
   * @description Employee Login Query - Query
   */
  query(input: EQ10001Query.Req): Promise<ResponseBody<EQ10001Query.Res>> {
    return promisePack(this.httpClient.post<ResponseModel<EQ10001Query.Res>>(
      `${environment.apiUrl}/AdminAPI/api/EQ10001/Query`, input
    ));
  }
}
```

**Key Points**:
- Use `inject()` for dependency injection (Angular 14+)
- Return `Promise` (converted from Observable)
- Consistent naming: endpoint method matches API action
- Use environment variables for base URLs

See `references/api-integration.md` for complete patterns and best practices.

## Phase 4: Feature Development

### 4.1 Feature Component Structure

Typical feature follows this workflow pattern:
```
query → input → confirm → review → result
```

Each step is a separate component. Example: `ad-manage/query/query.component.ts`

### 4.2 Form Implementation

**Extend BaseContainer**:
```typescript
export class QueryComponent extends BaseContainer {
  form: FormGroup = new FormGroup({});

  ngOnInit() {
    this.setForm();
    this.loadIndexAPI();
  }

  setForm() {
    this.form = this.fb.group({
      DateST: [new Date(), FieldValid.required('Please enter start date')],
      DateED: [new Date(), FieldValid.required('Please enter end date')],
    });
  }

  async submit() {
    this.form.markAllAsTouched();
    if (!this.form.valid) return;

    try {
      const { Data } = await this.adminAPI.SA10006.query(this.form.value);
      // Handle response
    } catch (e) {
      // Error already handled by interceptor
    }
  }
}
```

**Key Patterns**:
- Extend `BaseContainer` for common functionality
- Initialize form in `setForm()`
- Use `markAllAsTouched()` before validation
- API errors handled by interceptor (no need for catch logic usually)

### 4.3 Template Implementation with PrimeNG

**Use PrimeNG Components** (see `references/primeng-components.md`):

```html
<form [formGroup]="form">
  <app-multi-field label="Ad Title" [required]="true" [form]="form" controlName="Title">
    <app-share-input 
      [form]="form" 
      controlName="Title" 
      maxlength="50" 
      placeholder="Enter ad title" />
  </app-multi-field>

  <app-multi-field label="Display" [required]="true" [form]="form" controlName="Show">
    <app-select 
      [form]="form" 
      controlName="Show" 
      [options]="showOptions" 
      placeholder="Select display option" />
  </app-multi-field>

  <div class="flow-btn-center mt-4">
    <app-button default="fill" label="Submit" (onClick)="submit()" />
    <app-button default="outline" label="Back" (onClick)="back()" />
  </div>
</form>
```

**AI-Assisted UI Development**:

Provide AI with:
1. Available components list
2. Form fields and validation rules
3. Layout requirements
4. PrimeNG components to use

See `references/ai-prompts-library.md` Section 3 for UI generation prompts.

### 4.4 Table Implementation

```typescript
// Component
tableCols = [
  { field: 'AdIdDesc', header: 'Ad ID' },
  { field: 'ModifyTime', header: 'Modified Time' },
  { field: 'Title', header: 'Ad Title' },
];

tableData: any[] = [];
tableState: TableState = { ...this.tableSave.getInitState() };

// Template
<app-table 
  [columns]="tableCols" 
  [tableData]="tableData" 
  [paginator]="true"
  [first]="tableState.page"
  [rows]="tableState.pageSize"
  (onPaginate)="onPaginate($event)" />
```

### 4.5 Navigation & State Management

**Pass Data Between Routes**:
```typescript
// From query to input
this.router.navigate(['/path/to/input'], { 
  state: { 
    action: Status.Edit, 
    data: rowData,
    _QueryForm: this.form.value  // Preserve query form
  } 
});

// In input component
constructor() {
  super();
  const navigation = this.router.getCurrentNavigation();
  this.previousData = navigation?.extras?.state;
}
```

## Phase 5: Testing & Optimization

### 5.1 Testing Strategy

**Functional Testing**:
1. Positive flow testing (happy path)
2. Negative flow testing (error cases)
3. Edge cases (boundary values, empty inputs)
4. Form validation testing
5. API error handling

**Use Test Cases**:
- Define test scenarios before development
- Test each workflow step independently
- Verify data persistence across route changes
- Check loading states and error messages

### 5.2 Performance Optimization

- Use OnPush change detection for large lists
- Lazy load routes for better initial load
- Optimize images and assets
- Use trackBy for *ngFor
- Minimize bundle size with tree shaking

## AI Collaboration Best Practices

### When to Use AI Assistance

1. **Component Generation**: Provide detailed specs, reference existing components
2. **Form Implementation**: Share form structure and validation rules
3. **UI Layout**: Describe layout with available components
4. **Refactoring**: Ask for specific improvements with context
5. **Debugging**: Provide error messages and relevant code

### How to Get Best Results

**Do**:
- ✅ Provide context (existing components, project structure)
- ✅ Be specific about requirements
- ✅ Reference PrimeNG components to use
- ✅ Mention form binding needs
- ✅ Share validation rules

**Don't**:
- ❌ Ask for complete features without breaking down
- ❌ Expect AI to know your custom components
- ❌ Forget to mention styling framework (PrimeNG)
- ❌ Skip providing form control names

**Prompt Structure**:
```
Task: [What you want to create]
Framework: Angular 21 + PrimeNG
Requirements:
- [Specific requirement 1]
- [Specific requirement 2]
Context:
- Available components: [list]
- Form binding: [yes/no, which fields]
- Validation: [rules]
Reference: [path to similar existing component]
```

See complete prompt library in `references/ai-prompts-library.md`.

## Resources

### scripts/
- `init-angular-project.js`: Initialize Angular 21 project with PrimeNG (Node.js, cross-platform)
- `generate-component.js`: Generate component scaffolding based on type (Node.js, cross-platform)
- `verify-structure.py`: Verify project structure compliance (Python 3, cross-platform)

Execute: `node scripts/<script-name>.js` or `python scripts/<script-name>.py`

### references/
- `architecture-guide.md`: Detailed project architecture and patterns
- `primeng-components.md`: PrimeNG component usage reference
- `api-integration.md`: API integration patterns and best practices
- `ai-prompts-library.md`: AI prompt templates for all development phases

### assets/
- `project-template/`: Angular project boilerplate structure
- `component-templates/`: Common component templates (base-container, share components, etc.)

## Quick Start Checklist

For a new Angular 21 + PrimeNG project:

- [ ] Initialize project: `ng new <name> --routing --style=scss`
- [ ] Install PrimeNG: `npm install primeng primeicons`
- [ ] Set up project structure (see Phase 1.1)
- [ ] Create base container utility
- [ ] Implement auth service
- [ ] Set up HTTP interceptor
- [ ] Configure routing
- [ ] Create share components (input, button, select)
- [ ] Define API models using namespace pattern
- [ ] Implement first feature following Phase 4 workflow

## Common Patterns Summary

1. **All feature components extend BaseContainer**
2. **API models use TypeScript namespace pattern**
3. **Routes align with directory structure**
4. **Components categorized by reusability** (share > block > layout)
5. **Form validation uses custom validators**
6. **State persisted via dedicated services**
7. **Interceptor handles global concerns** (auth, errors, loading)
8. **PrimeNG for all UI components**

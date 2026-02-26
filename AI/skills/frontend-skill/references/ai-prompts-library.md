# AI Prompts Library

Comprehensive collection of AI prompt templates for Angular 21 + PrimeNG development, organized by development phase.

## Table of Contents

1. [Component Analysis & Design](#1-component-analysis--design)
2. [Component Implementation](#2-component-implementation)
3. [UI/UX Development](#3-uiux-development)
4. [API Integration](#4-api-integration)
5. [Feature Development](#5-feature-development)
6. [Debugging & Optimization](#6-debugging--optimization)
7. [Code Review & Refactoring](#7-code-review--refactoring)

## General Prompt Structure

**Effective Prompt Template**:
```
Task: [What you want to create/accomplish]
Framework: Angular 21 + PrimeNG + TypeScript
Context:
- [Current project structure/existing code]
- [Available components/services]
- [Relevant constraints]
Requirements:
- [Specific requirement 1]
- [Specific requirement 2]
- [Specific requirement 3]
Reference: [Path to similar existing code or documentation]
```

**Key Principles**:
- ✅ Be specific about technical stack (Angular 21, PrimeNG)
- ✅ Provide context (existing components, project structure)
- ✅ Reference similar existing code when available
- ✅ Specify form binding needs explicitly
- ✅ Mention validation rules
- ❌ Don't ask for complete features without breaking down
- ❌ Don't assume AI knows your custom components
- ❌ Don't forget to mention styling framework

## 1. Component Analysis & Design

### 1.1 UI Design Breakdown

**Use Case**: Analyze a UI design (Figma, screenshot, etc.) and identify component structure.

**Prompt Template**:
```
Analyze this UI design and break it down into Angular components using our project architecture.

Framework: Angular 21 + PrimeNG
Design: [paste screenshot or describe detailed UI layout]

Please identify:
1. Share Components (single, atomic, reusable elements like inputs, buttons)
   - Which ones already exist in our project?
   - Which ones need to be created?
2. Block Components (composite components combining multiple elements)
3. Layout structure
4. Data flow between components
5. Which components should have form binding
6. Parent-child component relationships

Existing share components:
- app-share-input (text input with validation)
- app-button (styled button)
- app-select (dropdown)
- app-datepicker (date picker)
- app-checkbox
- app-radio

Project structure:
- components/share/ - atomic components
- components/block/ - composite components
- views/ - feature pages

Output format:
Component Tree:
├─ ViewComponent (views/feature-name/)
│  ├─ SearchFormBlock (block)
│  │  ├─ app-share-input
│  │  ├─ app-datepicker
│  │  └─ app-button
│  └─ DataTableBlock (block)
│     └─ [table columns and actions]
```

### 1.2 Component Reusability Analysis

**Prompt Template**:
```
I need to build [describe feature/UI].

Existing share components in our project:
[List your actual components with brief descriptions]

Existing block components:
[List your actual block components]

Questions:
1. Can I reuse existing components for this feature?
2. Which existing components should I use and how?
3. Do I need to create new components? If yes, what should they be?
4. Should any new component be designed for reusability (share) or feature-specific (block)?

Please provide:
- Component selection rationale
- Recommended component hierarchy
- Configuration props for each component
```

## 2. Component Implementation

### 2.1 Share Component (Single Reusable Element)

**Prompt Template**:
```
Create an Angular 21 share component with PrimeNG styling.

Component Purpose: [e.g., Reusable text input with validation support]

Requirements:
- Component Type: Share (single, atomic, highly reusable)
- Framework: Angular 21 (standalone component)
- UI Library: PrimeNG
- Form Support: Reactive Forms (FormGroup + FormControl)
- Validation: Display errors when invalid and touched

Input Properties (@Input):
- form: FormGroup (required)
- controlName: string (required)
- placeholder: string (optional, default: '')
- maxlength: string (optional)
- type: string (optional, default: 'text')
- showError: boolean (optional, default: true)

Output Events (@Output):
[List if any]

Features:
- Input validation display
- Error messages based on validation rules
- PrimeNG styling (pInputText directive)
- Responsive width (w-full class)

Reference: Our existing share component pattern
```typescript
// Example from our project
@Component({
  selector: 'app-share-input',
  imports: [SharedModule],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
})
export class InputComponent {
  @Input({ required: true }) form!: FormGroup;
  @Input({ required: true }) controlName!: string;
  @Input() placeholder: string = '';
  @Input() maxlength: string = '';
  @Input() class: string = 'w-full';
  // ... validation logic
}
```

Please generate:
1. Complete TypeScript component file
2. HTML template
3. SCSS file (minimal, component-specific only)
4. Usage example
```

### 2.2 Block Component (Composite)

**Prompt Template**:
```
Create an Angular 21 block component (composite component) with PrimeNG.

Component Purpose: [e.g., Search form combining date range picker, dropdown, and search button]

Requirements:
- Component Type: Block (composite, combining multiple share components)
- Framework: Angular 21 (standalone)
- UI Library: PrimeNG
- Form Support: Reactive Forms
- Components to use:
  - app-share-input
  - app-datepicker
  - app-select
  - app-button

Input Properties:
- form: FormGroup (required)
- options: Option[] (for dropdown, optional)

Output Events:
- onSearch: EventEmitter<SearchCriteria>

Form Structure:
```typescript
form = this.fb.group({
  keyword: [''],
  dateRange: [[new Date(), new Date()]],
  status: ['']
});
```

Layout:
- Use PrimeNG Flex utilities
- Responsive grid (3 columns on desktop, stack on mobile)
- Search button aligned right

Please generate complete component code.
```

### 2.3 View Component (Feature Page)

**Prompt Template**:
```
Create an Angular 21 view component for [feature name].

Framework: Angular 21 + PrimeNG
Component Type: View (extends BaseContainer)
Workflow Step: [e.g., Query, Input, Confirm]

Requirements:
1. Extend BaseContainer for common functionality
2. Implement reactive form with validation
3. Call API using injected service
4. Handle loading states
5. Navigate to next step on success

Form Fields:
[List fields with types and validation]

API Integration:
- Service: this.adminAPI.[ServiceName]
- Endpoint: [methodName]
- Request Model: [Namespace.Req]
- Response Model: [Namespace.Res]

BaseContainer provides:
- router: Router
- fb: FormBuilder
- adminAPI: AdminAPIApiService
- formSave: FormStateService
- formDataVerify: form validation helper

Component Structure:
```typescript
export class QueryComponent extends BaseContainer {
  form: FormGroup = new FormGroup({});
  
  constructor() {
    super();  // Required
  }

  ngOnInit() {
    this.setForm();
    this.loadIndexAPI();
  }

  setForm() {
    // Initialize form
  }

  async submit() {
    // Validate and call API
  }
}
```

Please generate:
1. Complete TypeScript component
2. HTML template with PrimeNG components
3. Form initialization logic
4. API call implementation
5. Navigation logic
```

## 3. UI/UX Development

### 3.1 Form Layout with PrimeNG

**Prompt Template**:
```
Create a form layout using PrimeNG components for Angular 21.

Form Purpose: [e.g., Ad Management Input Form]

Framework: Angular 21 + PrimeNG
Form Type: Reactive Forms

Available PrimeNG Components:
- p-input (text input)
- p-dropdown (select)
- p-calendar (date/datetime picker)
- p-checkbox
- p-fileUpload
- p-button

Available Custom Components:
- app-share-input
- app-select
- app-datepicker
- app-button
- app-multi-field (field wrapper with label)

Form Fields:
[Specify each field with:]
- Field name
- Type (text/select/date/file/etc.)
- Validation rules
- Placeholder/label
- Required/Optional

Layout Requirements:
- Use PrimeNG Flex utilities
- 2-column layout on desktop, single column on mobile
- Field labels on left, inputs on right
- Action buttons centered at bottom
- Consistent spacing (gap-3)

Form Binding:
- Use [formGroup] directive
- Bind each field with formControlName
- Display validation errors below each field
- Disable submit button when form invalid

Please generate:
1. Form TypeScript initialization code
2. Complete HTML template
3. Validation helper integration
```

### 3.2 Data Table with Actions

**Prompt Template**:
```
Create a PrimeNG data table for [entity name] with Angular 21.

Framework: Angular 21 + PrimeNG p-table

Table Features:
- Pagination (10 rows per page)
- Sorting on specific columns
- Row selection (optional)
- Action buttons per row
- Responsive design

Columns:
[Specify columns:]
| Field Name | Header | Sortable | Format |
|------------|--------|----------|--------|
| code | Code | Yes | Plain text |
| createdDate | Created Date | Yes | yyyy/MM/dd |
| status | Status | No | Badge (color-coded) |

Actions Per Row:
- Edit button (navigate to input page with data)
- Delete button (show confirmation dialog)
- [Other actions]

Data Binding:
- tableData: any[] = []
- tableState: TableState (pagination state)

Usage of Custom app-table component: [if applicable]
- [Describe custom table component interface]

Please generate:
1. TypeScript component code (table state management)
2. HTML template with p-table
3. Action button handlers
4. Pagination event handler
```

### 3.3 Dialog/Modal Implementation

**Prompt Template**:
```
Create a PrimeNG dialog for [purpose] in Angular 21.

Framework: Angular 21 + PrimeNG p-dialog

Dialog Purpose: [e.g., Display detail information, Confirm action]

Dialog Configuration:
- Modal: Yes/No
- Closable: Yes/No
- Width: [e.g., 50vw, 800px]
- Header: [Dialog title]

Content:
[Describe content structure]
- Read-only data display
- Form for input
- Table
- etc.

Actions:
- [e.g., Confirm button]
- [e.g., Cancel button]

Trigger:
- [e.g., Click row action button]
- [e.g., Click toolbar button]

State Management:
- showDialog: boolean = false
- dialogData: any

Please generate:
1. TypeScript component code (dialog state)
2. Dialog trigger logic
3. HTML template with p-dialog
4. Dialog content structure
5. Action handlers
```

## 4. API Integration

### 4.1 Model Definition

**Prompt Template**:
```
Create TypeScript API models using namespace pattern for [API endpoint].

Endpoint: [e.g., /AdminAPI/api/SA10006/Query]
Purpose: [Brief description]

Framework: TypeScript with namespace pattern

Request Parameters:
[List parameters with types and descriptions]

Response Structure:
[Describe response structure]

Example:
Request: { DateST: "2024/01/01", DateED: "2024/12/31" }
Response: {
  Status: { Code: "E0000", CodeMsg: "Success" },
  Data: {
    QueryDate: "2024/01/15",
    Results: [...]
  }
}

Pattern to follow:
```typescript
export namespace OperationName {
  export interface Req {
    field1: string;  // Description
    field2: number;  // Description
  }

  export interface Res {
    field1: string;
    field2: DataItem[];
  }

  export interface DataItem {
    // Nested interface
  }
}
```

Please generate:
1. Complete model definition file
2. All interfaces with proper comments
3. Nested interfaces if needed
```

### 4.2 API Service Implementation

**Prompt Template**:
```
Create an Angular API service for [endpoint group] using our project pattern.

Framework: Angular 21
Pattern: Class with inject() dependency injection
Return Type: Promise (not Observable)

Endpoint Group: [e.g., SA10006 - Ad Management]
Base URL: ${environment.apiUrl}/AdminAPI/api/SA10006

Endpoints to implement:
1. Index - GET initial data
   - URL: /Index
   - Request: {} (empty)
   - Response: [Model namespace]

2. Query - POST search
   - URL: /Query
   - Request: [Model namespace.Req]
   - Response: [Model namespace.Res]

3. [Other endpoints...]

Dependencies:
- HttpClient (inject)
- promisePack utility (converts Observable to Promise)
- Environment config
- Model imports

Template to follow:
```typescript
export default class MyAPI {
  httpClient = inject(HttpClient);

  /**
   * @description Endpoint description
   * @param input Request parameters
   * @returns Promise with typed response
   */
  methodName(input: Namespace.Req): Promise<ResponseBody<Namespace.Res>> {
    return promisePack(
      this.httpClient.post<ResponseModel<Namespace.Res>>(
        `${environment.apiUrl}/path/to/endpoint`,
        input
      )
    );
  }
}
```

Please generate:
1. Complete API service class
2. All endpoint methods with JSDoc
3. Proper type imports
```

### 4.3 Component API Integration

**Prompt Template**:
```
Integrate API calls into Angular component for [feature].

Framework: Angular 21
Component: [Component name extending BaseContainer]
API Service: this.adminAPI.[ServiceName]

API Calls Needed:
1. On Init: Load dropdown options
   - Endpoint: [service].[method]
   - Response: [What to do with data]

2. On Submit: Submit query/form
   - Endpoint: [service].[method]
   - Request: [Form data mapping]
   - Response: [Update UI with results]

3. [Other API calls...]

Error Handling:
- Network errors handled by interceptor
- Business logic errors handled in component
- Display loading mask automatically

Pattern:
```typescript
async ngOnInit() {
  await this.loadIndexAPI();
}

async loadIndexAPI() {
  try {
    const { Data } = await this.adminAPI.MyAPI.index();
    this.options = Data.Options;
  } catch (e) {
    // Error already handled by interceptor
  }
}

async submit() {
  this.form.markAllAsTouched();
  if (!this.form.valid) return;

  try {
    const { Data } = await this.adminAPI.MyAPI.query(this.form.value);
    this.tableData = Data.Results;
  } catch (e) {
    // Error handling
  }
}
```

Please generate:
1. Complete API integration code
2. Form data transformation if needed
3. Response data handling
4. Loading states management
```

## 5. Feature Development

### 5.1 Complete Feature Workflow

**Prompt Template**:
```
Create a complete feature with multi-step workflow for [feature name].

Framework: Angular 21 + PrimeNG
Architecture: Query → Input → Confirm → Review → Result

Feature: [e.g., Ad Management]

Steps:
1. Query (List/Search)
   - Search form with date range and filters
   - Data table with results
   - Actions: Add New, Edit, View Details

2. Input (Create/Edit)
   - Form with all fields
   - Validation rules
   - File upload (if needed)
   - Actions: Confirm, Back

3. Confirm (Review before submit)
   - Display all input data for review
   - Actions: Submit, Back to Edit

4. Review (For approval workflow)
   - Display pending items
   - Approve/Reject actions

5. Result (Success/Failure)
   - Display operation result
   - Actions: Back to Query, Start New

Current Step: [Which step to implement first]

Please provide implementation for [current step] including:
1. Component TypeScript code
2. HTML template
3. Form/table setup
4. API integration
5. Navigation logic
```

### 5.2 Form Validation

**Prompt Template**:
```
Implement comprehensive form validation for [form name].

Framework: Angular 21 Reactive Forms
Form Purpose: [e.g., User Registration]

Fields and Validation Rules:
1. Username
   - Required
   - Min length: 3
   - Max length: 20
   - Pattern: alphanumeric only

2. Email
   - Required
   - Email format

3. Password
   - Required
   - Min length: 8
   - Must contain: uppercase, lowercase, number, special char

4. Confirm Password
   - Required
   - Must match password

5. [Other fields...]

Custom Validators Needed:
- [e.g., Password match validator]
- [e.g., Unique username validator (async)]

Error Messages:
- Display below each field
- Show only when field is touched/dirty
- Clear, user-friendly messages

Pattern:
```typescript
form = this.fb.group({
  username: ['', [Validators.required, Validators.minLength(3)]],
  email: ['', [Validators.required, Validators.email]],
}, { validators: this.customValidator });

getErrorMessage(fieldName: string): string {
  const control = this.form.get(fieldName);
  if (control?.hasError('required')) return 'This field is required';
  // ... other error checks
}
```

Please generate:
1. Complete form setup with validators
2. Custom validators if needed
3. Error display logic
4. HTML template with error messages
```

## 6. Debugging & Optimization

### 6.1 Debug Component Issue

**Prompt Template**:
```
Help debug this Angular component issue.

Framework: Angular 21
Component: [Component name]
Issue: [Describe the problem]

Error Message (if any):
[Paste full error message]

Relevant Code:
```typescript
[Paste relevant component code]
```

Expected Behavior:
[What should happen]

Actual Behavior:
[What actually happens]

Context:
- [Any recent changes]
- [Browser console errors]
- [Network tab observations]

Please analyze and provide:
1. Root cause of the issue
2. Step-by-step fix
3. Code changes needed
4. Prevention tips for future
```

### 6.2 Performance Optimization

**Prompt Template**:
```
Optimize performance of [component/feature].

Framework: Angular 21
Issue: [e.g., Slow rendering, Memory leak, etc.]

Component Type: [Table, Form, List, etc.]
Data Size: [e.g., 1000+ rows, Large form, etc.]

Current Implementation:
```typescript
[Paste relevant code]
```

Performance Metrics:
- Initial load time: [X seconds]
- Interaction lag: [Y ms]
- Memory usage: [Z MB]

Optimization Goals:
- Reduce initial load time
- Improve interaction responsiveness
- Optimize change detection
- [Other goals]

Please provide:
1. Performance bottleneck analysis
2. Optimization strategies
3. Code changes with explanations
4. Before/after comparison
```

## 7. Code Review & Refactoring

### 7.1 Code Review Request

**Prompt Template**:
```
Review this Angular component code and suggest improvements.

Framework: Angular 21 + PrimeNG
Component: [Component name]
Purpose: [Brief description]

Code:
```typescript
[Paste component code]
```

Review Focus:
- Angular best practices
- TypeScript usage
- PrimeNG component usage
- Code organization
- Performance
- Maintainability
- Security
- [Other aspects]

Our Project Standards:
- All feature components extend BaseContainer
- Use namespace pattern for API models
- Reactive forms with proper validation
- PrimeNG for all UI components
- Promise-based API calls
- [Other standards]

Please provide:
1. Issues found (categorized by severity)
2. Specific improvement suggestions
3. Refactored code examples
4. Explanation of why changes improve the code
```

### 7.2 Refactoring Legacy Code

**Prompt Template**:
```
Refactor this Angular component to follow our current standards.

Framework: Angular 21
Current Code:
```typescript
[Paste legacy code]
```

Target Standards:
- Standalone components (Angular 15+)
- Extend BaseContainer
- Use inject() for dependency injection
- Reactive forms
- PrimeNG components
- TypeScript strict mode
- Proper typing (no 'any')

Refactoring Goals:
- Modernize to Angular 21 patterns
- Improve type safety
- Better code organization
- Enhance maintainability
- [Other goals]

Please provide:
1. Refactored code
2. Key changes explanation
3. Migration notes (if breaking changes)
4. Testing considerations
```

## Prompt Best Practices Summary

### DO:
✅ Provide full context (framework versions, existing code)  
✅ Reference similar existing code when available  
✅ Be specific about requirements  
✅ List available components/libraries  
✅ Include expected input/output  
✅ Specify validation rules  
✅ Mention form binding needs  
✅ Request complete, working code  

### DON'T:
❌ Assume AI knows your custom components  
❌ Ask vague questions  
❌ Forget to mention PrimeNG  
❌ Skip providing context  
❌ Request overly complex features without breaking down  
❌ Ignore your project patterns  

## Quick Prompt Starters

### Component
```
Create an Angular 21 [share/block/view] component for [purpose]
using PrimeNG with [specific requirements]...
```

### Form
```
Create a reactive form for [entity] with validation rules...
```

### Table
```
Create a PrimeNG table for [data] with sorting, pagination, and actions...
```

### API
```
Create API models and service for [endpoint] following namespace pattern...
```

### Integration
```
Integrate [API] into [component] with proper error handling...
```

### Debug
```
Debug this issue: [describe problem] with code: [paste code]...
```

### Optimize
```
Optimize [component] for [performance issue]...
```

### Review
```
Review this component and suggest improvements based on Angular best practices...
```

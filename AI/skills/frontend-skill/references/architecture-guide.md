# Architecture Guide

Comprehensive guide for Angular 21 + PrimeNG project architecture, based on production-proven patterns.

## Table of Contents

1. [Project Structure Overview](#1-project-structure-overview)
2. [Routing Architecture](#2-routing-architecture)
3. [Component Architecture](#3-component-architecture)
4. [Service Layer](#4-service-layer)
5. [State Management](#5-state-management)
6. [API Integration Layer](#6-api-integration-layer)
7. [Security & Interceptors](#7-security--interceptors)
8. [Best Practices](#8-best-practices)

## 1. Project Structure Overview

### Complete Directory Structure

```
project-root/
├── src/
│   ├── main-project/                # Main application
│   │   ├── app/
│   │   │   ├── components/          # Reusable components
│   │   │   │   ├── share/           # Single, atomic components
│   │   │   │   ├── block/           # Composite components
│   │   │   │   └── layout/          # Layout/structure components
│   │   │   ├── constant/            # App-wide constants & enums
│   │   │   ├── guard/               # Route guards
│   │   │   ├── interceptors/        # HTTP interceptors
│   │   │   ├── layout/              # Main layout containers
│   │   │   │   ├── content/         # Authenticated layout
│   │   │   │   └── full/            # Public/unauthenticated layout
│   │   │   ├── modules/             # Module organization
│   │   │   ├── pipes/               # Custom pipes
│   │   │   ├── routes/              # Route configurations
│   │   │   ├── services/            # Business logic services
│   │   │   │   └── cache/           # State persistence services
│   │   │   ├── utils/               # Utility functions & classes
│   │   │   └── views/               # Feature views
│   │   │       ├── content/         # Authenticated views
│   │   │       └── full/            # Public views (login, etc.)
│   │   ├── assets/                  # Static files
│   │   ├── environments/            # Environment configurations
│   │   └── styles.scss              # Global styles
│   │
│   └── api-library/                 # API integration layer
│       └── lib/
│           ├── api/                 # API service classes
│           ├── model/               # Request/Response models
│           └── util/                # API utilities
│
├── angular.json                     # Angular configuration
├── package.json                     # Dependencies
└── tsconfig.json                    # TypeScript configuration
```

### Directory Responsibilities

#### `components/share/`
Single, highly reusable components with no business logic.

**Characteristics**:
- Pure presentation components
- Configurable via `@Input()`
- Emit events via `@Output()`
- Support reactive forms
- No direct API calls

**Examples**:
- `input.component.ts` - Text input with validation
- `button.component.ts` - Styled button
- `dropdown.component.ts` - Select dropdown
- `datepicker.component.ts` - Date picker

**Usage Pattern**:
```typescript
<app-share-input 
  [form]="form" 
  controlName="username" 
  placeholder="Enter username"
  maxlength="50" />
```

#### `components/block/`
Composite components combining multiple share components with specific business context.

**Characteristics**:
- Combines multiple share components
- May contain specific business logic
- Reusable across similar contexts
- Can interact with services

**Examples**:
- `search-form.component.ts` - Complete search form
- `data-grid.component.ts` - Table with filtering/sorting
- `user-card.component.ts` - User information card

#### `components/layout/`
Structural components defining page layout.

**Examples**:
- `header.component.ts`
- `sidebar.component.ts`
- `footer.component.ts`
- `breadcrumb.component.ts`

#### `views/`
Feature pages implementing complete business functionality.

**Structure Pattern**:
```
views/
└── content/
    └── system/
        └── setting/
            └── ad-manage/           # Feature module
                ├── query/           # Step 1: Query/List
                ├── input/           # Step 2: Input/Edit
                ├── confirm/         # Step 3: Confirm
                ├── review/          # Step 4: Review
                └── result/          # Step 5: Result
```

**Each view component**:
- Extends `BaseContainer`
- Manages feature-specific state
- Coordinates between services
- Handles navigation flow

## 2. Routing Architecture

### Routing Strategy

Routes should mirror the directory structure for clarity and maintainability.

**Directory**: `views/system/setting/ad-manage/query`  
**Route**: `system/setting/ad-manage/query`

### Route Types

#### 1. Simple Routes (Single Component)

For standalone pages without workflow:

```typescript
// content-layout.routes.ts
{
  path: 'system/query/batch-job-query',
  data: { txid: 'SQ10001' },
  component: BatchJobQueryComponent,
}
```

#### 2. Workflow Routes (Lazy Loaded Module)

For multi-step processes:

```typescript
// content-layout.routes.ts
{
  path: 'system/setting/ad-manage',
  data: { txid: 'SA10006' },
  loadChildren: () => import('../views/.../ad-manage-routes').then(m => m.routes)
}

// ad-manage-routes.ts
import { Routes } from '@angular/router';
import { QueryComponent } from './query/query.component';
import { InputComponent } from './input/input.component';
import { ConfirmComponent } from './confirm/confirm.component';
import { ReviewComponent } from './review/review.component';
import { ResultComponent } from './result/result.component';

export const routes: Routes = [
  { path: '', redirectTo: 'query', pathMatch: 'full' },
  { path: 'query', component: QueryComponent },
  { path: 'input', component: InputComponent },
  { path: 'confirm', component: ConfirmComponent },
  { path: 'review', component: ReviewComponent },
  { path: 'result', component: ResultComponent },
];
```

### Route Data

Use `data` property for metadata:

```typescript
{
  path: 'system/setting/ad-manage',
  data: { 
    txid: 'SA10006',         // Transaction ID
    title: 'Ad Management',  // Page title
    requiresAuth: true       // Custom metadata
  },
  loadChildren: () => ...
}
```

Access in component:
```typescript
constructor() {
  super();
  this.route.data.subscribe((data) => {
    this._txid = this.route.snapshot.data['txid'] || '';
  });
}
```

### Navigation with State

Pass data between routes using router state:

```typescript
// From query to input (edit mode)
this.router.navigate(['/system/setting/ad-manage/input'], {
  state: {
    action: Status.Edit,
    data: selectedRow,
    _QueryForm: this.form.value  // Preserve query criteria
  }
});

// In target component
constructor() {
  super();
  const navigation = this.router.getCurrentNavigation();
  const state = navigation?.extras?.state;
  
  if (state) {
    this.action = state['action'];
    this.rowData = state['data'];
    this.queryForm = state['_QueryForm'];
  }
}
```

## 3. Component Architecture

### Base Container Pattern

All feature components should extend `BaseContainer`:

```typescript
// utils/base-container.ts
export default class BaseContainer {
  private route = inject(ActivatedRoute);
  protected router = inject(Router);
  protected fb = inject(FormBuilder);
  protected formSave = inject(FormStateService);
  protected tableSave = inject(TableStateService);
  protected exportService = inject(ExportService);
  protected memoryService = inject(MemoryService);
  protected adminAPI = inject(AdminAPIApiService);
  protected datePipe = inject(DatePipe);

  _txid: string = '';
  _lastSegment: string | null = null;

  // Form validation helpers
  formDataVerify = formDataVerify;
  formDataHasError = formDataHasError;

  // Utility methods
  mapOption = (value: any, options: any[]) =>
    value ? options.find(item => item.value === value) : undefined;

  constructor() {
    this.route.data.subscribe((data) => {
      this._txid = this.route.snapshot.data['txid'] || '';
      this._lastSegment = this.route.snapshot.url.at(-1)?.path || null;
    });
  }

  toPrettyJson(input: unknown, space: number = 2): string {
    // JSON formatting utility
  }
}
```

**Benefits**:
- Consistent service injection across components
- Shared utility methods
- Centralized route data access
- Reduces boilerplate code

### Component Lifecycle Pattern

```typescript
export class QueryComponent extends BaseContainer {
  form: FormGroup = new FormGroup({});
  tableData: any[] = [];
  showResult: boolean = false;

  constructor() {
    super();  // Must call super()
  }

  ngOnInit() {
    this.loadIndexAPI();  // Load initial data
    this.setForm();       // Initialize form
    this.restoreState();  // Restore previous state if any
  }

  setForm() {
    this.form = this.fb.group({
      DateST: [new Date(), FieldValid.required('Please enter start date')],
      DateED: [new Date(), FieldValid.required('Please enter end date')],
    });
  }

  async loadIndexAPI() {
    try {
      await this.adminAPI.SA10006.index();
      // Initialize dropdowns, etc.
    } catch (e) {
      // Error handled by interceptor
    }
  }

  async submit() {
    this.form.markAllAsTouched();
    if (!this.form.valid) return;

    try {
      const { Data } = await this.adminAPI.SA10006.query(this.form.value);
      this.tableData = Data.QueryInfos;
      this.showResult = true;
    } catch (e) {
      // Error handled by interceptor
    }
  }
}
```

## 4. Service Layer

### Service Categories

#### Authentication Service (`auth.service.ts`)

Manages user authentication state:

```typescript
@Injectable({ providedIn: 'root' })
export class AuthService {
  private loginStat: Login.Res | undefined;
  private refreshTokenSub?: Subscription;

  // Token management
  getAcToken = (): string => this.loginStat?.AccessToken ?? '';
  getReToken = (): string => this.loginStat?.RefreshToken ?? '';
  
  // User info
  getUUName = (): string => this.loginStat?.UUName ?? '';
  getUserGroup = (): string => this.loginStat?.UserGroup ?? '';

  // Auto-refresh token
  setRefreshTokenInterval() {
    this.refreshTokenSub = interval(environment.RefreshTokenInterval)
      .subscribe(() => this.refreshToken());
  }

  async refreshToken() {
    // Refresh access token using refresh token
  }

  async logout(redirect: boolean = true) {
    this.cleanRefreshTokenInterval();
    await this.adminAPI.AuClient.logout();
    this.clearLoginStat();
    if (redirect) this.router.navigate(['']);
  }
}
```

#### State Persistence Services

**FormStateService** - Preserve form state across navigation:

```typescript
@Injectable({ providedIn: 'root' })
export class FormStateService {
  private formData: FormGroup | null = null;

  saveData(form: FormGroup): void {
    this.formData = form;
  }

  getData(): FormGroup | null {
    return this.formData;
  }

  clear(): void {
    this.formData = null;
  }
}
```

**TableStateService** - Preserve table state (pagination, sorting):

```typescript
export interface TableState {
  page: number;
  pageSize: number;
  sortField?: string;
  sortOrder?: number;
}

@Injectable({ providedIn: 'root' })
export class TableStateService {
  getInitState(sortableFields?: string[]): TableState {
    return {
      page: 0,
      pageSize: 10,
      sortField: sortableFields?.[0],
      sortOrder: 1
    };
  }
}
```

**MemoryService** - Temporary cross-component data storage:

```typescript
@Injectable({ providedIn: 'root' })
export class MemoryService {
  private storage: Map<string, any> = new Map();

  set(key: string, value: any): void {
    this.storage.set(key, value);
  }

  get(key: string): any {
    return this.storage.get(key);
  }

  remove(key: string): void {
    this.storage.delete(key);
  }

  clear(): void {
    this.storage.clear();
  }
}
```

## 5. State Management

### Form State Flow

```
Query Component (Step 1)
  ↓ (Save form state before navigation)
Input Component (Step 2)
  ↓ (Can restore query criteria)
Back to Query
  ↓ (Restore form + auto-submit)
```

Implementation:

```typescript
// In query component - before navigating away
handleEdit(rowData: any) {
  const passData = {
    action: Status.Edit,
    data: rowData,
    _QueryForm: this.form.value  // Save query criteria
  };
  this.router.navigate(['/path/to/input'], { state: passData });
}

// In query component - on init (restore state)
setForm() {
  this.form = this.fb.group({
    DateST: [new Date(), FieldValid.required('...')],
    DateED: [new Date(), FieldValid.required('...')],
  });
  
  // Check if returning from another page
  const restoreData: FormGroup | null = this.formSave.getData();
  if (restoreData?.value?._QueryForm) {
    const { DateST, DateED } = restoreData.value._QueryForm;
    this.form.patchValue({ DateST, DateED });
    this.submit();  // Auto-search
  }
}
```

### Table State Persistence

```typescript
// Component
tableState: TableState = { ...this.tableSave.getInitState() };

onPaginate(event: any) {
  this.tableState.page = event.first;
  this.tableState.pageSize = event.rows;
}

onSort(event: any) {
  this.tableState.sortField = event.field;
  this.tableState.sortOrder = event.order;
}
```

## 6. API Integration Layer

See `api-integration.md` for complete details.

Quick summary:

### Model Definition (Namespace Pattern)

```typescript
// api-library/lib/model/AdminAPI/SA10006-api-model.ts
export namespace Query {
  export interface Req {
    DateST: string;
    DateED: string;
  }

  export interface Res {
    QueryDate: string;
    DateST: string;
    DateED: string;
    QueryInfos: QueryInfo[];
  }

  export interface QueryInfo {
    AdIdDesc: string;
    Title: string;
    ShowDesc: string;
    // ...
  }
}
```

### API Service

```typescript
// api-library/lib/api/AdminAPI/SA10006-api.ts
export default class SA10006API {
  httpClient = inject(HttpClient);

  query(input: Query.Req): Promise<ResponseBody<Query.Res>> {
    return promisePack(
      this.httpClient.post<ResponseModel<Query.Res>>(
        `${environment.apiUrl}/AdminAPI/api/SA10006/Query`,
        input
      )
    );
  }
}
```

## 7. Security & Interceptors

### HTTP Interceptor Pattern

```typescript
// interceptors/token-interceptor.ts
export const TokenInterceptor: HttpInterceptorFn = (request, next) => {
  const authService = inject(AuthService);
  const alertService = inject(AlertService);
  const maskService = inject(MaskService);

  // Show loading mask
  maskService.mask();

  // Add headers
  const acToken = authService.getAcToken();
  request = request.clone({
    setHeaders: {
      'Accept-Language': 'zh-TW',
      'X-ClientID': 'MyApp',
      'X-GUID': uuidv4(),
      'Authorization': acToken,
      'Cache-Control': 'no-cache',
    }
  });

  return next(request).pipe(
    timeout(120000),
    map((res: HttpEvent<any>) => {
      if (res instanceof HttpResponse) {
        maskService.unmask();
        
        const statusCode = res.body.Status.Code;
        const statusMsg = res.body.Status.CodeMsg;
        
        // Handle special status codes
        if (!['E0000'].includes(statusCode)) {
          alertService.alert('Error', [statusMsg]);
        }
        
        // Handle session expiry
        if (['E8015', 'E8016'].includes(statusCode)) {
          authService.clearLoginStat();
          authService.redirectLoginPage();
        }
      }
      return res;
    }),
    catchError((error: HttpErrorResponse) => {
      maskService.unmask();
      let msg = 'Network error occurred';
      
      if (error.status === 0) {
        msg = 'Connection failed. Please check network.';
      } else if (error.status >= 500) {
        msg = `Server error (${error.status})`;
      }
      
      alertService.alert('Error', [msg]);
      return throwError(error);
    }),
    finalize(() => maskService.unmask())
  );
};
```

### Route Guards

```typescript
// guard/auth.guard.ts
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.getAcToken()) {
    return true;
  }

  router.navigate(['/login'], {
    queryParams: { returnUrl: state.url }
  });
  return false;
};
```

## 8. Best Practices

### Component Best Practices

1. **Extend BaseContainer** for all feature components
2. **Initialize forms in `setForm()`** method
3. **Use `markAllAsTouched()`** before validation
4. **Handle async operations** with try-catch (errors handled by interceptor)
5. **Clean up subscriptions** in `ngOnDestroy()`

### Routing Best Practices

1. **Align routes with directory structure**
2. **Use lazy loading** for feature modules
3. **Pass complex data** via router state
4. **Use route data** for metadata (txid, title, etc.)
5. **Implement guards** for protected routes

### Service Best Practices

1. **Single responsibility** per service
2. **Use `providedIn: 'root'`** for singleton services
3. **Inject dependencies** using `inject()` function
4. **Return Promises** from API calls (not Observables)
5. **Handle errors** at interceptor level

### State Management Best Practices

1. **Persist form state** when navigating away from query pages
2. **Auto-restore and re-execute** queries when returning
3. **Use memory service** for temporary cross-component data
4. **Clear state** when appropriate (logout, workflow completion)

### API Integration Best Practices

1. **Use namespace pattern** for models
2. **Group related types** together
3. **Define interfaces** for all request/response
4. **Use environment variables** for base URLs
5. **Convert Observables to Promises** for simpler async/await

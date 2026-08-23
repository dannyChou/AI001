# API Integration Guide

Comprehensive guide for API integration using TypeScript namespace pattern and centralized API library architecture.

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Model Definition Pattern](#2-model-definition-pattern)
3. [API Service Implementation](#3-api-service-implementation)
4. [HTTP Client Configuration](#4-http-client-configuration)
5. [Error Handling](#5-error-handling)
6. [Best Practices](#6-best-practices)

## 1. Architecture Overview

### API Library Structure

```
src/api-library/lib/
├── api/                          # API service implementations
│   └── AdminAPI/
│       ├── AdminAPI-api.service.ts  # Main service aggregator
│       ├── Auth-api.ts              # Authentication endpoints
│       ├── EQ10001-api.ts           # Employee Query
│       └── SA10006-api.ts           # System Admin
├── model/                        # Request/Response models
│   ├── AdminAPI/
│   │   ├── Auth-api-model.ts        # Auth models
│   │   ├── EQ10001-api-model.ts     # EQ10001 models
│   │   └── SA10006-api-model.ts     # SA10006 models
│   └── Response/
│       ├── ResponseModel.ts         # Generic response wrapper
│       └── ResponseStatus.ts        # Status codes & messages
└── util/                         # Utilities
    └── promise.ts                # Observable to Promise converter
```

### Benefits of This Architecture

1. **Type Safety**: Full TypeScript type checking for all API interactions
2. **Centralization**: All API logic in one place
3. **Maintainability**: Easy to locate and update API definitions
4. **Consistency**: Uniform patterns across all endpoints
5. **Testability**: Services can be easily mocked
6. **Documentation**: Models serve as API documentation

## 2. Model Definition Pattern

### TypeScript Namespace Pattern

Use **namespace pattern** to group related request/response types:

```typescript
// api-library/lib/model/AdminAPI/Auth-api-model.ts

export namespace Login {
  export interface Req {
    UID: string;              // Login User ID
    UPP: string;              // User Password
    CheckOutReLogin: string;  // Re-login flag: Y=yes, other=no
  }

  export interface Res {
    AccessToken: string;
    RefreshToken: string;
    AccessTokenExpiredIn: string;
    RefreshTokenExpiredIn: string;
    UUName: string;           // User display name
    UserGroup: string;        // User group/role
  }
}

export namespace RefreshToken {
  export interface Req {
    RefreshToken: string;
  }

  export interface Res {
    AccessToken: string;
    RefreshToken: string;
    AccessTokenExpiredIn: string;
    RefreshTokenExpiredIn: string;
  }
}

export namespace Logout {
  export interface Req {}
  export interface Res {}
}
```

### Why Namespace Pattern?

**Benefits**:
- ✅ Groups related types logically
- ✅ No naming conflicts (Login.Req vs RefreshToken.Req)
- ✅ Easy to locate (Auth-api-model.ts contains all auth types)
- ✅ Clean imports: `import { Login } from '@apilib/model/AdminAPI/Auth-api-model'`
- ✅ IntelliSense-friendly

**vs Alternative Approaches**:

❌ **Prefixed Interfaces** (verbose):
```typescript
export interface LoginRequest { ... }
export interface LoginResponse { ... }
export interface RefreshTokenRequest { ... }
export interface RefreshTokenResponse { ... }
```

❌ **Nested Objects** (harder to import):
```typescript
export const Auth = {
  Login: {
    Request: interface { ... },
    Response: interface { ... }
  }
}
```

### Complex Model Example

```typescript
// api-library/lib/model/AdminAPI/SA10006-api-model.ts

export namespace Index {
  export interface Req {}
  
  export interface Res {
    ShowOptions: Option[];
  }
  
  export interface Option {
    label: string;
    value: string;
  }
}

export namespace Query {
  export interface Req {
    DateST: string;  // Start date (yyyy/MM/dd)
    DateED: string;  // End date (yyyy/MM/dd)
  }

  export interface Res {
    QueryDate: string;
    DateST: string;
    DateED: string;
    SortBtn: boolean;
    FlowSortInfos: AdInfo[];
    FlowInfos: AdInfo[];
    CurrInfos: AdInfo[];
    QueryInfos: AdInfo[];
  }

  export interface AdInfo {
    AdIdDesc: string;
    ModifyTime: string;
    Title: string;
    ShowDesc: string;
    StartTime: string;
    EndTime: string;
    WebRquid: string;
    ActionBtn?: boolean;
    FlowDetailBtn?: boolean;
    CaseSN?: string;
  }
}

export namespace QueryCaseDetail {
  export interface Req {
    CaseSN: string;
  }

  export interface Res {
    FlowInfo: DetailInfo;
    CurrInfo: DetailInfo;
  }

  export interface DetailInfo {
    CaseSN: string;
    ActionDesc: string;
    AdIdDesc: string;
    Title: string;
    URL: string;
    ShowDesc: string;
    StartTime: string;
    EndTime: string;
    WebRquid: string;
    TxCaseMemo: string;
  }
}
```

### Shared/Common Models

```typescript
// api-library/lib/model/Response/ResponseModel.ts

export interface ResponseModel<T> {
  Status: ResponseStatus;
  Data: T;
}

export interface ResponseStatus {
  Code: string;
  CodeMsg: string;
}

export interface ResponseBody<T> {
  Status: ResponseStatus;
  Data: T;
}
```

## 3. API Service Implementation

### Individual API Service

```typescript
// api-library/lib/api/AdminAPI/SA10006-api.ts

import promisePack from '@apilib/utils/promise';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { ResponseModel } from '@apilib/model/Response/ResponseModel';
import { ResponseBody } from '@apilib/model/Response/ResponseStatus';
import { environment } from 'src/management-console-frontend/environments/environment';
import { Index, Query, QueryCaseDetail } from '@apilib/model/AdminAPI/SA10006-api-model';

export default class SA10006API {
  httpClient = inject(HttpClient);

  /**
   * @description Ad Management - Index (Initialize dropdown data)
   * @returns Promise<ResponseBody<Index.Res>>
   */
  index(): Promise<ResponseBody<Index.Res>> {
    return promisePack(
      this.httpClient.post<ResponseModel<Index.Res>>(
        `${environment.apiUrl}/AdminAPI/api/SA10006/Index`, 
        {}
      )
    );
  }
  
  /**
   * @description Ad Management - Query
   * @param input Query request parameters
   * @returns Promise<ResponseBody<Query.Res>>
   */
  query(input: Query.Req): Promise<ResponseBody<Query.Res>> {
    return promisePack(
      this.httpClient.post<ResponseModel<Query.Res>>(
        `${environment.apiUrl}/AdminAPI/api/SA10006/Query`, 
        input
      )
    );
  }

  /**
   * @description Ad Management - Query Case Detail
   * @param input Case detail request
   * @returns Promise<ResponseBody<QueryCaseDetail.Res>>
   */
  queryCaseDetail(input: QueryCaseDetail.Req): Promise<ResponseBody<QueryCaseDetail.Res>> {
    return promisePack(
      this.httpClient.post<ResponseModel<QueryCaseDetail.Res>>(
        `${environment.apiUrl}/AdminAPI/api/SA10006/QueryCaseDetail`, 
        input
      )
    );
  }
}
```

**Key Points**:
- Use `inject(HttpClient)` for dependency injection
- Return `Promise<ResponseBody<T>>` (not Observable)
- Use `promisePack` utility to convert Observable to Promise
- Add JSDoc comments for each method
- Import types from model file
- Use `environment` for base URL

### Service Aggregator

```typescript
// api-library/lib/api/AdminAPI/AdminAPI-api.service.ts

import { Injectable } from '@angular/core';
import AuthAPI from './Auth-api';
import EQ10001API from './EQ10001-api';
import SA10006API from './SA10006-api';

@Injectable({
  providedIn: 'root'
})
export default class AdminAPIApiService {
  AuClient = new AuthAPI();
  EQ10001 = new EQ10001API();
  SA10006 = new SA10006API();
  
  // Add more API endpoints here
}
```

**Usage in Components**:

```typescript
export class QueryComponent extends BaseContainer {
  // Already injected via BaseContainer:
  // protected adminAPI = inject(AdminAPIApiService);

  async ngOnInit() {
    // Call index to initialize dropdowns
    await this.adminAPI.SA10006.index();
  }

  async submit() {
    try {
      const { Data } = await this.adminAPI.SA10006.query({
        DateST: '2024/01/01',
        DateED: '2024/12/31'
      });
      
      this.tableData = Data.QueryInfos;
    } catch (e) {
      // Error already handled by interceptor
    }
  }
}
```

### Promise Utility

```typescript
// api-library/lib/util/promise.ts

import { Observable, firstValueFrom } from 'rxjs';
import { ResponseModel } from '@apilib/model/Response/ResponseModel';

/**
 * Convert Observable to Promise
 * Simplifies async/await usage in components
 */
export default function promisePack<T>(
  observable: Observable<ResponseModel<T>>
): Promise<ResponseModel<T>> {
  return firstValueFrom(observable);
}
```

**Why Convert to Promise?**
- Simpler async/await syntax
- No need for subscription management
- Cleaner error handling with try/catch
- Matches modern JavaScript patterns

## 4. HTTP Client Configuration

### Environment Configuration

```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080',
  RefreshTokenInterval: 300000, // 5 minutes
};

// src/environments/environment.prod.ts
export const environment = {
  production: true,
  apiUrl: 'https://api.production.com',
  RefreshTokenInterval: 300000,
};
```

### HTTP Interceptor

See `architecture-guide.md` Section 7 for complete interceptor implementation.

**Key Responsibilities**:
1. Add authentication headers
2. Add common headers (Client-ID, GUID, etc.)
3. Show/hide loading mask
4. Handle global errors
5. Handle session expiry
6. Transform error messages

## 5. Error Handling

### Error Handling Strategy

**Three Levels of Error Handling**:

1. **Interceptor Level** (Global)
   - Network errors
   - HTTP status errors (4xx, 5xx)
   - Session expiry
   - Timeout errors

2. **Service Level** (Rarely needed)
   - Transformation errors
   - Data validation

3. **Component Level** (Business logic)
   - Handle specific business errors
   - Update UI based on response

### Component Error Handling Pattern

```typescript
async submit() {
  this.form.markAllAsTouched();
  if (!this.form.valid) return;

  try {
    const { Data, Status } = await this.adminAPI.SA10006.query(this.form.value);
    
    // Handle business-specific success codes
    if (Status.Code === 'E0000') {
      this.tableData = Data.QueryInfos;
      this.showResult = true;
    } else if (Status.Code === 'E8006') {
      // Handle specific business case
      this.handleReLoginCase();
    }
  } catch (error) {
    // Network/HTTP errors already handled by interceptor
    // Only handle component-specific cleanup here
    console.error('Query failed:', error);
  }
}
```

### Common Error Codes

Define in constants file:

```typescript
// app/constant/error-codes.ts

export const ErrorCodes = {
  SUCCESS: 'E0000',
  RE_LOGIN_REQUIRED: 'E8006',
  SESSION_EXPIRED: 'E8015',
  TOKEN_INVALID: 'E8016',
  CONCURRENT_LOGIN: 'E8023',
} as const;

export type ErrorCode = typeof ErrorCodes[keyof typeof ErrorCodes];
```

## 6. Best Practices

### 1. Model Organization

✅ **DO**:
- One file per major endpoint group (e.g., `Auth-api-model.ts`)
- Use namespace for each operation (Login, Logout, etc.)
- Keep Req/Res interfaces together
- Define nested interfaces within namespace

❌ **DON'T**:
- Mix models from different domains
- Create separate files for each Req/Res pair
- Use generic names like `Request` or `Response`

### 2. API Service Organization

✅ **DO**:
- One class per major endpoint group
- Use descriptive method names matching API operations
- Add JSDoc comments
- Return typed Promises
- Use environment variables for URLs

❌ **DON'T**:
- Put all endpoints in one giant service
- Return Observables (convert to Promise)
- Hardcode URLs
- Omit type annotations

### 3. Naming Conventions

**Files**:
- Models: `<Endpoint>-api-model.ts` (e.g., `SA10006-api-model.ts`)
- Services: `<Endpoint>-api.ts` (e.g., `SA10006-api.ts`)

**Namespaces**:
- PascalCase: `Query`, `QueryCaseDetail`, `GetUploadFile`

**Interfaces**:
- `Req` for requests
- `Res` for responses
- Descriptive names for nested types

**Methods**:
- camelCase: `query()`, `queryCaseDetail()`, `getUploadFile()`
- Match API operation name when possible

### 4. Type Safety

✅ **DO**:
```typescript
// Strongly typed
async query(input: Query.Req): Promise<ResponseBody<Query.Res>> {
  return promisePack(
    this.httpClient.post<ResponseModel<Query.Res>>(url, input)
  );
}

// Usage
const { Data } = await this.adminAPI.SA10006.query({
  DateST: '2024/01/01',  // TypeScript validates this
  DateED: '2024/12/31'
});

// Data is fully typed
Data.QueryInfos.forEach(info => {
  console.log(info.Title); // TypeScript knows this property
});
```

❌ **DON'T**:
```typescript
// Untyped
async query(input: any): Promise<any> {
  return this.httpClient.post(url, input).toPromise();
}
```

### 5. Comments and Documentation

✅ **Good Documentation**:
```typescript
export namespace Query {
  export interface Req {
    DateST: string;  // Start date format: yyyy/MM/dd
    DateED: string;  // End date format: yyyy/MM/dd
  }

  export interface Res {
    QueryDate: string;        // Current system date
    DateST: string;          // Query start date (echo)
    DateED: string;          // Query end date (echo)
    QueryInfos: AdInfo[];    // Search results
  }

  /** Ad information */
  export interface AdInfo {
    AdIdDesc: string;        // Ad ID display format
    ModifyTime: string;      // Last modified timestamp
    Title: string;           // Ad title (max 50 chars)
    ShowDesc: string;        // Display status description
    StartTime: string;       // Ad start time (yyyy/MM/dd HH:mm:ss)
    EndTime: string;         // Ad end time (yyyy/MM/dd HH:mm:ss)
    WebRquid: string;        // Image request UID
    ActionBtn?: boolean;     // Show action button flag
    FlowDetailBtn?: boolean; // Show detail button flag
    CaseSN?: string;         // Case serial number (if in workflow)
  }
}
```

### 6. Environment Variables

✅ **DO**:
```typescript
// Define all API URLs in environment
export const environment = {
  apiUrl: 'http://localhost:8080',
  adminApiUrl: 'http://localhost:8080/AdminAPI',
  publicApiUrl: 'http://localhost:8080/Public',
};

// Use in service
`${environment.adminApiUrl}/api/SA10006/Query`
```

❌ **DON'T**:
```typescript
// Hardcoded URL
'http://localhost:8080/AdminAPI/api/SA10006/Query'
```

### 7. Consistent Patterns

**All API services should follow the same structure**:

```typescript
export default class MyAPI {
  httpClient = inject(HttpClient);

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

### 8. Testing

**Mock API Service**:

```typescript
// Mock for testing
class MockSA10006API {
  async query(input: Query.Req): Promise<ResponseBody<Query.Res>> {
    return {
      Status: { Code: 'E0000', CodeMsg: 'Success' },
      Data: {
        QueryDate: '2024/01/01',
        DateST: input.DateST,
        DateED: input.DateED,
        QueryInfos: [
          { AdIdDesc: 'AD001', Title: 'Test Ad', /* ... */ }
        ]
      }
    };
  }
}

// Use in tests
TestBed.configureTestingModule({
  providers: [
    { provide: AdminAPIApiService, useValue: { SA10006: new MockSA10006API() } }
  ]
});
```

## Quick Reference

### Creating a New API Endpoint

1. **Define Models** (`api-library/lib/model/...`):
```typescript
export namespace OperationName {
  export interface Req { /* ... */ }
  export interface Res { /* ... */ }
}
```

2. **Create API Service** (`api-library/lib/api/...`):
```typescript
export default class MyAPI {
  httpClient = inject(HttpClient);
  
  operationName(input: OperationName.Req): Promise<ResponseBody<OperationName.Res>> {
    return promisePack(
      this.httpClient.post<ResponseModel<OperationName.Res>>(url, input)
    );
  }
}
```

3. **Register in Aggregator**:
```typescript
@Injectable({ providedIn: 'root' })
export default class AdminAPIApiService {
  MyAPI = new MyAPI();
}
```

4. **Use in Component**:
```typescript
export class MyComponent extends BaseContainer {
  async loadData() {
    const { Data } = await this.adminAPI.MyAPI.operationName({ /* ... */ });
    // Use Data...
  }
}
```

## Common Patterns Summary

| Pattern | Usage |
|---------|-------|
| Namespace | Group related Req/Res types |
| promisePack | Convert Observable to Promise |
| inject() | Dependency injection |
| environment | Configuration management |
| ResponseBody<T> | Typed API responses |
| BaseContainer | Common service injections |
| try/catch | Component-level error handling |
| Interceptor | Global error handling |

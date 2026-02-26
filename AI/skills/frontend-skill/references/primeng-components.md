# PrimeNG Components Reference

Quick reference guide for commonly used PrimeNG components in Angular 21 projects.

## Table of Contents

1. [Setup](#setup)
2. [Form Components](#form-components)
3. [Data Display Components](#data-display-components)
4. [Overlay Components](#overlay-components)
5. [Common Patterns](#common-patterns)

## Setup

### Installation

```bash
npm install primeng primeicons
```

### Configuration

**angular.json**:
```json
{
  "styles": [
    "node_modules/primeng/resources/themes/lara-light-blue/theme.css",
    "node_modules/primeng/resources/primeng.min.css",
    "node_modules/primeicons/primeicons.css",
    "src/styles.scss"
  ]
}
```

### Import in Component

```typescript
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
// ... other PrimeNG imports

@Component({
  selector: 'app-my-component',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    // ... other modules
  ],
  // ...
})
```

## Form Components

### Button

**Basic Usage**:
```html
<p-button label="Submit" icon="pi pi-check" (click)="submit()"></p-button>
<p-button label="Cancel" icon="pi pi-times" severity="secondary" (click)="cancel()"></p-button>
```

**Button Variants**:
```html
<!-- Severity -->
<p-button label="Primary" severity="primary"></p-button>
<p-button label="Success" severity="success"></p-button>
<p-button label="Info" severity="info"></p-button>
<p-button label="Warning" severity="warning"></p-button>
<p-button label="Danger" severity="danger"></p-button>
<p-button label="Secondary" severity="secondary"></p-button>

<!-- Size -->
<p-button label="Small" size="small"></p-button>
<p-button label="Normal"></p-button>
<p-button label="Large" size="large"></p-button>

<!-- Style -->
<p-button label="Filled" />
<p-button label="Outlined" [outlined]="true" />
<p-button label="Text" [text]="true" />
```

### InputText

**Basic Usage**:
```html
<input 
  type="text" 
  pInputText 
  [formControl]="form.get('username')" 
  placeholder="Enter username" />
```

**With Form Group**:
```typescript
// Component
form = this.fb.group({
  username: ['', Validators.required],
  email: ['', [Validators.required, Validators.email]],
});
```

```html
<!-- Template -->
<form [formGroup]="form">
  <div class="field">
    <label for="username">Username</label>
    <input 
      id="username"
      type="text" 
      pInputText 
      formControlName="username" 
      placeholder="Enter username" 
      class="w-full" />
    <small *ngIf="form.get('username')?.invalid && form.get('username')?.touched" class="p-error">
      Username is required
    </small>
  </div>
</form>
```

### Dropdown

**Basic Usage**:
```typescript
// Component
interface Option {
  label: string;
  value: string;
}

options: Option[] = [
  { label: 'Option 1', value: '1' },
  { label: 'Option 2', value: '2' },
  { label: 'Option 3', value: '3' },
];

selectedOption: string = '';
```

```html
<!-- Template -->
<p-dropdown
  [options]="options"
  [(ngModel)]="selectedOption"
  optionLabel="label"
  optionValue="value"
  placeholder="Select an option"
  class="w-full"></p-dropdown>
```

**With Reactive Forms**:
```html
<p-dropdown
  [options]="options"
  [formControl]="form.get('status')"
  optionLabel="label"
  optionValue="value"
  placeholder="Select status"
  class="w-full"></p-dropdown>
```

**With Filter**:
```html
<p-dropdown
  [options]="options"
  [(ngModel)]="selectedOption"
  [filter]="true"
  filterBy="label"
  placeholder="Search and select"
  class="w-full"></p-dropdown>
```

### Calendar (Date Picker)

**Basic Usage**:
```html
<p-calendar
  [(ngModel)]="selectedDate"
  dateFormat="yy/mm/dd"
  placeholder="Select date"></p-calendar>
```

**Date Range**:
```html
<p-calendar
  [(ngModel)]="dateRange"
  selectionMode="range"
  dateFormat="yy/mm/dd"
  placeholder="Select date range"></p-calendar>
```

**With Time**:
```html
<p-calendar
  [(ngModel)]="selectedDateTime"
  [showTime]="true"
  [showSeconds]="true"
  hourFormat="24"
  dateFormat="yy/mm/dd"
  placeholder="Select date and time"></p-calendar>
```

**With Reactive Forms**:
```html
<p-calendar
  [formControl]="form.get('startDate')"
  dateFormat="yy/mm/dd"
  placeholder="Start date"></p-calendar>
```

### InputTextarea

```html
<textarea 
  pInputTextarea 
  [formControl]="form.get('description')"
  rows="5" 
  cols="30" 
  placeholder="Enter description"
  class="w-full"></textarea>
```

**Auto-resize**:
```html
<textarea 
  pInputTextarea 
  [autoResize]="true"
  [formControl]="form.get('notes')"
  placeholder="Enter notes"></textarea>
```

### Checkbox

**Single Checkbox**:
```html
<p-checkbox 
  [(ngModel)]="agreed" 
  [binary]="true" 
  label="I agree to terms"></p-checkbox>
```

**Multiple Checkboxes**:
```typescript
// Component
selectedCategories: string[] = [];
categories = [
  { name: 'Technology', key: 'tech' },
  { name: 'Sports', key: 'sports' },
  { name: 'Music', key: 'music' }
];
```

```html
<!-- Template -->
<div *ngFor="let category of categories" class="field-checkbox">
  <p-checkbox 
    name="categories"
    [value]="category.key"
    [(ngModel)]="selectedCategories"
    [inputId]="category.key"></p-checkbox>
  <label [for]="category.key">{{ category.name }}</label>
</div>
```

### RadioButton

```typescript
// Component
selectedOption: string = '';
options = [
  { name: 'Option 1', key: 'opt1' },
  { name: 'Option 2', key: 'opt2' },
  { name: 'Option 3', key: 'opt3' }
];
```

```html
<!-- Template -->
<div *ngFor="let option of options" class="field-radiobutton">
  <p-radioButton 
    name="options"
    [value]="option.key"
    [(ngModel)]="selectedOption"
    [inputId]="option.key"></p-radioButton>
  <label [for]="option.key">{{ option.name }}</label>
</div>
```

### FileUpload

```html
<p-fileUpload
  mode="basic"
  name="file[]"
  accept="image/*"
  [maxFileSize]="1000000"
  [auto]="true"
  chooseLabel="Browse"
  (onUpload)="onUpload($event)"></p-fileUpload>
```

**Advanced Upload**:
```html
<p-fileUpload
  name="files[]"
  [multiple]="true"
  accept="image/*"
  [maxFileSize]="1000000"
  (onSelect)="onSelect($event)"
  (onUpload)="onUpload($event)"></p-fileUpload>
```

## Data Display Components

### Table

**Basic Table**:
```typescript
// Component
products: Product[] = [];
cols: any[] = [
  { field: 'code', header: 'Code' },
  { field: 'name', header: 'Name' },
  { field: 'category', header: 'Category' },
  { field: 'quantity', header: 'Quantity' }
];
```

```html
<!-- Template -->
<p-table [value]="products" [columns]="cols">
  <ng-template pTemplate="header" let-columns>
    <tr>
      <th *ngFor="let col of columns">{{ col.header }}</th>
    </tr>
  </ng-template>
  <ng-template pTemplate="body" let-product let-columns="columns">
    <tr>
      <td *ngFor="let col of columns">{{ product[col.field] }}</td>
    </tr>
  </ng-template>
</p-table>
```

**With Pagination**:
```html
<p-table 
  [value]="products" 
  [paginator]="true" 
  [rows]="10"
  [rowsPerPageOptions]="[5, 10, 20]">
  <!-- ... -->
</p-table>
```

**With Sorting**:
```html
<p-table [value]="products">
  <ng-template pTemplate="header">
    <tr>
      <th pSortableColumn="code">Code <p-sortIcon field="code"></p-sortIcon></th>
      <th pSortableColumn="name">Name <p-sortIcon field="name"></p-sortIcon></th>
    </tr>
  </ng-template>
  <!-- ... -->
</p-table>
```

**With Filtering**:
```html
<p-table 
  [value]="products" 
  [globalFilterFields]="['name', 'code']">
  <ng-template pTemplate="caption">
    <div class="flex">
      <span class="p-input-icon-left ml-auto">
        <i class="pi pi-search"></i>
        <input 
          pInputText 
          type="text" 
          (input)="dt.filterGlobal($event.target.value, 'contains')" 
          placeholder="Search keyword" />
      </span>
    </div>
  </ng-template>
  <!-- ... -->
</p-table>
```

**With Selection**:
```typescript
// Component
selectedProducts: Product[] = [];
```

```html
<!-- Template - Multiple Selection -->
<p-table 
  [value]="products" 
  [(selection)]="selectedProducts" 
  [dataKey]="id">
  <ng-template pTemplate="header">
    <tr>
      <th style="width: 4rem"><p-tableHeaderCheckbox /></th>
      <th>Code</th>
      <th>Name</th>
    </tr>
  </ng-template>
  <ng-template pTemplate="body" let-product>
    <tr>
      <td><p-tableCheckbox [value]="product" /></td>
      <td>{{ product.code }}</td>
      <td>{{ product.name }}</td>
    </tr>
  </ng-template>
</p-table>
```

### DataView

```html
<p-dataView [value]="products" layout="grid">
  <ng-template let-product pTemplate="gridItem">
    <div class="col-12 md:col-4">
      <div class="product-grid-item card">
        <div class="product-grid-item-content">
          <img [src]="product.image" [alt]="product.name" />
          <div class="product-name">{{ product.name }}</div>
          <div class="product-description">{{ product.description }}</div>
        </div>
      </div>
    </div>
  </ng-template>
</p-dataView>
```

### Card

```html
<p-card header="Card Title" subheader="Card Subtitle">
  <ng-template pTemplate="header">
    <img alt="Card" src="image.jpg" />
  </ng-template>
  <p>Card content goes here.</p>
  <ng-template pTemplate="footer">
    <p-button label="Save" icon="pi pi-check"></p-button>
    <p-button label="Cancel" icon="pi pi-times" styleClass="p-button-secondary"></p-button>
  </ng-template>
</p-card>
```

### Panel

```html
<p-panel header="Header" [toggleable]="true">
  <p>Panel content.</p>
</p-panel>
```

### Divider

```html
<div>Content Above</div>
<p-divider></p-divider>
<div>Content Below</div>

<!-- Vertical -->
<div class="flex">
  <div>Left Content</div>
  <p-divider layout="vertical"></p-divider>
  <div>Right Content</div>
</div>

<!-- With Text -->
<p-divider align="center">
  <span class="p-tag">OR</span>
</p-divider>
```

## Overlay Components

### Dialog

**Basic Dialog**:
```typescript
// Component
visible: boolean = false;

showDialog() {
  this.visible = true;
}
```

```html
<!-- Template -->
<p-button (click)="showDialog()" label="Show"></p-button>

<p-dialog 
  header="Dialog Title" 
  [(visible)]="visible" 
  [modal]="true"
  [style]="{width: '50vw'}">
  <p>Dialog content goes here.</p>
  <ng-template pTemplate="footer">
    <p-button 
      label="Cancel" 
      icon="pi pi-times" 
      (click)="visible=false" 
      styleClass="p-button-text"></p-button>
    <p-button 
      label="Save" 
      icon="pi pi-check" 
      (click)="visible=false"></p-button>
  </ng-template>
</p-dialog>
```

### ConfirmDialog

**Setup**:
```typescript
// app.config.ts
import { ConfirmationService } from 'primeng/api';

export const appConfig: ApplicationConfig = {
  providers: [
    // ... other providers
    ConfirmationService
  ]
};
```

**Usage**:
```typescript
// Component
constructor(private confirmationService: ConfirmationService) {}

confirm() {
  this.confirmationService.confirm({
    message: 'Are you sure you want to proceed?',
    header: 'Confirmation',
    icon: 'pi pi-exclamation-triangle',
    accept: () => {
      // Action on accept
    },
    reject: () => {
      // Action on reject
    }
  });
}
```

```html
<!-- Template -->
<p-confirmDialog></p-confirmDialog>
<p-button (click)="confirm()" label="Delete"></p-button>
```

### Toast

**Setup**:
```typescript
// app.config.ts
import { MessageService } from 'primeng/api';

export const appConfig: ApplicationConfig = {
  providers: [
    // ... other providers
    MessageService
  ]
};
```

**Usage**:
```typescript
// Component
constructor(private messageService: MessageService) {}

showSuccess() {
  this.messageService.add({
    severity: 'success', 
    summary: 'Success', 
    detail: 'Message Content'
  });
}

showError() {
  this.messageService.add({
    severity: 'error', 
    summary: 'Error', 
    detail: 'Message Content'
  });
}
```

```html
<!-- Template -->
<p-toast></p-toast>
<p-button (click)="showSuccess()" label="Success"></p-button>
```

**Severities**:
- `success` - Green checkmark
- `info` - Blue info icon
- `warn` - Orange warning icon
- `error` - Red error icon

### OverlayPanel

```typescript
// Component
@ViewChild('op') overlayPanel!: OverlayPanel;

toggle(event: Event) {
  this.overlayPanel.toggle(event);
}
```

```html
<!-- Template -->
<p-button (click)="toggle($event)" label="Toggle"></p-button>

<p-overlayPanel #op>
  <p>Overlay content</p>
</p-overlayPanel>
```

## Common Patterns

### Form with Validation

```typescript
// Component
form: FormGroup;

ngOnInit() {
  this.form = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required]
  }, { validators: this.passwordMatchValidator });
}

passwordMatchValidator(g: FormGroup) {
  return g.get('password')?.value === g.get('confirmPassword')?.value
    ? null : { 'mismatch': true };
}

onSubmit() {
  if (this.form.valid) {
    // Process form
  } else {
    this.form.markAllAsTouched();
  }
}

getErrorMessage(fieldName: string): string {
  const control = this.form.get(fieldName);
  if (control?.hasError('required')) return 'This field is required';
  if (control?.hasError('email')) return 'Invalid email format';
  if (control?.hasError('minlength')) {
    return `Minimum length is ${control.errors?.['minlength'].requiredLength}`;
  }
  return '';
}
```

```html
<!-- Template -->
<form [formGroup]="form" (ngSubmit)="onSubmit()">
  <div class="field">
    <label for="username">Username *</label>
    <input 
      id="username" 
      type="text" 
      pInputText 
      formControlName="username" 
      class="w-full" />
    <small 
      *ngIf="form.get('username')?.invalid && form.get('username')?.touched" 
      class="p-error">
      {{ getErrorMessage('username') }}
    </small>
  </div>

  <div class="field">
    <label for="email">Email *</label>
    <input 
      id="email" 
      type="email" 
      pInputText 
      formControlName="email" 
      class="w-full" />
    <small 
      *ngIf="form.get('email')?.invalid && form.get('email')?.touched" 
      class="p-error">
      {{ getErrorMessage('email') }}
    </small>
  </div>

  <p-button 
    type="submit" 
    label="Submit" 
    [disabled]="form.invalid"></p-button>
</form>
```

### Reusable Table Component

```typescript
// reusable-table.component.ts
@Component({
  selector: 'app-reusable-table',
  template: `
    <p-table 
      [value]="data" 
      [columns]="columns"
      [paginator]="paginator"
      [rows]="rows"
      [rowsPerPageOptions]="rowsPerPageOptions">
      <ng-template pTemplate="header" let-columns>
        <tr>
          <th *ngFor="let col of columns" [pSortableColumn]="col.field">
            {{ col.header }}
            <p-sortIcon [field]="col.field"></p-sortIcon>
          </th>
          <th *ngIf="actions">Actions</th>
        </tr>
      </ng-template>
      <ng-template pTemplate="body" let-rowData let-columns="columns">
        <tr>
          <td *ngFor="let col of columns">{{ rowData[col.field] }}</td>
          <td *ngIf="actions">
            <p-button 
              *ngFor="let action of actions"
              [label]="action.label"
              [icon]="action.icon"
              (click)="action.callback(rowData)"
              styleClass="p-button-sm p-button-text"></p-button>
          </td>
        </tr>
      </ng-template>
    </p-table>
  `
})
export class ReusableTableComponent {
  @Input() data: any[] = [];
  @Input() columns: any[] = [];
  @Input() paginator: boolean = true;
  @Input() rows: number = 10;
  @Input() rowsPerPageOptions: number[] = [5, 10, 20];
  @Input() actions?: Array<{
    label: string;
    icon: string;
    callback: (row: any) => void;
  }>;
}
```

### Conditional CSS Classes

```html
<!-- Using ngClass -->
<div [ngClass]="{
  'success': status === 'active',
  'warning': status === 'pending',
  'danger': status === 'inactive'
}">
  {{ status }}
</div>

<!-- PrimeNG Tag Component -->
<p-tag 
  [value]="status" 
  [severity]="getSeverity(status)"></p-tag>
```

```typescript
getSeverity(status: string): 'success' | 'info' | 'warning' | 'danger' {
  switch(status) {
    case 'active': return 'success';
    case 'pending': return 'warning';
    case 'inactive': return 'danger';
    default: return 'info';
  }
}
```

## Resources

- [PrimeNG Official Documentation](https://primeng.org/)
- [PrimeNG Showcase](https://primeng.org/showcase)
- [PrimeIcons](https://primeng.org/icons)

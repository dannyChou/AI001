import { Component, Input } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { SharedModule } from "@app/modules/shared-module";
import { formDataVerify } from "@app/utils/form";

type RestrictType =
  | 'half'       // Restrict to half-width characters
  | 'full'       // Convert to full-width
  | 'num'        // Restrict to numbers 0-9
  | 'enNum'      // Allow English and numbers only
  | 'enNumZh'    // Allow English, numbers, Chinese
  | 'lowEnNum'   // Allow lowercase English and numbers
  | 'staffEUId'  // Allow A-Z, a-z, 0-9, _ . - $ @
  | 'none';

/**
 * Share Input Component
 * 
 * Reusable text input component with validation support for reactive forms.
 * 
 * Features:
 * - Form binding (FormGroup + FormControl)
 * - Validation error display
 * - Input restrictions (numeric, alphanumeric, etc.)
 * - PrimeNG styling
 * 
 * Usage:
 * ```html
 * <app-share-input 
 *   [form]="form" 
 *   controlName="username" 
 *   placeholder="Enter username"
 *   maxlength="50"
 *   restrict="enNum" />
 * ```
 */
@Component({
  selector: 'app-share-input',
  imports: [SharedModule],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
})
export class InputComponent {
  @Input({ required: true }) form!: FormGroup;
  @Input({ required: true }) controlName!: string;
  @Input() type: string = 'text';
  @Input() maxlength: string = '';
  @Input() class: string = 'w-full';
  @Input() placeholder: string = '';
  @Input() loginPage: boolean = false;  // Is from login page
  @Input() showError: boolean = false;  // Show error message
  @Input() restrict: RestrictType = 'none'; // Input restriction

  private isComposing = false;

  // Form validation helper
  formDataVerify = formDataVerify;

  // Handle composition start (for IME input)
  onCompositionStart() {
    this.isComposing = true;
  }

  onCompositionEnd(event: CompositionEvent) {
    this.isComposing = false;
    this.onInputChange(event);
  }

  /** Check if field has error **/
  errorClass(): { [key: string]: boolean } {
    const control = this.form.get(this.controlName);
    return {
      'error-border': !!(control?.invalid && control?.touched),
    };
  }

  /** Get input class **/
  getClass(): string {
    return this.loginPage ? `login-input ${this.class}` : this.class;
  }

  /** Restrict input based on type **/
  onInputChange(event: Event) {
    if (this.isComposing) return; // During composition, don't process

    const inputElement = event.target as HTMLInputElement;
    let newValue = inputElement.value;

    switch (this.restrict) {
      case 'half':
        // Only ASCII characters
        newValue = newValue.replace(/[^\u0000-\u007F]/g, '');
        break;

      case 'full':
        // Convert to full-width
        newValue = newValue.replace(/[!-~]/g, (char) => {
          return String.fromCharCode(char.charCodeAt(0) + 0xFEE0);
        });
        break;

      case 'num':
        // Numbers only
        newValue = newValue.replace(/[^\d]/g, '');
        break;
    
      case 'enNum':
        // English and numbers
        newValue = newValue.replace(/[^a-zA-Z0-9]/g, '');
        break;

      case 'enNumZh':
        // English, numbers, and Chinese
        newValue = newValue.replace(/[^a-zA-Z0-9\u4E00-\u9FFF]/g, '');
        break;

      case 'lowEnNum': 
        // Lowercase English and numbers
        newValue = newValue.replace(/[^a-z0-9]/g, '');
        break;

      case 'staffEUId':
        // Staff ID format
        newValue = newValue.replace(/[^A-Za-z0-9_.\-@$]/g, '');
        break;

      default: 
        break;
    }

    if (inputElement.value !== newValue) {
      inputElement.value = newValue;
      this.form.get(this.controlName)?.setValue(newValue);
    }
  }
}

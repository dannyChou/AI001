import AdminAPIApiService from '@apilib/api/AdminAPI/AdminAPI-api.service';
import { inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { formDataHasError, formDataVerify } from './form';
import { FormBuilder } from '@angular/forms';
import { FormStateService } from '@app/services/cache/formState.service';
import { TableStateService } from '@app/services/cache/tableState.service';
import { ExportService } from '@app/services/export.service';
import { DatePipe } from '@angular/common';
import { MemoryService } from '@app/services/cache/memory.service';

/**
 * Base Container Class
 * 
 * All feature components should extend this class to inherit common functionality.
 * Provides centralized service injections and utility methods.
 * 
 * Usage:
 * ```typescript
 * export class MyComponent extends BaseContainer {
 *   constructor() {
 *     super();
 *   }
 * }
 * ```
 */
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

  /** Form validation helpers **/
  formDataVerify = formDataVerify;
  formDataHasError = formDataHasError;

  /** Map dropdown option by value **/
  mapOption = (value: any, options: any[]) =>
    value ? options.find(item => item.value === value) : undefined;

  constructor() {
    this.route.data.subscribe((data) => {
      this._txid = this.route.snapshot.data['txid'] || '';
      this._lastSegment = this.route.snapshot.url.at(-1)?.path || null;
    });
  }

  /**
   * Format JSON for display with proper indentation
   * @param input JSON object or string
   * @param space Number of spaces for indentation (default: 2)
   * @returns Formatted JSON string
   */
  toPrettyJson(input: unknown, space: number = 2): string {
    if (input == null) return '';

    // Already an object
    if (typeof input === 'object') {
      try {
        return JSON.stringify(input, null, space);
      } catch {
        return String(input);
      }
    }
    
    // Is a string
    const s = String(input).trim();
    if (!s) return '';
    try {
      return JSON.stringify(JSON.parse(s), null, space);
    } catch {
      return s; // Not valid JSON, return as is
    }
  }
}

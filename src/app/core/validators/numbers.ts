import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function greaterThanZeroValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      
      return value && value <= 0 ? { 'greaterThanZero': { value } } : null;
    };
  }
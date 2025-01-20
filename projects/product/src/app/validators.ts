import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function decimalValidator(maxDecimals: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (value === null || value === '') {
      return null;
    }

    if (isNaN(value)) {
      return { invalidNumber: true };
    }

    const decimalPart = value.toString().split('.')[1];
    if (decimalPart && decimalPart.length > maxDecimals) {
      return {
        maxDecimals: {
          requiredDecimals: maxDecimals,
          actualDecimals: decimalPart.length,
        },
      };
    }

    return null;
  };
}

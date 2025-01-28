import { FormControl } from '@angular/forms';
import { decimalValidator } from './validators';

describe('decimalValidator', () => {
  it('should return null for empty or null values', () => {
    const validator = decimalValidator(2);

    const emptyControl = new FormControl('');
    const nullControl = new FormControl(null);

    expect(validator(emptyControl)).toBeNull();
    expect(validator(nullControl)).toBeNull();
  });

  it('should return { invalidNumber: true } for non-numeric values', () => {
    const validator = decimalValidator(2);

    const control = new FormControl('abc');

    expect(validator(control)).toEqual({ invalidNumber: true });
  });

  it('should return null for valid numbers within the decimal limit', () => {
    const validator = decimalValidator(2);

    const control = new FormControl('123.45');

    expect(validator(control)).toBeNull();
  });

  it('should return an error if the decimal part exceeds the limit', () => {
    const validator = decimalValidator(2);

    const control = new FormControl('123.456');

    expect(validator(control)).toEqual({
      maxDecimals: {
        requiredDecimals: 2,
        actualDecimals: 3,
      },
    });
  });

  it('should return null for integers', () => {
    const validator = decimalValidator(2);

    const control = new FormControl('123');

    expect(validator(control)).toBeNull();
  });
});

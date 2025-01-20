import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { ProductResolver } from './product.resolver';

describe('productResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) =>
    TestBed.runInInjectionContext(
      () => new ProductResolver(...resolverParameters),
    );

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});

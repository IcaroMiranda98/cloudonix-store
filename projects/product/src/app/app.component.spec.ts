import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { of, throwError } from 'rxjs';
import { ProductService } from '../services/product.service';
import { AppComponent } from './app.component';
import { Product } from './product';

let component: AppComponent;
let fixture: ComponentFixture<AppComponent>;
let mockProductService: jasmine.SpyObj<ProductService>;

const product: Product = {
  id: 1,
  name: 'Test Product',
  description: 'Test Description',
  sku: '12345',
  cost: 100,
  profile: { type: 'equipment', available: true, backlog: 10 },
};

describe('AppComponent', () => {
  beforeEach(async () => {
    mockProductService = jasmine.createSpyObj('ProductService', [
      'createProduct',
      'updateProduct',
      'getProduct',
    ]);

    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideAnimationsAsync(),
        { provide: ProductService, useValue: mockProductService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    fixture.componentRef.setInput('id', '');
    fixture.componentRef.setInput('isEditRoute', false);
    fixture.componentRef.setInput('title', 'Create item');
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should not call the create method when form is invalid', () => {
    spyOn(component, 'createProduct');
    component.submitForm();
    expect(component.createProduct).not.toHaveBeenCalled();
  });

  it('should initialize the form with default values', () => {
    const form = component.productForm;
    expect(form).toBeTruthy();
    expect(form.get('id')?.value).toBe(0);
    expect(form.get('name')?.value).toBe('');
    expect(form.get('description')?.value).toBe('');
    expect(form.get('sku')?.value).toBe('');
    expect(form.get('cost')?.value).toBeNull();
    expect(form.get('profile.type')?.value).toBe('furniture');
    expect(form.get('profile.available')?.value).toBeTrue();
  });

  it('should emit result on successful product creation', () => {
    spyOn(component.resultEmit, 'emit');
    mockProductService.createProduct.and.returnValue(of(product));

    component.productForm.setValue(product);
    component.submitForm();

    expect(mockProductService.createProduct).toHaveBeenCalled();
    expect(component.resultEmit.emit).toHaveBeenCalledWith({
      result: true,
      message: 'product created successfully!',
    });
  });

  it('should emit error result on failed product creation', () => {
    spyOn(component.resultEmit, 'emit');
    mockProductService.createProduct.and.returnValue(
      throwError(() => ({ error: { message: 'Creation failed' } })),
    );

    component.productForm.setValue(product);
    component.submitForm();

    expect(mockProductService.createProduct).toHaveBeenCalled();
    expect(component.resultEmit.emit).toHaveBeenCalledWith({
      result: false,
      message: 'Creation failed',
    });

    mockProductService.createProduct.and.returnValue(
      throwError(() => ({ error: {} })),
    );

    component.productForm.setValue(product);
    component.submitForm();

    expect(mockProductService.createProduct).toHaveBeenCalled();
    expect(component.resultEmit.emit).toHaveBeenCalledWith({
      result: false,
      message: 'An unexpected error occurred.',
    });
  });

  it('should increment backlog value', () => {
    const profile = component.productForm.get('profile');
    profile?.get('backlog')?.setValue(5);
    component.increment();
    expect(profile?.get('backlog')?.value).toBe(6);

    profile?.get('backlog')?.setValue(null);
    component.increment();
    expect(profile?.get('backlog')?.value).toBe(1);
  });

  it('should decrement backlog value', () => {
    const profile = component.productForm.get('profile');
    profile?.get('backlog')?.setValue(5);
    component.decrement();
    expect(profile?.get('backlog')?.value).toBe(4);

    profile?.get('backlog')?.setValue(null);
    component.decrement();
    expect(profile?.get('backlog')?.value).toBe(-1);
  });

  it('should add a profile property', () => {
    const property = 'newProperty';

    spyOn(window, 'prompt').and.returnValue(property);

    component.addNewProfileProperty();
    fixture.detectChanges();

    const profile = component.productForm.get('profile') as FormGroup;
    const inputElement = fixture.debugElement.nativeElement.querySelector(
      `input[id="${property}"]`,
    );
    expect(profile.contains(property)).toBeTrue();
    expect(inputElement).toBeTruthy();
    expect(inputElement.getAttribute('id')).toBe(property);
  });

  it('should remove a profile property', () => {
    const property = 'newProperty';

    spyOn(window, 'prompt').and.returnValue(property);
    component.addNewProfileProperty();

    fixture.detectChanges();

    const profile = component.productForm.get('profile') as FormGroup;
    let inputElement = fixture.debugElement.nativeElement.querySelector(
      `input[id="${property}"]`,
    );
    expect(profile.contains(property)).toBeTrue();
    expect(inputElement).toBeTruthy();
    expect(inputElement.getAttribute('id')).toBe(property);

    component.removeProfileProperty(0);
    fixture.detectChanges();

    inputElement = fixture.debugElement.nativeElement.querySelector(
      `input[id="${property}"]`,
    );

    expect(profile.contains(property)).toBeFalse();
    expect(inputElement).toBeNull();
    expect(component.profileProperties.length).toBe(0);
  });

  it('should issue an alert when a duplicate profile property is added', () => {
    const property = 'newProperty';

    spyOn(window, 'prompt').and.returnValue(property);
    spyOn(window, 'alert');

    component.addNewProfileProperty();
    fixture.detectChanges();

    const profile = component.productForm.get('profile') as FormGroup;
    const inputElement = fixture.debugElement.nativeElement.querySelector(
      `input[id="${property}"]`,
    );
    expect(profile.contains(property)).toBeTrue();
    expect(inputElement).toBeTruthy();
    expect(inputElement.getAttribute('id')).toBe(property);

    component.addNewProfileProperty();

    expect(window.alert).toHaveBeenCalledWith(
      `Property "${property}" already added!`,
    );
  });

  describe('AppComponent editing a product', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('isEditRoute', true);
      fixture.componentRef.setInput('title', 'Edit item');
    });

    it('should disable SKU control when isEditRoute is true', () => {
      fixture.componentRef.setInput('id', '1');
      mockProductService.getProduct.and.returnValue(of(product));
      fixture.detectChanges();
      expect(component.productForm.get('sku')?.disabled).toBeTrue();
    });

    it('should fetch product and load the form when id is set', () => {
      fixture.componentRef.setInput('id', '1');
      mockProductService.getProduct.and.returnValue(of(product));
      fixture.detectChanges();
      expect(mockProductService.getProduct).toHaveBeenCalledWith('1');
      expect(component.productForm.get('name')?.value).toBe('Test Product');
      expect(component.productForm.get('profile.type')?.value).toBe(
        'equipment',
      );
    });

    it('should emit an error result when service fails', () => {
      const errorResponse = {
        error: { message: 'Product not found' },
      };

      spyOn(component.resultEmit, 'emit');
      mockProductService.getProduct.and.returnValue(
        throwError(() => errorResponse),
      );

      component.fetchProduct('1');

      expect(component.resultEmit.emit).toHaveBeenCalledWith({
        result: false,
        message: 'Product not found',
      });

      mockProductService.getProduct.and.returnValue(
        throwError(() => ({ error: {} })),
      );
      component.fetchProduct('1');
      expect(component.resultEmit.emit).toHaveBeenCalledWith({
        result: false,
        message: 'An unexpected error occurred.',
      });
    });

    it('should fetch product and load the form when id is set', () => {
      fixture.componentRef.setInput('id', '1');
      mockProductService.getProduct.and.returnValue(of(product));
      fixture.detectChanges();
      expect(mockProductService.getProduct).toHaveBeenCalledWith('1');
      expect(component.productForm.get('name')?.value).toBe('Test Product');
      expect(component.productForm.get('profile.type')?.value).toBe(
        'equipment',
      );
    });

    it('should emit result on successful product update', () => {
      fixture.componentRef.setInput('id', '1');
      mockProductService.getProduct.and.returnValue(of(product));
      fixture.detectChanges();
      spyOn(component.resultEmit, 'emit');
      mockProductService.updateProduct.and.returnValue(of(product));
      component.submitForm();

      expect(mockProductService.updateProduct).toHaveBeenCalled();
      expect(component.resultEmit.emit).toHaveBeenCalledWith({
        result: true,
        message: 'Product updated successfully!',
      });
    });

    it('should emit error result on failed product update', () => {
      spyOn(component.resultEmit, 'emit');
      mockProductService.updateProduct.and.returnValue(
        throwError(() => ({ error: { message: 'Update failed' } })),
      );

      component.productForm.setValue(product);
      component.submitForm();

      expect(mockProductService.updateProduct).toHaveBeenCalled();
      expect(component.resultEmit.emit).toHaveBeenCalledWith({
        result: false,
        message: 'Update failed',
      });

      mockProductService.updateProduct.and.returnValue(
        throwError(() => ({ error: {} })),
      );

      component.productForm.setValue(product);
      component.submitForm();

      expect(mockProductService.updateProduct).toHaveBeenCalled();
      expect(component.resultEmit.emit).toHaveBeenCalledWith({
        result: false,
        message: 'An unexpected error occurred.',
      });
    });

    it('should call addProfileProperty for each filtered key', () => {
      const profile = {
        key1: 'value1',
        key2: 42,
        type: 'furniture',
        available: true,
      };
      spyOn(component, 'addProfileProperty');

      component.loadDynamicFormgroup(profile);

      expect(component.addProfileProperty).toHaveBeenCalledWith(
        'key1',
        'value1',
      );
      expect(component.addProfileProperty).toHaveBeenCalledWith('key2', 42);
      expect(component.addProfileProperty).not.toHaveBeenCalledWith(
        'type',
        'furniture',
      );
      expect(component.addProfileProperty).not.toHaveBeenCalledWith(
        'available',
        true,
      );
    });

    it('should hide reset button when form is in editing mode', () => {
      fixture.detectChanges();
      const resetButton =
        fixture.debugElement.nativeElement.querySelector('#resetButton');
      expect(resetButton).toBeNull();
    });
  });

  describe('AppComponent form validation', () => {
    it('should show validation error when name is empty', () => {
      const nameControl = component.productForm.get('name');
      nameControl?.setValue('');
      nameControl?.markAsTouched();

      fixture.detectChanges();

      const errorElement =
        fixture.debugElement.nativeElement.querySelector('#nameError');
      expect(errorElement).toBeTruthy();
      expect(errorElement.textContent).toContain('Name is required');
    });

    it('should show validation error when cost is less than 0', () => {
      const costControl = component.productForm.get('cost');
      costControl?.setValue(-1);
      costControl?.markAsTouched();

      fixture.detectChanges();

      const errorElement =
        fixture.debugElement.nativeElement.querySelector('#costError');
      expect(errorElement).toBeTruthy();
      expect(errorElement.textContent).toContain('Cost must be greater than 0');
    });

    it('should show validation error when cost has more than two decimal places', () => {
      const costControl = component.productForm.get('cost');
      costControl?.setValue(10.123);
      costControl?.markAsTouched();

      fixture.detectChanges();

      const errorElement =
        fixture.debugElement.nativeElement.querySelector('#costError');
      expect(errorElement).toBeTruthy();
      expect(errorElement.textContent).toContain(
        'Cost must have a maximum of two decimal',
      );
    });
    it('should disable save button when form is invalid', () => {
      component.productForm.get('name')?.setValue('');
      fixture.detectChanges();

      const saveButton =
        fixture.debugElement.nativeElement.querySelector('#createButton');
      expect(saveButton.disabled).toBeTrue();
    });

    it('should reset the form when reset button is clicked', () => {
      component.productForm.get('name')?.setValue('Test');
      const resetButton =
        fixture.debugElement.nativeElement.querySelector('#resetButton');
      resetButton.click();

      expect(component.productForm.get('name')?.value).toBe(null);
    });

    it('should emit an empty message when cancel button is clicked', () => {
      spyOn(component.resultEmit, 'emit');
      component.productForm.get('name')?.setValue('Test');
      const resetButton =
        fixture.debugElement.nativeElement.querySelector('#cancelButton');
      resetButton.click();
      expect(component.resultEmit.emit).toHaveBeenCalledWith();
    });
  });
});

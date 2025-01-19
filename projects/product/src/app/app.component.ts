import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ProductService } from '../services/product.service';
import { Product } from './product';

@Component({
  selector: 'app-root',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
    FormsModule,
    MatIconModule,
    CommonModule,
    MatCardModule,
  ],
  templateUrl: './app.component.html',
  standalone: true,
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnChanges {
  @Input() id!: string;
  @Input() isEditRoute = false;
  @Input() title = '';
  @Output() resultEmit = new EventEmitter<object>();
  productForm: FormGroup;
  profileProperties: { key: string; value: string | number }[] = [];
  types = ['furniture', 'equipment', 'stationary', 'part'];

  private fb = inject(FormBuilder);
  private productService = inject(ProductService);

  constructor() {
    this.productForm = this._generateFormControls();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isEditRoute'] && this.isEditRoute) {
      this.productForm.controls['sku'].disable();
    }
    if (changes['id'] && this.id) {
      this.fetchProduct(this.id);
    }
  }

  private _generateFormControls() {
    return this.fb.group({
      id: [0, Validators.required],
      name: ['', Validators.required],
      description: ['', Validators.required],
      sku: ['', Validators.required],
      cost: [null, [Validators.required, Validators.min(0)]],
      profile: this.fb.group({
        type: ['furniture'],
        available: [true],
        backlog: [null],
      }),
    });
  }

  private _loadForm(product: Product) {
    this.productForm.patchValue(product);
  }

  private _filterProfile(profile: Record<string, string | number>) {
    const keysToRemove = ['available', 'type', 'backlog'];
    const keys = Object.keys(profile).filter(
      (key) => !keysToRemove.includes(key)
    );
    return keys;
  }

  removeProfileProperty(index: number) {
    const key = this.profileProperties[index].key;
    (this.productForm.get('profile') as FormGroup).removeControl(key);
    this.profileProperties.splice(index, 1);
  }
  addProfileProperty() {
    const key: string = prompt('Enter the key for the new property:')!;
    this._addProfileProperty(key);
  }

  private _addProfileProperty(key: string, value?: string | number) {
    const formGroup = this.productForm.get('profile') as FormGroup;
    if (key) {
      if (formGroup.contains(key) && !value) {
        alert(`Property "${key}" already added!`);
        return;
      }

      value = value ?? '';

      formGroup.addControl(key, this.fb.control(value, Validators.required));
      this.profileProperties.push({ key, value });
    }
  }
  submitForm() {
    if (this.productForm.invalid) {
      return;
    }

    if (this.isEditRoute) {
      this._updateProduct();
    } else {
      this._createProduct();
    }
  }

  private _createProduct() {
    this.productService.createProduct(this.productForm.value).subscribe({
      next: () => {
        this.resultEmit.emit({
          result: true,
          message: 'product created successfully!',
        });
      },
      error: (err) => {
        let errorMessage = '';
        if (err.error?.message) {
          errorMessage = err.error.message;
        } else {
          errorMessage = 'An unexpected error occurred.';
        }
        this.resultEmit.emit({
          result: false,
          message: errorMessage,
        });
      },
    });
  }

  private _updateProduct() {
    const updatedProduct = { ...this.productForm.value };
    //delete updatedProduct.sku;
    this.productService.updateProduct(updatedProduct).subscribe({
      next: () => {
        this.resultEmit.emit({
          result: true,
          message: 'Product updated successfully!',
        });
      },
      error: (err) => {
        let errorMessage = '';
        if (err.error?.message) {
          errorMessage = err.error.message;
        } else {
          errorMessage = 'An unexpected error occurred.';
        }
        this.resultEmit.emit({
          result: false,
          message: errorMessage,
        });
      },
    });
  }

  fetchProduct(id: string): void {
    if (this.id == undefined) {
      return;
    }

    this.productService.getProduct(id).subscribe({
      next: (product: Product) => {
        this.loadDynamicFormgroup(product.profile);
        this._loadForm(product);
      },
      error: (err) => {
        let errorMessage = '';
        if (err.error?.message) {
          errorMessage = err.error.message;
        } else {
          errorMessage = 'An unexpected error occurred.';
        }
        this.resultEmit.emit({
          result: false,
          message: errorMessage,
        });
      },
    });
  }

  loadDynamicFormgroup(profile: Record<string, string | number>) {
    const keys = this._filterProfile(profile);
    keys.forEach((key) => {
      this._addProfileProperty(key, profile[key]);
    });
  }

  cancel() {
    this.resultEmit.emit();
  }
}

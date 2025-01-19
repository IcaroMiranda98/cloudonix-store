import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
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
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Item } from './item';

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
  styleUrl: './app.component.scss',
})
export class AppComponent {
  @Input() item: Item;
  @Output() submit = new EventEmitter<{}>();
  itemForm: FormGroup;
  isEditRoute = false;
  profileProperties: { key: string; value: string }[] = [];
  types = ['furniture', 'equipment', 'stationary', 'part'];

  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);
  //private itemService = inject(ItemService);

  constructor() {
    this.itemForm = this._genereteFormControls();

    this.item = new Item(
      0, // id
      '', // name
      '', // description
      '', // sku
      0, // cost
      { type: 'furniture', available: true }
    );
  }

  private _genereteFormControls() {
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

  emitTest() {
    console.log(this.item);
    this.submit.emit(this.item);
  }

  private _loadForm(item: Item) {
    this.itemForm.patchValue(item);
  }

  private _filterProfile(profile: Record<string, string>) {
    const keysToRemove = ['available', 'type', 'backlog'];
    const keys = Object.keys(profile).filter(
      (key) => !keysToRemove.includes(key)
    );
    return keys;
  }

  removeProfileProperty(index: number) {
    const key = this.profileProperties[index].key;
    (this.itemForm.get('profile') as FormGroup<any>).removeControl(key);
    this.profileProperties.splice(index, 1);
  }
  addProfileProperty() {
    const key: string = prompt('Enter the key for the new property:')!;
    this._addProfileProperty(key);
  }

  private _addProfileProperty(key: string, value?: string) {
    const formGroup = this.itemForm.get('profile') as FormGroup;
    if (key) {
      if (formGroup.contains(key) && !value) {
        const snackBarRef = this.snackBar.open(
          `Property "${key}" alredy added!`,
          'teste',
          {
            duration: 1000,
          }
        );

        snackBarRef.onAction().subscribe(() => {
          console.log('@@@@@@@@@@');
          snackBarRef.dismiss(); // Fecha o snackbar manualmente
        });
        return;
      }

      value = value ?? '';

      formGroup.addControl(key, this.fb.control(value, Validators.required));
      this.profileProperties.push({ key, value });
    }
  }
  submitForm() {
    if (this.itemForm.invalid) {
      return;
    }
    if (!this.isEditRoute) {
      this._createItem();
    } else {
      this._updateItem();
    }
  }

  private _createItem() {
    /*this.itemService.createItem(this.itemForm.value).subscribe({
      next: (item) => {
        this.snackBar.open('Item created successfully!', 'Close', {
          duration: 3000,
        });
        this.router.navigate(['']);
      },
      error: (err) => {
        this.snackBar.open('Error creating item', 'Close', { duration: 3000 });
      },
    });*/
  }

  private _updateItem() {
    const updatedItem = { ...this.itemForm.value };
    delete updatedItem.sku;
    console.log(updatedItem);
    /*this.itemService.updateItem(updatedItem).subscribe({
      next: (item) => {
        this.snackBar.open('Item updated successfully!', 'Close', {
          duration: 3000,
        });
        this.router.navigate(['']);
      },
      error: (err) => {
        this.snackBar.open('Error updating item', 'Close', { duration: 3000 });
      },
    });*/
  }
}

import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
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
import { Router, RouterModule } from '@angular/router';
import { ItemService } from '../../../core/services/item.service';
import { ContainerComponent } from '../../../shared/container/container.component';

@Component({
  selector: 'app-item-create',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
    RouterModule,
    FormsModule,
    MatIconModule,
    CommonModule,
    ContainerComponent,
    MatCardModule,
  ],
  templateUrl: './item-create.component.html',
  styleUrls: ['./item-create.component.scss'],
})
export class ItemCreateComponent {
  itemForm: FormGroup;
  profileProperties: { key: string; value: string }[] = [];
  types = ['furniture', 'equipment', 'stationary', 'part'];

  private itemService = inject(ItemService);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  constructor() {
    this.itemForm = this.fb.group({
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

  addProfileProperty() {
    const key = prompt('Enter the key for the new property:');
    if (key) {
      (this.itemForm.get('profile') as FormGroup<any>).addControl(
        key,
        this.fb.control('', Validators.required)
      );

      this.profileProperties.push({ key, value: '' });
    }
  }

  removeProfileProperty(index: number) {
    this.profileProperties.splice(index, 1);
  }

  submitForm() {
    if (this.itemForm.invalid) {
      return;
    }

    const formData = this.itemForm.value;
    console.log(formData);
    /*const newItem: Item = {
      ...formData,
      profile: {
        ...formData.profile,
        customProperties: this.profileProperties.reduce((acc, prop) => {
          acc[prop.key] = prop.value;
          return acc;
        }, {}),
      },
    };

    console.log(newItem);

    this.itemService.createItem(newItem).subscribe({
      next: (item) => {
        this.snackBar.open('Item created successfully!', 'Close', {
          duration: 3000,
        });
        this.router.navigate(['/items']);
      },
      error: (err) => {
        this.snackBar.open('Error creating item', 'Close', { duration: 3000 });
      },
    });*/
  }
}

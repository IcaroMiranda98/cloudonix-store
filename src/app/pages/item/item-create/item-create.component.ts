import { CommonModule } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
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
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterModule,
} from '@angular/router';
import { ItemService } from '../../../core/services/item.service';
import { Item } from '../../../core/types/types';
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
    RouterLink,
  ],
  templateUrl: './item-create.component.html',
  styleUrls: ['./item-create.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ItemCreateComponent implements OnInit {
  @Input() readonly: boolean = false;
  @Input() item?: Item;
  @Output() itemEmitter: EventEmitter<Item> = new EventEmitter<Item>();
  id?: string;
  itemForm: FormGroup;
  isEditRoute = false;
  profileProperties: { key: string; value: string }[] = [];
  types = ['furniture', 'equipment', 'stationary', 'part'];
  private route = inject(ActivatedRoute);
  private itemService = inject(ItemService);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  teste($event: any) {
    console.log($event.detail);
  }

  constructor() {
    this.itemForm = this._genereteFormControls();
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

  ngOnInit(): void {
    this.item = this.route.snapshot.data['product'];
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;
    this.id = id;
    this.item = this.route.snapshot.data['product'];
    this.loadDynamicFormgroup(this.item!.profile);
    this._loadForm(this.item!);
    //this.fetchItem(this.route.snapshot.paramMap.get('id')!);

    const currentRoute = this.route.snapshot.routeConfig?.path;
    if (currentRoute === 'item/edit/:id') {
      this.isEditRoute = true;
    }
  }

  addProfileProperty() {
    const key: string = prompt('Enter the key for the new property:')!;
    this._addProfileProperty(key);
  }

  private _addProfileProperty(key: string, value?: string) {
    const formGroup = this.itemForm.get('profile') as FormGroup;
    if (key) {
      if (formGroup.contains(key) && !value) {
        this.snackBar.open(`Property "${key}" alredy added!`, 'Close', {
          duration: 3000,
        });
        return;
      }

      value = value ?? '';

      formGroup.addControl(key, this.fb.control(value, Validators.required));
      this.profileProperties.push({ key, value });
    }
  }

  removeProfileProperty(index: number) {
    const key = this.profileProperties[index].key;
    (this.itemForm.get('profile') as FormGroup<any>).removeControl(key);
    this.profileProperties.splice(index, 1);
  }

  submitForm() {
    if (this.itemForm.invalid) {
      return;
    }
    this.itemEmitter.emit(this.itemForm.value);
    if (!this.isEditRoute) {
      this._createItem();
    } else {
      this._updateItem();
    }
  }

  private _createItem() {
    this.itemService.createItem(this.itemForm.value).subscribe({
      next: (item) => {
        this.snackBar.open('Item created successfully!', 'Close', {
          duration: 3000,
        });
        this.router.navigate(['']);
      },
      error: (err) => {
        this.snackBar.open('Error creating item', 'Close', { duration: 3000 });
      },
    });
  }

  private _updateItem() {
    const updatedItem = { ...this.itemForm.value };
    delete updatedItem.sku;
    console.log(updatedItem);
    this.itemService.updateItem(updatedItem).subscribe({
      next: (item) => {
        this.snackBar.open('Item updated successfully!', 'Close', {
          duration: 3000,
        });
        this.router.navigate(['']);
      },
      error: (err) => {
        this.snackBar.open('Error updating item', 'Close', { duration: 3000 });
      },
    });
  }

  submitFormUpdate() {
    if (this.itemForm.invalid) {
      return;
    }
    this.itemEmitter.emit(this.itemForm.value);
    this.itemService.createItem(this.itemForm.value).subscribe({
      next: (item) => {
        this.snackBar.open('Item created successfully!', 'Close', {
          duration: 3000,
        });
        this.router.navigate(['/items']);
      },
      error: (err) => {
        this.snackBar.open('Error creating item', 'Close', { duration: 3000 });
      },
    });
  }

  loadDynamicFormgroup(profile: Record<string, string>) {
    const keys = this._filterProfile(profile);
    keys.forEach((key) => {
      this._addProfileProperty(key, profile[key]);
    });
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

  fetchItem(id: string): void {
    this.itemService.getItem(id).subscribe({
      next: (item: Item) => {
        this.item = item;
        this.loadDynamicFormgroup(item.profile);
        this._loadForm(this.item);
      },
      error: (error) => {
        console.error('Error loading item:', error);
      },
    });
  }
}

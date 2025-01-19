import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, ViewChild, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../core/types/types';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';
import { CardItemComponent } from './card-item/card-item.component';

@Component({
  selector: 'app-product-list-card',
  imports: [
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
    MatCardModule,
    CommonModule,
    CardItemComponent,
  ],
  templateUrl: './product-list-card.component.html',
  styleUrl: './product-list-card.component.scss',
  standalone: true,
})
export class ProductListCardComponent implements OnDestroy, OnInit {
  dataSource = new MatTableDataSource<Product>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  items$?: Observable<Product[]>;

  private itemService = inject(ProductService);

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    this.fetchItems();
    this.dataSource.paginator = this.paginator;
  }

  fetchItems(): void {
    this.itemService.getProducts().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.items$ = this.dataSource.connect();

        if (this.paginator) {
          this.dataSource.paginator = this.paginator;
        }
      },
      error: (error) => {
        return error;
      },
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  deleteItem(item: Product): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: `Are you sure you want to delete ${item.name}?` },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.itemService.deleteProduct(item.id).subscribe({
          next: () => {
            this.removeItemFromTableDataSource(item.id);
          },
          error: (error) => {
            return error;
          },
        });
      }
    });
  }

  private removeItemFromTableDataSource(id: number) {
    const index = this.dataSource.data.findIndex((i) => i.id === id);
    this.dataSource.data.splice(index, 1);
    this.dataSource._updateChangeSubscription();
  }

  ngOnDestroy() {
    if (this.dataSource) {
      this.dataSource.disconnect();
    }
  }
}

import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../core/types/types';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-product-list-table',
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    CurrencyPipe,
    MatTooltipModule,
    RouterLink,
    CommonModule,
  ],
  templateUrl: './product-list-table.component.html',
  styleUrl: './product-list-table.component.scss',
  standalone: true,
})
export class ProductListTableComponent {
  dataSource = new MatTableDataSource<Product>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  displayedColumns: string[] = ['Index', 'SKU', 'Name', 'Price', 'Actions'];

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

        if (this.paginator) {
          this.dataSource.paginator = this.paginator;
        }
      },
      error: (error) => {},
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
          error: (error) => {},
        });
      }
    });
  }

  private removeItemFromTableDataSource(id: number) {
    const index = this.dataSource.data.findIndex((i) => i.id === id);
    this.dataSource.data.splice(index, 1);
    this.dataSource._updateChangeSubscription();
  }
}

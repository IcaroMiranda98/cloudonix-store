import { CurrencyPipe } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, RouterLink } from '@angular/router';
import { ItemService } from '../../core/services/item.service';
import { Item } from '../../core/types/types';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { ContainerComponent } from '../../shared/container/container.component';

@Component({
  selector: 'app-home',
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    CurrencyPipe,
    MatTooltipModule,
    ContainerComponent,
    RouterLink,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  standalone: true,
})
export class HomeComponent {
  displayedColumns: string[] = ['Index', 'SKU', 'Name', 'Price', 'Actions'];
  dataSource = new MatTableDataSource<Item>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  private itemService = inject(ItemService);
  private router = inject(Router);

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    this.fetchItems();
  }

  fetchItems(): void {
    this.itemService.getItems().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        console.log('Items loaded:', data);

        if (this.paginator) {
          this.dataSource.paginator = this.paginator;
        }
      },
      error: (error) => {
        console.error('Error loading products:', error);
      },
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  editItem(item: Item) {
    this.router.navigate([`/item/edit/${item.id}`]);
  }

  deleteItem(item: Item): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: `Are you sure you want to delete ${item.name}?` },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.itemService.deleteItem(item.id).subscribe({
          next: () => {
            console.log('Item deleted successfully');
            this.removeItemFromTableDataSource(item.id);
          },
          error: (error) => {
            console.error('Error deleting item:', error);
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
}

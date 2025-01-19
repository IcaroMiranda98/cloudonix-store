import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, inject, OnDestroy, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { ItemService } from '../../../core/services/item.service';
import { Item } from '../../../core/types/types';
import { CardItemComponent } from '../../../shared/card-item/card-item.component';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';
import { ContainerComponent } from '../../../shared/container/container.component';

@Component({
  selector: 'app-product-list-card',
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
    MatCardModule,
    CommonModule,
    CardItemComponent,
  ],
  templateUrl: './product-list-card.component.html',
  styleUrl: './product-list-card.component.scss',
  standalone: true,
})
export class ProductListCardComponent implements OnDestroy {
  dataSource = new MatTableDataSource<Item>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  items$?: Observable<Item[]>;

  private itemService = inject(ItemService);
  private router = inject(Router);

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    this.fetchItems();
    this.dataSource.paginator = this.paginator;
  }

  fetchItems(): void {
    this.itemService.getItems().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.items$ = this.dataSource.connect();

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

  ngOnDestroy() {
    if (this.dataSource) {
      this.dataSource.disconnect();
    }
  }
}

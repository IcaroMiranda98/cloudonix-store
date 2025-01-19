import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { Item } from '../../core/types/types';

@Component({
  selector: 'app-card-item',
  imports: [
    MatCardModule,
    MatButtonModule,
    CommonModule,
    MatIconModule,
    RouterLink,
  ],
  templateUrl: './card-item.component.html',
  styleUrl: './card-item.component.scss',
})
export class CardItemComponent {
  @Input() product!: Item;
  @Output() cardDeleteEmitter = new EventEmitter<Item>();

  private router = inject(Router);

  /*editProduct() {
    this.router.navigate([`/item/edit/${this.product.id}`]);
  }*/

  deleteProduct(): void {
    this.cardDeleteEmitter.emit(this.product);
  }
}

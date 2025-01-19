import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { Product } from '../../../../core/types/types';

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
  @Input() product!: Product;
  @Output() cardDeleteEmitter = new EventEmitter<Product>();

  deleteProduct(): void {
    this.cardDeleteEmitter.emit(this.product);
  }
}

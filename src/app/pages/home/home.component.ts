import { Component, OnInit } from '@angular/core';
import { ProductListCardComponent } from '../product/product-list-card/product-list-card.component';
import { ProductListTableComponent } from '../product/product-list-table/product-list-table.component';
@Component({
  selector: 'app-home',
  imports: [ProductListCardComponent, ProductListTableComponent],
  templateUrl: './home.component.html',
  standalone: true,
})
export class HomeComponent implements OnInit {
  isLargeScreen = window.innerWidth > 768;

  ngOnInit(): void {
    window.addEventListener('resize', () => {
      this.isLargeScreen = window.innerWidth > 768;
    });
  }
}

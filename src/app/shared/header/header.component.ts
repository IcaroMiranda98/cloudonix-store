import { Component, EventEmitter, inject, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router } from '@angular/router';
import { TokenService } from '../../core/services/token.service';
import { ContainerComponent } from '../container/container.component';

@Component({
  selector: 'app-header',
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    ContainerComponent,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  @Output() authChanged: EventEmitter<boolean> = new EventEmitter<boolean>();

  tokenService = inject(TokenService);
  router = inject(Router);
  logout(): void {
    this.tokenService.clearToken();
    this.router.navigate(['/auth']);
    this.authChanged.emit(false);
    console.log('User logged out');
  }
}

import { Component, inject } from '@angular/core';
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
  standalone: true,
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  tokenService = inject(TokenService);
  router = inject(Router);
  logout(): void {
    this.tokenService.clearToken();
    this.router.navigate(['/auth']);
  }
}

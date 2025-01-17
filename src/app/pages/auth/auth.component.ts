import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { TokenService } from '../../core/services/token.service';

@Component({
  selector: 'app-auth',
  imports: [
    MatCardModule,
    MatFormFieldModule,
    FormsModule,
    MatButtonModule,
    MatInputModule,
  ],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
})
export class AuthComponent {
  authKey: string = '';
  private tokenService = inject(TokenService);
  private router = inject(Router);

  onSubmit(): void {
    if (this.authKey) {
      this.tokenService.saveToken(this.authKey);
      console.log('Authorization Key:', this.authKey);
      this.router.navigate(['/items']);
      // Perform your authentication logic here
    } else {
      console.error('Authorization Key is required!');
    }
  }
}

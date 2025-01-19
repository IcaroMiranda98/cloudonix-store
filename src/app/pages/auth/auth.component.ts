import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
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
    ReactiveFormsModule,
  ],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
})
export class AuthComponent {
  authKey: string = '';
  private tokenService = inject(TokenService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  authForm: FormGroup;

  constructor() {
    this.authForm = this.fb.group({
      key: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.authForm.valid) {
      this.tokenService.saveToken(this.authForm.value.key);
      this.router.navigate(['']);
    }
  }
}

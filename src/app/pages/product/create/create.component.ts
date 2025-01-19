import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create',
  imports: [],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CreateComponent {
  id = '';
  title = 'Create a new item';
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  productResultProcess($event: any) {
    if (!$event.detail) {
      this.router.navigate(['']);
      return;
    }

    if ($event.detail.result) {
      this.snackBar.open($event.detail.message, 'Close', {
        duration: 3000,
      });
      this.router.navigate(['']);
    } else {
      this.snackBar.open($event.detail.message, 'Close', {
        duration: 3000,
      });
    }
    this.router.navigate(['']);
  }
}

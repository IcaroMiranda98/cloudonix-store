import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ContainerComponent } from '../../../shared/container/container.component';

@Component({
  selector: 'app-create',
  imports: [ContainerComponent],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CreateComponent {
  id: string = '';
  title: string = 'Create a new item';
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);

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

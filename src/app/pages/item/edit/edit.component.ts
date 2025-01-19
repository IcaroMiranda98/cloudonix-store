import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  OnInit,
} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { ContainerComponent } from '../../../shared/container/container.component';

@Component({
  selector: 'app-edit',
  imports: [ContainerComponent],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class EditComponent implements OnInit {
  id: string = '3';
  title: string = 'Edit item';
  private route = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;
    this.id = id;
  }

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

import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  OnInit,
} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-edit',
  imports: [],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class EditComponent implements OnInit {
  id = '';
  title = 'Edit item';
  private route = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;
    this.id = id;
  }

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

export interface ProductWComponentMsg {
  result: boolean;
  message: string;
}

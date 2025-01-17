import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button'; // Para botões no diálogo
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.scss',
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string }
  ) {}

  onConfirm(): void {
    this.dialogRef.close(true); // Fecha o diálogo e retorna "true"
  }

  onCancel(): void {
    this.dialogRef.close(false); // Fecha o diálogo e retorna "false"
  }
}

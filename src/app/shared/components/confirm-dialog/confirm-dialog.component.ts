import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule],
  template: `
    <div class="confirm-dialog">
      <h2>{{ data.title }}</h2>
      <p>{{ data.message }}</p>
      <div class="actions">
        <button mat-button (click)="onCancel()">Cancel</button>
        <button mat-flat-button [color]="data.confirmColor || 'primary'" (click)="onConfirm()">
          {{ data.confirmText || 'Confirm' }}
        </button>
      </div>
    </div>
  `,
  styles: [`
    .confirm-dialog { padding: 24px; }
    h2 { margin: 0 0 8px; font-size: 18px; }
    p { margin: 0 0 24px; color: #6b7280; font-size: 14px; }
    .actions { display: flex; justify-content: flex-end; gap: 8px; }
  `],
})
export class ConfirmDialogComponent {
  dialogRef = inject(MatDialogRef);
  data = inject<{ title: string; message: string; confirmText?: string; confirmColor?: string }>(MAT_DIALOG_DATA);

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }
}

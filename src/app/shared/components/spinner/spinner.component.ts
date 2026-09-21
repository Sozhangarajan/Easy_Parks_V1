import { Component, input } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [MatSpinner],
  template: `
    <div class="spinner-overlay" [class.fullscreen]="fullscreen()">
      <mat-spinner [diameter]="diameter()"></mat-spinner>
      @if (message()) {
        <p class="spinner-message">{{ message() }}</p>
      }
    </div>
  `,
  styles: [`
    .spinner-overlay {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 24px;
    }
    .spinner-overlay.fullscreen {
      position: fixed;
      inset: 0;
      background: rgba(255, 255, 255, 0.8);
      z-index: 9999;
    }
    .spinner-message {
      margin-top: 12px;
      color: #6b7280;
      font-size: 14px;
    }
  `],
})
export class SpinnerComponent {
  fullscreen = input(false);
  diameter = input(40);
  message = input('');
}

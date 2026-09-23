import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-spinner-overlay',
  standalone: true,
  imports: [MatIconModule],
  template: `
    <div class="overlay">
      <div class="spinner-ring"></div>
      <p>{{ message() }}</p>
    </div>
  `,
  styles: [`
    .overlay {
      position: fixed;
      inset: 0;
      background: rgba(11, 47, 74, 0.55);
      backdrop-filter: blur(4px);
      z-index: 9999;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 16px;
    }
    .spinner-ring {
      width: 44px;
      height: 44px;
      border: 4px solid rgba(255,255,255,0.25);
      border-top-color: #f2c94c;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    p { color: white; font-size: 14px; font-weight: 600; margin: 0; font-family: 'Poppins', sans-serif; }
  `],
})
export class SpinnerOverlayComponent {
  message = input('Loading...');
}

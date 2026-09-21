import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [MatIconModule],
  template: `
    <div class="empty-state">
      <mat-icon class="empty-icon">{{ icon() }}</mat-icon>
      <h3 class="empty-title">{{ title() }}</h3>
      <p class="empty-message">{{ message() }}</p>
    </div>
  `,
  styles: [`
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 48px 24px;
      text-align: center;
    }
    .empty-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      color: #d1d5db;
      margin-bottom: 16px;
    }
    .empty-title {
      margin: 0 0 8px;
      font-size: 18px;
      font-weight: 500;
      color: #1a1a1a;
    }
    .empty-message {
      margin: 0;
      font-size: 14px;
      color: #6b7280;
      max-width: 280px;
    }
  `],
})
export class EmptyStateComponent {
  icon = input('inbox');
  title = input('Nothing here');
  message = input('No data to display');
}

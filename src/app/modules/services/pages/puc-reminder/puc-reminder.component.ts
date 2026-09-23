import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { SpinnerComponent } from '../../../../shared/components/spinner/spinner.component';

@Component({
  selector: 'app-puc-reminder',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, SpinnerComponent],
  templateUrl: './puc-reminder.component.html',
  styleUrls: ['./puc-reminder.component.css'],
})
export class PucReminderComponent {
  loading = signal(false);
  saved = signal(false);

  vehicleNo = '';
  pucNo = '';
  expiryDate = '';
  center = '';

  centers = [
    { value: 'govt', label: 'Govt. Center', icon: 'account_balance', color: '#0f766e' },
    { value: 'private', label: 'Private Center', icon: 'storefront', color: '#b45309' },
    { value: 'mobile', label: 'Mobile Van', icon: 'local_shipping', color: '#7c3aed' },
  ];
  selectedCenter = 'govt';

  daysLeft = computed(() => {
    if (!this.expiryDate) return null;
    const diff = new Date(this.expiryDate).getTime() - Date.now();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  });

  selectedCenterObj = computed(
    () => this.centers.find((c) => c.value === this.selectedCenter) ?? this.centers[0]
  );

  goBack(): void {
    window.history.back();
  }

  save(): void {
    if (!this.vehicleNo.trim() || !this.expiryDate) return;
    this.loading.set(true);
    setTimeout(() => {
      this.loading.set(false);
      this.saved.set(true);
      setTimeout(() => this.saved.set(false), 3000);
    }, 900);
  }
}

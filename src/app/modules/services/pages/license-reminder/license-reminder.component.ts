import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { SpinnerComponent } from '../../../../shared/components/spinner/spinner.component';

@Component({
  selector: 'app-license-reminder',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, SpinnerComponent],
  templateUrl: './license-reminder.component.html',
  styleUrls: ['./license-reminder.component.css'],
})
export class LicenseReminderComponent {
  loading = signal(false);
  saved = signal(false);

  licenseNo = '';
  holderName = '';
  expiryDate = '';

  states = [
    { code: 'TN', name: 'Tamil Nadu', color: '#0f766e' },
    { code: 'KA', name: 'Karnataka', color: '#b45309' },
    { code: 'KL', name: 'Kerala', color: '#15803d' },
    { code: 'MH', name: 'Maharashtra', color: '#b91c1c' },
    { code: 'DL', name: 'Delhi', color: '#1d4ed8' },
    { code: 'TS', name: 'Telangana', color: '#7c3aed' },
    { code: 'AP', name: 'Andhra Pradesh', color: '#c2410c' },
    { code: 'GJ', name: 'Gujarat', color: '#0e7490' },
    { code: 'RJ', name: 'Rajasthan', color: '#be185d' },
    { code: 'UP', name: 'Uttar Pradesh', color: '#4338ca' },
    { code: 'WB', name: 'West Bengal', color: '#166534' },
    { code: 'MP', name: 'Madhya Pradesh', color: '#a16207' },
  ];
  selectedState = 'TN';

  daysLeft = computed(() => {
    if (!this.expiryDate) return null;
    const diff = new Date(this.expiryDate).getTime() - Date.now();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  });

  selectedStateName = computed(
    () => this.states.find((s) => s.code === this.selectedState)?.name ?? ''
  );

  constructor() {}

  goBack(): void {
    window.history.back();
  }

  selectState(code: string): void {
    this.selectedState = code;
  }

  save(): void {
    if (!this.licenseNo.trim() || !this.expiryDate) return;
    this.loading.set(true);
    setTimeout(() => {
      this.loading.set(false);
      this.saved.set(true);
      setTimeout(() => this.saved.set(false), 3000);
    }, 900);
  }
}

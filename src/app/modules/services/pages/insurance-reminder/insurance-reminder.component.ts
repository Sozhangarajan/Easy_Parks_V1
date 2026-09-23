import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { SpinnerComponent } from '../../../../shared/components/spinner/spinner.component';

@Component({
  selector: 'app-insurance-reminder',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, SpinnerComponent],
  templateUrl: './insurance-reminder.component.html',
  styleUrls: ['./insurance-reminder.component.css'],
})
export class InsuranceReminderComponent {
  loading = signal(false);
  saved = signal(false);

  vehicleNo = '';
  policyNo = '';
  insurer = 'icici';
  expiryDate = '';
  premium = '';

  insurers = [
    { value: 'icici', label: 'ICICI Lombard', initials: 'ICICI', color: '#e8541c' },
    { value: 'hdfc', label: 'HDFC ERGO', initials: 'HDFC', color: '#004c97' },
    { value: 'bajaj', label: 'Bajaj Allianz', initials: 'BAJ', color: '#c8102e' },
    { value: 'tata', label: 'Tata AIG', initials: 'TATA', color: '#005eb8' },
    { value: 'iffco', label: 'IFFCO Tokio', initials: 'IFFCO', color: '#00893e' },
    { value: 'newindia', label: 'New India', initials: 'NEWI', color: '#00529b' },
  ];

  daysLeft = computed(() => {
    if (!this.expiryDate) return null;
    const diff = new Date(this.expiryDate).getTime() - Date.now();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  });

  selectedInsurer = computed(
    () => this.insurers.find((i) => i.value === this.insurer) ?? this.insurers[0]
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

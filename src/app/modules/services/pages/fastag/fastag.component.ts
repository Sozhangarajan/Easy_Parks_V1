import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { SpinnerComponent } from '../../../../shared/components/spinner/spinner.component';

type Step = 'vehicle' | 'bank' | 'amount';

@Component({
  selector: 'app-fastag',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, SpinnerComponent],
  templateUrl: './fastag.component.html',
  styleUrls: ['./fastag.component.css'],
})
export class FastagComponent {
  step = signal<Step>('vehicle');

  vehicleNo = '';
  operator: string | null = null;
  bankSearch = '';
  showAllBanks = false;

  verifying = signal(false);
  loading = signal(false);
  paid = signal(false);
  balance = signal(230);
  amount = 500;

  amounts = [100, 200, 500, 1000, 2000];
  operators = [
    { value: 'hdfc', label: 'HDFC Bank', initials: 'HD', color: '#004b8d' },
    { value: 'icici', label: 'ICICI Bank', initials: 'IC', color: '#b72b2f' },
    { value: 'axis', label: 'Axis Bank', initials: 'AX', color: '#1a3c6e' },
    { value: 'sbi', label: 'SBI FASTag', initials: 'SB', color: '#22409a' },
    { value: 'idfc', label: 'IDFC First', initials: 'ID', color: '#9d1d44' },
    { value: 'kotak', label: 'Kotak Bank', initials: 'KM', color: '#ed3237' },
    { value: 'hdfc2', label: 'HDFC ERGO', initials: 'HE', color: '#0d7c66' },
    { value: 'yes', label: 'Yes Bank', initials: 'YS', color: '#005da4' },
    { value: 'pnbb', label: 'PNB FASTag', initials: 'PN', color: '#e05a1c' },
    { value: 'bob', label: 'Bank of Baroda', initials: 'BO', color: '#f26522' },
    { value: 'canara', label: 'Canara Bank', initials: 'CA', color: '#00854a' },
    { value: 'union', label: 'Union Bank', initials: 'UB', color: '#e31e24' },
    { value: 'indus', label: 'IndusInd Bank', initials: 'IN', color: '#7a1e4a' },
    { value: 'federal', label: 'Federal Bank', initials: 'FB', color: '#0d4d9c' },
    { value: 'karur', label: 'Karur Vysya', initials: 'KV', color: '#1a6b3c' },
    { value: 'city', label: 'City Union', initials: 'CU', color: '#d4a017' },
  ];

  constructor(private router: Router) { }

  get selectedOperator() {
    return this.operators.find((o) => o.value === this.operator) || null;
  }

  get filteredOperators() {
    const q = this.bankSearch.trim().toLowerCase();
    if (!q) return this.showAllBanks ? this.operators : this.popularBanks;
    return this.operators.filter(
      (o) => o.label.toLowerCase().includes(q) || o.initials.toLowerCase().includes(q)
    );
  }

  get popularBanks() {
    return this.operators.slice(0, 8);
  }

  clearBankSearch(): void {
    this.bankSearch = '';
  }

  toggleShowAll(): void {
    this.showAllBanks = !this.showAllBanks;
  }

  isVehicleValid(): boolean {
    return this.vehicleNo.trim().length >= 4;
  }

  goBack(): void {
    window.history.back();
  }

  // ---- Step 1: Vehicle number ----
  continueFromVehicle(): void {
    if (!this.isVehicleValid()) return;
    this.step.set('bank');
  }

  // ---- Step 2: Bank selection ----
  selectBank(value: string): void {
    this.operator = value;
  }

  trackByValue(_i: number, op: { value: string }): string {
    return op.value;
  }

  editVehicle(): void {
    this.step.set('vehicle');
  }

  verifyBank(): void {
    if (!this.operator) return;
    this.verifying.set(true);
    setTimeout(() => {
      this.verifying.set(false);
      this.step.set('amount');
    }, 1200);
  }

  // ---- Step 3: Recharge ----
  changeBank(): void {
    this.step.set('bank');
  }

  recharge(): void {
    if (!this.vehicleNo.trim()) return;
    this.loading.set(true);
    setTimeout(() => {
      this.balance.update((b) => b + this.amount);
      this.loading.set(false);
      this.paid.set(true);
      setTimeout(() => this.paid.set(false), 3000);
    }, 900);
  }
}
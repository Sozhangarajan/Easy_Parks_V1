import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { SpinnerOverlayComponent } from './spinner-overlay.component';

interface Challan {
  id: string;
  reason: string;
  location: string;
  date: string;
  amount: number;
  status: 'pending' | 'paid' | 'disputed';
  authority: string;
}

@Component({
  selector: 'app-challan-check',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, SpinnerOverlayComponent],
  templateUrl: './challan-check.component.html',
  styleUrls: ['./challan-check.component.css'],
})
export class ChallanCheckComponent {
  vehicleNo = '';
  searched = signal(false);
  loading = signal(false);
  payingId = signal<string | null>(null);
  filter = signal<'all' | 'pending' | 'paid'>('all');

  challans = signal<Challan[]>([
    {
      id: 'CH-2024-88123',
      reason: 'Speeding (40 km/h over limit)',
      location: 'NH-48, Gurgaon',
      date: '12 Jan 2026',
      amount: 150,
      status: 'pending',
      authority: 'Traffic Police',
    },
    {
      id: 'CH-2024-77451',
      reason: 'No Helmet / Seatbelt',
      location: 'MG Road, Bengaluru',
      date: '28 Dec 2025',
      amount: 100,
      status: 'pending',
      authority: 'Traffic Police',
    },
    {
      id: 'CH-2024-66102',
      reason: 'Illegal Parking',
      location: 'T. Nagar, Chennai',
      date: '15 Nov 2025',
      amount: 200,
      status: 'paid',
      authority: 'City Police',
    },
    {
      id: 'CH-2024-55290',
      reason: 'Red Light Jump',
      location: 'Connaught Place, Delhi',
      date: '02 Oct 2025',
      amount: 500,
      status: 'paid',
      authority: 'Traffic Police',
    },
    {
      id: 'CH-2024-44188',
      reason: 'Overloading',
      location: 'ECR, Chennai',
      date: '20 Sep 2025',
      amount: 300,
      status: 'disputed',
      authority: 'RTO',
    },
  ]);

  filters = [
    { value: 'all' as const, label: 'All', icon: 'list', color: '#12587a' },
    { value: 'pending' as const, label: 'Pending', icon: 'pending_actions', color: '#ef4444' },
    { value: 'paid' as const, label: 'Paid', icon: 'check_circle', color: '#10b981' },
  ];

  get filtered(): Challan[] {
    const f = this.filter();
    if (f === 'all') return this.challans();
    return this.challans().filter((c) => c.status === f);
  }

  get pendingAmount(): number {
    return this.challans().filter((c) => c.status === 'pending').reduce((s, c) => s + c.amount, 0);
  }

  get pendingCount(): number {
    return this.challans().filter((c) => c.status === 'pending').length;
  }

  goBack(): void {
    window.history.back();
  }

  search(): void {
    if (!this.vehicleNo.trim()) return;
    this.loading.set(true);
    setTimeout(() => {
      this.loading.set(false);
      this.searched.set(true);
    }, 800);
  }

  pay(c: Challan): void {
    this.payingId.set(c.id);
    setTimeout(() => {
      this.challans.update((list) =>
        list.map((x) => (x.id === c.id ? { ...x, status: 'paid' as const } : x))
      );
      this.payingId.set(null);
    }, 900);
  }

  payAll(): void {
    this.challans.update((list) =>
      list.map((x) => (x.status === 'pending' ? { ...x, status: 'paid' as const } : x))
    );
  }
}

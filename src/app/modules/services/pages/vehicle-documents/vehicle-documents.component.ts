import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { StatusCountPipe } from './status-count.pipe';

interface DocItem {
  id: string;
  title: string;
  desc: string;
  icon: string;
  color: string;
  status: 'uploaded' | 'missing' | 'expiring';
  file?: string;
}

@Component({
  selector: 'app-vehicle-documents',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, StatusCountPipe],
  templateUrl: './vehicle-documents.component.html',
  styleUrls: ['./vehicle-documents.component.css'],
})
export class VehicleDocumentsComponent {
  vehicleNo = '';
  uploaded = signal(false);

  docs = signal<DocItem[]>([
    { id: 'rc', title: 'Registration Certificate', desc: 'Vehicle RC book copy', icon: 'description', color: 'linear-gradient(135deg,#3b66db,#6a97f7)', status: 'uploaded', file: 'RC_TN09AB1234.pdf' },
    { id: 'insurance', title: 'Insurance Policy', desc: 'Valid till 12 Mar 2027', icon: 'verified_user', color: 'linear-gradient(135deg,#22c55e,#138808)', status: 'expiring' },
    { id: 'puc', title: 'PUC Certificate', desc: 'Pollution under control', icon: 'eco', color: 'linear-gradient(135deg,#0f9b6f,#2fbfc4)', status: 'missing' },
    { id: 'license', title: 'Driving License', desc: 'Driver license copy', icon: 'badge', color: 'linear-gradient(135deg,#f2c94c,#f59e0b)', status: 'uploaded', file: 'DL_TN092019.jpg' },
    { id: 'permit', title: 'Vehicle Permit', desc: 'Commercial permit (if any)', icon: 'card_membership', color: 'linear-gradient(135deg,#8b5cf6,#7c3aed)', status: 'missing' },
    { id: 'fitness', title: 'Fitness Certificate', desc: 'Annual fitness test', icon: 'health_and_safety', color: 'linear-gradient(135deg,#ef4444,#dc2626)', status: 'missing' },
  ]);

  uploadPct = computed(() =>
    Math.round(((this.docs().filter((d) => d.status === 'uploaded').length) / this.docs().length) * 100)
  );

  goBack(): void {
    window.history.back();
  }

  uploadDoc(id: string): void {
    this.docs.update((list) =>
      list.map((d) =>
        d.id === id
          ? { ...d, status: 'uploaded' as const, file: `${d.title.replace(/\s/g, '_')}.pdf` }
          : d
      )
    );
    this.uploaded.set(true);
    setTimeout(() => this.uploaded.set(false), 2500);
  }

  statusLabel(s: DocItem['status']): string {
    return s === 'uploaded' ? 'Uploaded' : s === 'expiring' ? 'Expiring Soon' : 'Missing';
  }
}

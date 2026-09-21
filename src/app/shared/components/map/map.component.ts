import { Component, input, output, ElementRef, ViewChild, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { ParkingSpot } from '../../../core/models/parking-spot.model';

declare const L: any;

@Component({
  selector: 'app-map',
  standalone: true,
  template: `
    <div #mapContainer class="map-container" [style.height.px]="height()"></div>
  `,
  styles: [`
    .map-container {
      width: 100%;
      border-radius: 12px;
      overflow: hidden;
      background: #e5e7eb;
    }
  `],
})
export class MapComponent implements AfterViewInit, OnChanges {
  @ViewChild('mapContainer') mapContainer!: ElementRef;

  spots = input<ParkingSpot[]>([]);
  center = input<{ lat: number; lng: number }>({ lat: 40.7128, lng: -74.006 });
  zoom = input(13);
  height = input(300);
  singleSpot = input<ParkingSpot | null>(null);
  markerClicked = output<ParkingSpot>();
  locationSelected = output<{ lat: number; lng: number }>();

  private map: any;
  private markers: any[] = [];

  ngAfterViewInit(): void {
    setTimeout(() => this.initMap(), 100);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.map && changes['spots']) {
      this.updateMarkers();
    }
  }

  private initMap(): void {
    if (!this.mapContainer?.nativeElement || typeof L === 'undefined') return;
    this.map = L.map(this.mapContainer.nativeElement).setView(
      [this.center().lat, this.center().lng],
      this.zoom()
    );
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(this.map);

    this.map.on('click', (e: any) => {
      if (this.singleSpot()) return;
      this.locationSelected.emit({ lat: e.latlng.lat, lng: e.latlng.lng });
    });

    this.updateMarkers();
  }

  private updateMarkers(): void {
    this.markers.forEach((m) => this.map.removeLayer(m));
    this.markers = [];

    const spotsToShow = this.singleSpot() ? [this.singleSpot()!] : this.spots();

    spotsToShow.forEach((spot) => {
      if (!spot) return;
      const marker = L.marker([spot.latitude, spot.longitude])
        .addTo(this.map)
        .bindPopup(`<strong>${spot.name}</strong><br/>$${spot.pricePerHour}/hr`);
      marker.on('click', () => this.markerClicked.emit(spot));
      this.markers.push(marker);
    });

    if (spotsToShow.length > 0 && !this.singleSpot()) {
      const bounds = L.latLngBounds(spotsToShow.map((s) => [s.latitude, s.longitude]));
      this.map.fitBounds(bounds, { padding: [40, 40] });
    }
  }
}

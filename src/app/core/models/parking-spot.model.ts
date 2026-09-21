export interface ParkingSpot {
  id: string;
  ownerId: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  pricePerHour: number;
  totalSlots: number;
  availableSlots: number;
  photos: string[];
  isActive: boolean;
  rating: number;
  reviewCount: number;
  description?: string;
  operatingHours?: string;
  createdAt: Date;
}

export type BookingStatus = 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled';

export interface Booking {
  id: string;
  spotId: string;
  spotName: string;
  userId: string;
  userName: string;
  ownerName: string;
  startTime: Date;
  endTime: Date;
  totalHours: number;
  totalCost: number;
  status: BookingStatus;
  createdAt: Date;
}

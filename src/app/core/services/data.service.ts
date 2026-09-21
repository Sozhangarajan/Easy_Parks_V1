import { Injectable, signal } from '@angular/core';
import { ParkingSpot } from '../models/parking-spot.model';
import { Booking, BookingStatus } from '../models/booking.model';
import { Review } from '../models/review.model';

@Injectable({ providedIn: 'root' })
export class DataService {
  private mockSpots: ParkingSpot[] = [
    {
      id: '1',
      ownerId: '2',
      name: 'Central City Parking',
      address: '123 Main St, Downtown',
      latitude: 40.7128,
      longitude: -74.006,
      pricePerHour: 5,
      totalSlots: 50,
      availableSlots: 12,
      photos: ['https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=400'],
      isActive: true,
      rating: 4.5,
      reviewCount: 32,
      description: 'Covered parking in the heart of downtown',
      operatingHours: '24/7',
      createdAt: new Date('2025-01-15'),
    },
    {
      id: '2',
      ownerId: '2',
      name: 'Mall Parking Garage',
      address: '456 Commerce Ave',
      latitude: 40.7148,
      longitude: -74.003,
      pricePerHour: 3,
      totalSlots: 200,
      availableSlots: 85,
      photos: ['https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?w=400'],
      isActive: true,
      rating: 4.2,
      reviewCount: 78,
      description: 'Secure parking at Westfield Mall',
      operatingHours: '6 AM - 12 AM',
      createdAt: new Date('2025-02-20'),
    },
    {
      id: '3',
      ownerId: '2',
      name: 'Airport Long-Term Lot',
      address: '789 Terminal Rd',
      latitude: 40.6895,
      longitude: -74.0445,
      pricePerHour: 8,
      totalSlots: 500,
      availableSlots: 210,
      photos: ['https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=400'],
      isActive: true,
      rating: 4.7,
      reviewCount: 156,
      description: 'Affordable long-term parking near the airport',
      operatingHours: '24/7',
      createdAt: new Date('2025-03-10'),
    },
    {
      id: '4',
      ownerId: '2',
      name: 'Riverside Park & Ride',
      address: '321 River Rd',
      latitude: 40.7282,
      longitude: -73.9942,
      pricePerHour: 2,
      totalSlots: 100,
      availableSlots: 0,
      photos: ['https://images.unsplash.com/photo-1545179043-fd0a425da6c6?w=400'],
      isActive: true,
      rating: 3.9,
      reviewCount: 44,
      description: 'Budget parking with shuttle service',
      operatingHours: '5 AM - 11 PM',
      createdAt: new Date('2025-04-05'),
    },
    {
      id: '5',
      ownerId: '2',
      name: 'Tech Park Underground',
      address: '555 Innovation Blvd',
      latitude: 40.7589,
      longitude: -73.9851,
      pricePerHour: 6,
      totalSlots: 150,
      availableSlots: 42,
      photos: ['https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400'],
      isActive: false,
      rating: 4.8,
      reviewCount: 91,
      description: 'Underground parking with EV charging',
      operatingHours: '24/7',
      createdAt: new Date('2025-05-12'),
    },
  ];

  private mockBookings: Booking[] = [
    {
      id: 'b1',
      spotId: '1',
      spotName: 'Central City Parking',
      userId: '1',
      userName: 'John Doe',
      ownerName: 'Jane Owner',
      startTime: new Date(Date.now() + 3600000),
      endTime: new Date(Date.now() + 7200000),
      totalHours: 2,
      totalCost: 10,
      status: 'confirmed',
      createdAt: new Date(),
    },
    {
      id: 'b2',
      spotId: '2',
      spotName: 'Mall Parking Garage',
      userId: '1',
      userName: 'John Doe',
      ownerName: 'Jane Owner',
      startTime: new Date(Date.now() - 86400000),
      endTime: new Date(Date.now() - 82800000),
      totalHours: 1,
      totalCost: 3,
      status: 'completed',
      createdAt: new Date(Date.now() - 86400000),
    },
    {
      id: 'b3',
      spotId: '3',
      spotName: 'Airport Long-Term Lot',
      userId: '1',
      userName: 'John Doe',
      ownerName: 'Jane Owner',
      startTime: new Date(Date.now() + 172800000),
      endTime: new Date(Date.now() + 259200000),
      totalHours: 24,
      totalCost: 192,
      status: 'pending',
      createdAt: new Date(),
    },
  ];

  private mockReviews: Review[] = [
    {
      id: 'r1',
      spotId: '1',
      userId: '1',
      userName: 'John Doe',
      rating: 5,
      comment: 'Great parking spot, easy to find!',
      createdAt: new Date(),
    },
  ];

  getSpots(): ParkingSpot[] {
    return [...this.mockSpots];
  }

  getActiveSpots(): ParkingSpot[] {
    return this.mockSpots.filter((s) => s.isActive);
  }

  getSpotById(id: string): ParkingSpot | undefined {
    return this.mockSpots.find((s) => s.id === id);
  }

  getSpotsByOwner(ownerId: string): ParkingSpot[] {
    return this.mockSpots.filter((s) => s.ownerId === ownerId);
  }

  addSpot(spot: Omit<ParkingSpot, 'id' | 'createdAt' | 'rating' | 'reviewCount'>): ParkingSpot {
    const newSpot: ParkingSpot = {
      ...spot,
      id: Date.now().toString(),
      rating: 0,
      reviewCount: 0,
      createdAt: new Date(),
    };
    this.mockSpots.push(newSpot);
    return newSpot;
  }

  updateSpot(id: string, updates: Partial<ParkingSpot>): ParkingSpot | null {
    const idx = this.mockSpots.findIndex((s) => s.id === id);
    if (idx === -1) return null;
    this.mockSpots[idx] = { ...this.mockSpots[idx], ...updates };
    return this.mockSpots[idx];
  }

  deleteSpot(id: string): boolean {
    const idx = this.mockSpots.findIndex((s) => s.id === id);
    if (idx === -1) return false;
    this.mockSpots.splice(idx, 1);
    return true;
  }

  searchSpots(query: string, filters?: { maxPrice?: number; availableOnly?: boolean; maxDistance?: number }): ParkingSpot[] {
    let results = this.mockSpots.filter((s) => s.isActive);
    if (query) {
      const q = query.toLowerCase();
      results = results.filter(
        (s) => s.name.toLowerCase().includes(q) || s.address.toLowerCase().includes(q)
      );
    }
    if (filters?.maxPrice !== undefined) {
      results = results.filter((s) => s.pricePerHour <= filters.maxPrice!);
    }
    if (filters?.availableOnly) {
      results = results.filter((s) => s.availableSlots > 0);
    }
    return results;
  }

  getBookingsByUser(userId: string): Booking[] {
    return this.mockBookings.filter((b) => b.userId === userId);
  }

  getBookingsByOwner(ownerId: string): Booking[] {
    return this.mockBookings.filter((b) => {
      const spot = this.mockSpots.find((s) => s.id === b.spotId);
      return spot?.ownerId === ownerId;
    });
  }

  getBookingById(id: string): Booking | undefined {
    return this.mockBookings.find((b) => b.id === id);
  }

  createBooking(booking: Omit<Booking, 'id' | 'createdAt'>): Booking {
    const newBooking: Booking = {
      ...booking,
      id: 'b' + Date.now(),
      createdAt: new Date(),
    };
    this.mockBookings.push(newBooking);
    const spot = this.mockSpots.find((s) => s.id === booking.spotId);
    if (spot && spot.availableSlots > 0) {
      spot.availableSlots--;
    }
    return newBooking;
  }

  updateBookingStatus(id: string, status: BookingStatus): Booking | null {
    const idx = this.mockBookings.findIndex((b) => b.id === id);
    if (idx === -1) return null;
    this.mockBookings[idx] = { ...this.mockBookings[idx], status };
    return this.mockBookings[idx];
  }

  cancelBooking(id: string): boolean {
    const booking = this.mockBookings.find((b) => b.id === id);
    if (!booking) return false;
    booking.status = 'cancelled';
    const spot = this.mockSpots.find((s) => s.id === booking.spotId);
    if (spot) spot.availableSlots++;
    return true;
  }

  getReviewsBySpot(spotId: string): Review[] {
    return this.mockReviews.filter((r) => r.spotId === spotId);
  }

  addReview(review: Omit<Review, 'id' | 'createdAt'>): Review {
    const newReview: Review = {
      ...review,
      id: 'r' + Date.now(),
      createdAt: new Date(),
    };
    this.mockReviews.push(newReview);
    const spot = this.mockSpots.find((s) => s.id === review.spotId);
    if (spot) {
      const allReviews = this.mockReviews.filter((r) => r.spotId === review.spotId);
      spot.reviewCount = allReviews.length;
      spot.rating = allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length;
    }
    return newReview;
  }

  getOwnerStats(ownerId: string): { totalSpots: number; activeSpots: number; totalBookings: number; totalEarnings: number; occupancyRate: number } {
    const spots = this.getSpotsByOwner(ownerId);
    const bookings = this.getBookingsByOwner(ownerId);
    const totalSlots = spots.reduce((a, s) => a + s.totalSlots, 0);
    const availableSlots = spots.reduce((a, s) => a + s.availableSlots, 0);
    return {
      totalSpots: spots.length,
      activeSpots: spots.filter((s) => s.isActive).length,
      totalBookings: bookings.length,
      totalEarnings: bookings.filter((b) => b.status === 'completed').reduce((a, b) => a + b.totalCost, 0),
      occupancyRate: totalSlots > 0 ? Math.round(((totalSlots - availableSlots) / totalSlots) * 100) : 0,
    };
  }
}

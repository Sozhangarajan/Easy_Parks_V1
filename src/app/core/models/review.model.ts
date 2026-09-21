export interface Review {
  id: string;
  spotId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

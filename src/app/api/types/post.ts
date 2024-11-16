import { GeoPoint } from "firebase-admin/firestore";
import { DocumentReference, Timestamp } from "firebase/firestore";

export const POST_COLLECTION = "posts";

export const getRidePostDocument = (id: string) => `${POST_COLLECTION}/${id}`;

export interface RidePostingObject {
  owner: DocumentReference;
  originLocation: GeoPoint;
  destinationLocation: GeoPoint;
  departureTime: Timestamp;
  arrivalTime?: Timestamp;
  totalCost: number;
  totalSeats: number;
  usersInRide: DocumentReference[];
  notes?: string;
}

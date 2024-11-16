import { GeoPoint } from "firebase-admin/firestore";
import { DocumentReference, Timestamp } from "firebase/firestore";
import { UserDocumentObject } from "./user";

export const POST_COLLECTION = "posts";

export const getRidePostDocument = (id: string) => `${POST_COLLECTION}/${id}`;

export interface PopulatedPostingObject extends Omit<RidePostingObject, "owner" | "usersInRide"> {
  owner: UserDocumentObject;
  usersInRide: UserDocumentObject[];
}

export interface RidePostingObject {
  owner: DocumentReference;
  title: string;
  originLocation: GeoPoint;
  destinationLocation: GeoPoint;
  departureTime: Timestamp;
  arrivalTime?: Timestamp;
  totalCost: number;
  totalSeats: number;
  usersInRide: DocumentReference[];
  notes?: string;
}

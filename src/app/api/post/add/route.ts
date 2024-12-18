import { NextRequest, NextResponse } from "next/server";
import { db } from "@/utils/firebase";
import {
  collection,
  addDoc,
  getDoc,
  doc,
  setDoc,
  GeoPoint,
  Timestamp,
} from "firebase/firestore";
import {
  USER_COLLECTION,
  UserDocumentObject,
  YearEnum,
} from "../../types/user";
import { POST_COLLECTION } from "../../types/post";

export interface ExpectedInputAddPostInput {
  ownerId: string;
  title: string;
  originLocation: { latitude: number; longitude: number };
  originName: string;
  destinationLocation: { latitude: number; longitude: number };
  destinationName: string;
  departureTime: string;
  arrivalTime?: string;
  totalCost: number;
  totalSeats: number;
  notes?: string;
  carbonEmission: number;
}

export const POST = async (req: NextRequest) => {
  const res = NextResponse;

  try {
    const input: ExpectedInputAddPostInput = await req.json();

    const originLocation = new GeoPoint(
      input.originLocation.latitude,
      input.originLocation.longitude,
    );
    const destinationLocation = new GeoPoint(
      input.destinationLocation.latitude,
      input.destinationLocation.longitude,
    );
    const departureTime = Timestamp.fromDate(new Date(input.departureTime));
    const arrivalTime = input.arrivalTime
      ? Timestamp.fromDate(new Date(input.arrivalTime))
      : undefined;

    const carbonEmission = input.carbonEmission;

    const ownerRef = doc(db, USER_COLLECTION, input.ownerId);
    const documentBody = {
      owner: ownerRef,
      title: input.title,
      originLocation,
      originName: input.originName,
      destinationLocation,
      destinationName: input.destinationName,
      departureTime,
      arrivalTime,
      totalCost: input.totalCost,
      totalSeats: input.totalSeats,
      usersInRide: [ownerRef],
      notes: input.notes,
      carbonEmission,
    };

    const docRef = await addDoc(collection(db, POST_COLLECTION), documentBody);

    await setDoc(docRef, {
      id: docRef.id,
      ...documentBody,
    });

    return res.json({ message: "OK" }, { status: 200 });
  } catch (err) {
    return res.json(
      { message: `Internal Server Error: ${err}` },
      { status: 500 },
    );
  }
};

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/utils/firebase";
import { collection, addDoc, getDoc, doc, setDoc, GeoPoint, Timestamp } from "firebase/firestore";
import {
  USER_COLLECTION,
  UserDocumentObject,
  YearEnum,
} from "../../types/user";
import { POST_COLLECTION } from "../../types/post";

interface ExpectedInput {
  ownerId: string;
  originLocation: { latitude: number; longitude: number };
  destinationLocation: { latitude: number; longitude: number };
  departureTime: string;
  arrivalTime?: string;
  totalCost: number;
  totalSeats: number;
  notes?: string;
}

export const POST = async (req: NextRequest) => {
  const res = NextResponse;

  try {
    const input: ExpectedInput = await req.json();

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
    
    const ownerRef = doc(db, USER_COLLECTION, input.ownerId);
    const documentBody = {
      owner: ownerRef,
      originLocation,
      destinationLocation,
      departureTime,
      arrivalTime,
      totalCost: input.totalCost,
      totalSeats: input.totalSeats,
      usersInRide: [ownerRef],
      notes: input.notes,
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

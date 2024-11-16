import { NextRequest, NextResponse } from "next/server";
import { getEstimation, getServiceSummary } from "./util";

export interface MyGeoPoint {
  latitude: number;
  longitude: number;
}

interface ExpectedInput {
  originLocation: MyGeoPoint;
  destinationLocation: MyGeoPoint;
}

export const POST = async (req: NextRequest) => {
  const res = NextResponse;

  try {
    const input: ExpectedInput = await req.json();

    const priceEstimation = await getEstimation(
      input.originLocation,
      input.destinationLocation,
    );

    const serviceSummaries =
      priceEstimation.fare_estimates.map(getServiceSummary);

    return res.json({ message: "OK", serviceSummaries }, { status: 200 });
  } catch (err) {
    return res.json(
      { message: `Internal Server Error: ${err}` },
      { status: 500 },
    );
  }
};

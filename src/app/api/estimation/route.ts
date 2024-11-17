import { NextRequest, NextResponse } from "next/server";
import { getEstimation, getServiceSummary, getPolyLine } from "./util";
import { ServiceSummary } from "../types/uber";

export interface MyGeoPoint {
  latitude: number;
  longitude: number;
}
export interface EstimationExpectedInput {
  originLocation: MyGeoPoint;
  destinationLocation: MyGeoPoint;
}

export interface EstimationExpectedOutput {
  serviceSummaries: ServiceSummary[];
}

export const POST = async (req: NextRequest) => {
  const res = NextResponse;

  try {
    const input: EstimationExpectedInput = await req.json();

    const { duration } = await getPolyLine(
      input.originLocation,
      input.destinationLocation,
    );

    const priceEstimation = await getEstimation(
      input.originLocation,
      input.destinationLocation,
    );

    const serviceSummaries = priceEstimation.fare_estimates.map((t) =>
      getServiceSummary(t, duration),
    );

    return res.json({ message: "OK", serviceSummaries }, { status: 200 });
  } catch (err) {
    return res.json(
      { message: `Internal Server Error: ${err}` },
      { status: 500 },
    );
  }
};

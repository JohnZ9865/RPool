import { getUberPriceEstimate } from "@/utils/uberAuth";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const res = NextResponse;

  try {
    const { start, end } = await req.json();
    const priceEstimate = await getUberPriceEstimate(start, end);
    return res.json({ message: "OK", priceEstimate }, { status: 200 });
  } catch (err) {
    return res.json(
      { message: `Internal Server Error: ${err}` },
      { status: 500 },
    );
  }
};

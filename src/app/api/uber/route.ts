import { getUberAccessToken } from '@/utils/uberAuth';
import { NextRequest, NextResponse } from "next/server";

// Getting Access Token
export const GET = async (req: NextRequest) => {
  const res = NextResponse;

  try {
    const accessToken = await getUberAccessToken();
    return res.json({ message: "OK", accessToken }, { status: 200 });
  } catch (err) {
    return res.json(
      { message: `Internal Server Error: ${err}` },
      { status: 500 },
    );
  }
};


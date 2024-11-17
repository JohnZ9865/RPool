import axios from "axios";
import { MyGeoPoint } from "./route";
import {
  ServicePriceInfo,
  ServiceSummary,
  UberServiceData,
} from "../types/uber";

export const getPolyLine = async (
  originLocation: MyGeoPoint,
  destinationLocation: MyGeoPoint,
): Promise<{
  distance: number;
  duration: number;
  polyline: string;
}> => {
  const ACCESS_TOKEN =
    "pk.eyJ1IjoiY2hyaXNoYXdlcyIsImEiOiJjbGNpbGV0dmc0M21xM29tb2syZHE3YmU4In0.Vse1fk7Oga4WpeJsWIH28w";
  const BASE_URL = "https://api.mapbox.com/directions/v5/mapbox";

  try {
    const response = await axios.get(
      `${BASE_URL}/driving/${originLocation.longitude},${originLocation.latitude};${destinationLocation.longitude},${destinationLocation.latitude}`,
      {
        params: {
          annotations: "duration,distance,speed",
          geometries: "polyline",
          access_token: ACCESS_TOKEN,
        },
      },
    );

    const route = response.data.routes[0];

    return {
      distance: route.distance,
      duration: route.duration,
      polyline: route.geometry,
    };
  } catch (error) {
    console.error("Error fetching directions:", error);
    throw error;
  }
};

const getPriceEstimation = async (
  originLocation: MyGeoPoint,
  destinationLocation: MyGeoPoint,
  distance: number,
  duration: number,
  polyline: string,
) => {
  const crfToken =
    "UnkRXxW9r0lfBZsasyDToZxlbrYgUFIE5YjoV1jbIEHRcR5W4DrP3uFKaNxqZIMv";
  try {
    const response = await axios({
      method: "POST",
      url: "https://uberfarefinder.com/api/fares.json",
      headers: {
        accept: "application/json, text/plain, */*",
        "accept-language": "en-US,en;q=0.9",
        "content-type": "application/json;charset=UTF-8",
        priority: "u=1, i",
        referer: "https://uberfarefinder.com/",
        "sec-ch-ua":
          '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"macOS"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "x-csrftoken": crfToken,
        cookie: `csrftoken=${crfToken}; *ga=GA1.1.1776383949.1731786308; *ga_YWRQXBYJEK=GS1.1.1731789298.2.0.1731789298.0.0.0; __gads=ID=8bd54d0f141c874c:T=1731786308:RT=1731789298:S=ALNI_MbwntLDb051s9knYDBVJp8WurGWzQ; __eoi=ID=98361f30dd63bef1:T=1731786308:RT=1731789298:S=AA-AfjabEr0Y1lTIhTVkJIxGSjs4; FCNEC=%5B%5B%22AKsRol9K-1dSc-TewN1f5IrqRfbHe89pH6dfVLc60eCAVAea3f4R-ElfAC-MWPCWI1brRDXB37Qy3YDfp3uzEAtp_3RBtsw6d2f69HdUCPPeNOGLBORaU2eEr15lCcOt3M_z9fCFY2tQEI40O1EFVcQVazGdDfuCvA%3D%3D%22%5D%5D`,
      },
      data: {
        start: `${originLocation.latitude},${originLocation.longitude}`,
        end: `${destinationLocation.latitude},${destinationLocation.longitude}`,
        start_a: "start",
        end_a: "end",
        distance: distance,
        duration: duration,
        polyline: polyline,
        subset: "UBER",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching price estimation:", error);
    throw error;
  }
};

export const getEstimation = async (
  originLocation: MyGeoPoint,
  destinationLocation: MyGeoPoint,
) => {
  const { distance, duration, polyline } = await getPolyLine(
    originLocation,
    destinationLocation,
  );
  const priceEstimation = await getPriceEstimation(
    originLocation,
    destinationLocation,
    distance,
    duration,
    polyline,
  );
  return priceEstimation;
};

export interface CarbonEstimateReturn {
  name: string;
  emissions: number;
}

export const getEmissionsEstimation = (
  name: string,
  duration: number,
): CarbonEstimateReturn => {
  let emission = 0;
  switch (name) {
      case "Uber Black":
        emission = 0.005;
        break;
      case "Uber Comfort Electric":
        emission = 0.001;
        break;
      case "Uber X":
        emission = 0.003;
        break;
      case "Uber XL":
        emission = 0.004;
        break;
    }

    return {
      name: name,
      emissions: duration * emission,
    };
};

function parseRateInfo(notes: string[]): {
  perMile?: number;
  perMinute?: number;
} {
  // Look for the note that contains rate information
  const rateNote = notes.find(
    (note) => note.includes("per mile") || note.includes("per minute"),
  );
  if (!rateNote) return {};

  const rates: { perMile?: number; perMinute?: number } = {};

  // Parse rates using regex
  const mileMatch = rateNote.match(/\$(\d+\.?\d*) per mile/);
  const minuteMatch = rateNote.match(/\$(\d+\.?\d*) per minute/);

  if (mileMatch) rates.perMile = parseFloat(mileMatch[1]);
  if (minuteMatch) rates.perMinute = parseFloat(minuteMatch[1]);

  return rates;
}

export function getServiceSummary(data: UberServiceData, duration: number): ServiceSummary {
  // Get capacity
  const capacityString = data.service?.filters?.capacity[0];
  const capacity = parseInt(capacityString);

  // Get pricing information
  const pricing: ServicePriceInfo = {
    basePrice: data.initial_charge,
    totalFare: data.total_fare,
    priceRange: {
      low: data.total_fare_low,
      high: data.total_fare_high,
    },
    minimumCharge: data.minimum_charge,
    extraCharges: data.extracharges?.map((charge) => ({
      explanation: charge.explanation,
      amount: charge.charge,
    })),
    rateInfo: parseRateInfo(data.notes),
  };
  
  const emissionsEstimation = getEmissionsEstimation(data.service?.name, duration);

  return {
    name: data.service?.name,
    capacity,
    pricing,
    emmisionEstimate: emissionsEstimation.emissions,
  };
}

import axios from 'axios'

interface UberTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
}

interface Coordinates {
  latitude: number;
  longitude: number;
}

export async function getUberAccessToken() {
  const clientId = process.env.UBER_CLIENT_ID;
  const clientSecret = process.env.UBER_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('Uber credentials not configured');
  }

  const params = {
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: 'client_credentials',
    scope: 'lending.events',
  };

  try {
    axios.post('https://sandbox-login.uber.com/oauth/v2/token', params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      transformRequest: [(data) => {
        // Convert the JSON object to URL-encoded string
        return Object.entries(data)
          .map(([key, value]) => `${key}=${value}`)
          .join('&');
      }]
    })
      .then(response => {
        console.log('Response:', response.data);
      })

  } catch (error) {
    console.error('Error getting Uber access token:', error);
    throw error;
  }
}

export async function getUberPriceEstimate(start: Coordinates, end: Coordinates) {
  const accessToken = await getUberAccessToken();

  const params = {
    start_latitude: start.latitude,
    start_longitude: start.longitude,
    end_latitude: end.latitude,
    end_longitude: end.longitude,
  };

  try {
    const response = await axios.get(`https://api.uber.com/v1.2/estimates/price?start_latitude=${params.start_latitude}&start_longitude=${params.start_longitude}&end_latitude=${params.end_latitude}&end_longitude=${params.end_longitude}`, {
      params,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error getting Uber price estimate:', error);
    throw error;
  }
}

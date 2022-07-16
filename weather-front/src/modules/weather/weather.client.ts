import type { ForecastResponse } from '../../pages/api/forecast';


const baseUrl = 'http://localhost:3006';

export const getForecast = async (city?: string) => {
  try {
    if (!city) return null;
    const resp = await fetch(
      `${baseUrl}/weather?city=${city}`,
    );
    const data: any = await resp.json();
    return data.forecast as ForecastResponse;
  } catch (error) {
    return null;
  }
};

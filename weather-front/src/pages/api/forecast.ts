import 'dotenv/config';
import type { NextApiRequest, NextApiResponse } from 'next';

type Main = {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  sea_level: number;
  grnd_level: number;
  humidity: number;
  temp_kf: number;
};

type Weather = {
  id: number;
  main: string;
  description: string;
  icon: string;
};

type Clouds = {
  all: number;
};

type Wind = {
  speed: number;
  deg: number;
  gust: number;
};

type Rain = {
  '3h': number;
};

type Sys = {
  pod: string;
};

type List = {
  dt: number;
  main: Main;
  weather: Weather[];
  clouds: Clouds;
  wind: Wind;
  visibility: number;
  pop: number;
  rain: Rain;
  sys: Sys;
  dt_txt: string;
};

type Coord = {
  lat: number;
  lon: number;
};

type City = {
  id: number;
  name: string;
  coord: Coord;
  country: string;
  population: number;
  timezone: number;
  sunrise: number;
  sunset: number;
};

export type ForecastResponse = {
  cod: string;
  message: number;
  cnt: number;
  list: List[];
  city: City;
};

export type WeatherResponse = {
  coord: Coord;
  weather: Weather[];
  base: string;
  main: Main;
  visibility: number;
  wind: Wind;
  clouds: Clouds;
  dt: number;
  sys: Sys;
  id: number;
  name: string;
  cod: number;
};

const baseUrl = process.env.API_BASE_URL;

const isNotNullOrUndefined = <T extends Object>(
  input: null | undefined | T,
): input is T => input != null;

const getApiUrl = (endpoint: string, city: string) => {
  const url = new URL(`${baseUrl}${endpoint}`);
  url.searchParams.append('city', 'Tehran');

  return url.href;
};

const getForecast = async (city: string) => {
  const href = getApiUrl('/weather', city );
  try {
    const resp = await fetch(href);
    const data: any = await resp.json();
    return data.forecast as ForecastResponse;
  } catch (error) {
    return null;
  }
};

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ForecastResponse>,
) => {

  let data = await getForecast('Tehran');
  if (data == null) return res.status(500);

  let lastDate = 0;
  data.list = data?.list
    ?.map((forecast) => {
      const date = new Date(0);
      date.setUTCSeconds(forecast.dt);
      const monthDate = date.getDate();
      if (monthDate == lastDate) return null;
      lastDate = monthDate;
      return forecast;
    })
    ?.filter(isNotNullOrUndefined);

  res.status(200).json(data);
};

export default handler;

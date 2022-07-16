import { useEffect, useState } from 'react';
import { Weather } from '../../components/weather';
import { Forecast } from '../../components/forecast';
import { ButtonReload } from '../../components/buttons';
import {
  CloudIcon,
  CloudLightningIcon,
  FogIcon,
  RainIcon,
  SnowIcon,
  SunBehindCloudIcon,
  SunBehindLargeCloudIcon,
  SunBehindRainIcon,
  SunIcon,
} from '../../components/icons';
import { useForecast } from './weather.store';
import styled from '@emotion/styled';

type Location = {
  city: string;
};

type WeatherIcons = {
  [key: string]: JSX.Element;
};

const unit = 'C';

const weatherIcons: WeatherIcons = {
  'clear sky': <SunIcon />,
  'few clouds': <SunBehindCloudIcon />,
  'scattered clouds': <SunBehindLargeCloudIcon />,
  'broken clouds': <CloudIcon />,
  'shower rain': <RainIcon />,
  rain: <SunBehindRainIcon />,
  thunderstorm: <CloudLightningIcon />,
  snow: <SnowIcon />,
  mist: <FogIcon />,
};

const weekdays = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

const getWeekday = (i: number) => {
  if (i == 0) return 'Today';
  if (i == 8) return 'Tomorrow';
  const date = new Date();
  date.setDate(date.getDate() + i);
  return weekdays[date.getDay()];
};

const getWeatherIcon = (key: string) =>
  weatherIcons?.[key] || <SunBehindCloudIcon />;

const getMinMaxTemps = (min: number, max: number) =>
  `${Math.floor(min)}º${unit} - ${Math.ceil(max)}º${unit}`;

const updateWeather = (
  setCity: (city: string) => void,
  refetch?: () => void,
) => {
  if (refetch) refetch();
};

export const WeatherPage = () => {
  const [city, setCity] = useState('Tehran');
  const [currentWeekday, setWeekday] = useState(0);
  const { data, refetch } = useForecast(city);

  useEffect(() => updateWeather(setCity), [setCity]);

  const region = data ? `${data.city.name}, ${data.city.country}` : '[...]';
  const current = data?.list?.[currentWeekday];
  const forecast =
    data?.list?.map((forecast, i) => ( i %8 == 0? {
      
      weekday: getWeekday(i),
      icon: getWeatherIcon(forecast.weather?.[0]?.description),
      temperatures: getMinMaxTemps(
        forecast.main.temp_min,
        forecast.main.temp_max,
      ),
      active: i == currentWeekday,
      setCurrent: () => setWeekday(i),
    }: null)) || [];

  return (
    <>
    <Input
          type="text"
          value={city}
          onChange={e => { setCity(e.currentTarget.value); }}
          
      />
      <Weather
        temperature={Math.round(current?.main?.temp || 0)}
        unit={unit}
        location={region}
        feelsLike={Math.round(current?.main?.feels_like || 0)}
        rain={current?.rain?.['3h'] || 0}
        chance={current?.pop || 0}
        humidity={current?.main?.humidity || 0}
      />
      <Forecast forecast={forecast} />
      <ButtonReload onClick={() => updateWeather(setCity, refetch)} />
    </>
  );
};

const Input = styled.input`
padding: 0.5rem;
background-color: #fff;
box-shadow: rgba(0, 0, 0, 0.05) 0 6px 24px 0, rgba(0, 0, 0, 0.08) 0 0 0 1px;
border-radius: 0.25rem;
border: none;
outline: none;
display: flex;
  position: absolute;
  top: 6rem;
  right: 45%;
  height: 2.5rem;
  width: 15rem;
`;
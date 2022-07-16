import { useQuery } from 'react-query';
import { getForecast } from './weather.client';

export const useForecast = (city?: string) =>
useQuery('forecast', () => getForecast(city), { enabled: !!city });

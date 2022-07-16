import { Injectable } from '@nestjs/common';
import { AxiosInstance } from 'axios';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { InjectModel } from '@nestjs/mongoose';
import { Weather, WeatherDocument } from '../schemas/weather.schema';
import { Model } from 'mongoose';
import { CreateWeatherDto } from './dto/create-weather.dto';
import * as moment from 'moment';

@Injectable()
export class WeatherService {
  private client: AxiosInstance;

  constructor(
    private readonly httpService: HttpService,
    @InjectModel(Weather.name) private weatherModel: Model<WeatherDocument>,
  ) {}
  greaterOneHour = (start: string): boolean => {
    const now = moment(new Date());
    const end = moment(start);
    const duration = moment.duration(now.diff(end));
    const hours = duration.asHours();
    return hours > 1 ? true : false;
  };
  getWeather = async (city: string, type: string): Promise<object> => {
    const url = `${process.env.OPEN_WEATHER_URL}${type}?q=${city}&units=metric&APPID=${process.env.OPEN_WEATHER_TOKEN}`;
    const { data } = await firstValueFrom(this.httpService.get(url));
    return data;
  };

  getWeatherForecast = async (city: string): Promise<CreateWeatherDto> => {
    const forecast = await this.getWeather(city, 'forecast');
    const weather = await this.getWeather(city, 'find');
    const createWeatherDto: CreateWeatherDto = {
      city: city,
      weather: weather,
      forecast: forecast,
    };
    return createWeatherDto;
  };

  async getCityWeather(city: string): Promise<CreateWeatherDto> {
    const cityFound: any = await this.weatherModel
      .findOne({ city: city })
      .select(' -__v')
      .exec();
    if (cityFound) {
      if (this.greaterOneHour(cityFound.updatedAt)) {
        const updateWeatherDto: CreateWeatherDto =
          await this.getWeatherForecast(city);
        await this.weatherModel
          .updateOne({ _id: cityFound._id }, { $set: updateWeatherDto })
          .exec();
        return updateWeatherDto;
      }
      const weatherDto: CreateWeatherDto = cityFound;
      return weatherDto;
    } else {
      const createWeatherDto: CreateWeatherDto = await this.getWeatherForecast(
        city,
      );
      await this.weatherModel.create(createWeatherDto);
      return createWeatherDto;
    }
  }
}

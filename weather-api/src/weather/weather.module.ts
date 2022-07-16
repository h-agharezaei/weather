import { Module } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { WeatherController } from './weather.controller';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';
import { Weather, WeatherSchema } from '../schemas/weather.schema';

@Module({
  controllers: [WeatherController],
  providers: [WeatherService],
  imports: [
    HttpModule,
    MongooseModule.forFeature([{ name: Weather.name, schema: WeatherSchema }]),
  ],
})
export class WeatherModule {}

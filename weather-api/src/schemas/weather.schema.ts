import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
export type WeatherDocument = Weather & Document;

@Schema({
  timestamps: true,
})
export class Weather {
  @Prop({
    required: true,
  })
  city: string;
  @Prop({
    type: Object,
  })
  weather: object;
  @Prop({
    type: Object,
  })
  forecast: object;
}
export const WeatherSchema = SchemaFactory.createForClass(Weather);

import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';
dotenv.config();

const configService = new ConfigService();

export const jwtConstants = {
    secret: configService.get<string>('JWT_SECRET'),
  };
  
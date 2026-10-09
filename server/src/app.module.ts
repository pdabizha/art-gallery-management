import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ArtworksModule } from './artworks/artworks.module.js';
import { DatabaseModule } from './database/database.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    ArtworksModule,
  ],
})
export class AppModule {}
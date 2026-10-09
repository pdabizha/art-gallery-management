import { Module } from '@nestjs/common';
import { ArtworksService } from './artworks.service.js';
import { ArtworksController } from './artworks.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Artwork } from './entities/artwork.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Artwork])],
  controllers: [ArtworksController],
  providers: [ArtworksService],
})
export class ArtworksModule {}

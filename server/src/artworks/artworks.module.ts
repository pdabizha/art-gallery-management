import { Module } from '@nestjs/common';
import { ArtworksService } from './artworks.service.js';
import { ArtworksController } from './artworks.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Artwork } from './entities/artwork.entity.js';
import { ImageUploadService } from './image-upload.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Artwork])],
  controllers: [ArtworksController],
  providers: [ArtworksService, ImageUploadService],
})
export class ArtworksModule {}

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ArtworksService } from './artworks.service.js';
import { CreateArtworkDto } from './dto/create-artwork.dto.js';
import { UpdateArtworkDto } from './dto/update-artwork.dto.js';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('artworks')
export class ArtworksController {
  constructor(private readonly artworksService: ArtworksService) {}

  @Post()
  create(@Body() createArtworkDto: CreateArtworkDto) {
    return this.artworksService.create(createArtworkDto);
  }

  @Get()
  findAll() {
    return this.artworksService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.artworksService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateArtworkDto: UpdateArtworkDto) {
    return this.artworksService.update(id, updateArtworkDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.artworksService.remove(id);
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    }),
  )
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    return this.artworksService.uploadImage(file);
  }
}

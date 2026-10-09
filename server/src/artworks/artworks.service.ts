import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateArtworkDto } from './dto/create-artwork.dto.js';
import { FindArtworksQueryDto } from './dto/find-artworks-query.dto.js';
import { UpdateArtworkDto } from './dto/update-artwork.dto.js';
import { Artwork } from './entities/artwork.entity.js';

@Injectable()
export class ArtworksService {
  constructor(
    @InjectRepository(Artwork)
    private readonly artworksRepository: Repository<Artwork>,
  ) {}

  create(createArtworkDto: CreateArtworkDto) {
    const artwork = this.artworksRepository.create(createArtworkDto);
    return this.artworksRepository.save(artwork);
  }

  findAll({ search, artist, type, sort }: FindArtworksQueryDto = {}) {
    const query = this.artworksRepository.createQueryBuilder('artwork');

    if (search) {
      const escaped = search.replace(/[\\%_]/g, '\\$&');
      query.andWhere('artwork.title ILIKE :search', {
        search: `%${escaped}%`,
      });
    }

    if (artist) {
      query.andWhere('artwork.artist = :artist', { artist });
    }

    if (type) {
      query.andWhere('artwork.type = :type', { type });
    }

    if (sort) {
      query
        .orderBy('artwork.price', sort === 'price-asc' ? 'ASC' : 'DESC')
        .addOrderBy('artwork.id', 'ASC');
    }

    return query.getMany();
  }

  async findArtists() {
    const rows = await this.artworksRepository
      .createQueryBuilder('artwork')
      .select('artwork.artist', 'artist')
      .distinct(true)
      .orderBy('artwork.artist', 'ASC')
      .getRawMany<{ artist: string }>();

    return rows.map((row) => row.artist);
  }

  async findOne(id: string) {
    const artwork = await this.artworksRepository.findOneBy({ id });

    if (!artwork) {
      throw new NotFoundException(`Artwork with ID ${id} not found`);
    }

    return artwork;
  }

  async update(id: string, updateArtworkDto: UpdateArtworkDto) {
    const artwork = await this.findOne(id);
    Object.assign(artwork, updateArtworkDto);
    return this.artworksRepository.save(artwork);
  }

  async remove(id: string) {
    const artwork = await this.findOne(id);
    await this.artworksRepository.remove(artwork);

    return { message: 'Artwork deleted successfully' };
  }

  async uploadImage(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Image file is required');
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

    if (!allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        'Only JPEG, PNG, WebP and GIF images are allowed',
      );
    }

    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    return new Promise<{ imageUrl: string; publicId: string }>(
      (resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: 'art-gallery',
              resource_type: 'image',
            },
            (error, result) => {
              if (error || !result) {
                reject(error ?? new Error('Image upload failed'));
                return;
              }

              resolve({
                imageUrl: result.secure_url,
                publicId: result.public_id,
              });
            },
          )
          .end(file.buffer);
      },
    );
  }
}

import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class ImageUploadService {
  private readonly allowedTypes = new Set([
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
  ]);

  constructor(config: ConfigService) {
    cloudinary.config({
      cloud_name: config.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: config.get<string>('CLOUDINARY_API_KEY'),
      api_secret: config.get<string>('CLOUDINARY_API_SECRET'),
    });
  }

  async upload(file?: Express.Multer.File) {
    this.validateFile(file);

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

  private validateFile(
    file?: Express.Multer.File,
  ): asserts file is Express.Multer.File {
    if (!file) {
      throw new BadRequestException('Image file is required');
    }

    if (!this.allowedTypes.has(file.mimetype)) {
      throw new BadRequestException(
        'Only JPEG, PNG, WebP and GIF images are allowed',
      );
    }
  }
}
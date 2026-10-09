import { BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { v2 as cloudinary } from 'cloudinary';
import { ImageUploadService } from '../image-upload.service.js';

vi.mock('cloudinary', () => ({
  v2: {
    config: vi.fn(),
    uploader: { upload_stream: vi.fn() },
  },
}));

const makeFile = (mimetype: string) =>
  ({ mimetype, buffer: Buffer.from('img') }) as Express.Multer.File;

describe('ImageUploadService', () => {
  let service: ImageUploadService;

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ImageUploadService,
        {
          provide: ConfigService,
          useValue: { get: vi.fn((key: string) => `value-of-${key}`) },
        },
      ],
    }).compile();

    service = module.get(ImageUploadService);
  });

  it('configures cloudinary from config', () => {
    expect(cloudinary.config).toHaveBeenCalledWith({
      cloud_name: 'value-of-CLOUDINARY_CLOUD_NAME',
      api_key: 'value-of-CLOUDINARY_API_KEY',
      api_secret: 'value-of-CLOUDINARY_API_SECRET',
    });
  });

  it('rejects a missing file', async () => {
    await expect(service.upload(undefined)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('rejects an unsupported file type', async () => {
    await expect(service.upload(makeFile('application/pdf'))).rejects.toThrow(
      'Only JPEG, PNG, WebP and GIF images are allowed',
    );
    expect(cloudinary.uploader.upload_stream).not.toHaveBeenCalled();
  });

  it.each(['image/jpeg', 'image/png', 'image/webp', 'image/gif'])(
    'uploads %s and returns url and public id',
    async (mimetype) => {
      const end = vi.fn();
      vi.mocked(cloudinary.uploader.upload_stream).mockImplementation(((
        _options: unknown,
        callback: (error: unknown, result: unknown) => void,
      ) => {
        callback(undefined, {
          secure_url: 'https://cdn/x.jpg',
          public_id: 'art-gallery/x',
        });
        return { end };
      }) as never);

      const file = makeFile(mimetype);

      await expect(service.upload(file)).resolves.toEqual({
        imageUrl: 'https://cdn/x.jpg',
        publicId: 'art-gallery/x',
      });
      expect(cloudinary.uploader.upload_stream).toHaveBeenCalledWith(
        { folder: 'art-gallery', resource_type: 'image' },
        expect.any(Function),
      );
      expect(end).toHaveBeenCalledWith(file.buffer);
    },
  );

  it('rejects when cloudinary returns an error', async () => {
    vi.mocked(cloudinary.uploader.upload_stream).mockImplementation(((
      _options: unknown,
      callback: (error: unknown, result: unknown) => void,
    ) => {
      callback(new Error('boom'), undefined);
      return { end: vi.fn() };
    }) as never);

    await expect(service.upload(makeFile('image/png'))).rejects.toThrow('boom');
  });
});
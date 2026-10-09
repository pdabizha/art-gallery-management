import { Test, TestingModule } from '@nestjs/testing';
import { ArtworksController } from '../artworks.controller.js';
import { ArtworksService } from '../artworks.service.js';
import { ImageUploadService } from '../image-upload.service.js';

describe('ArtworksController', () => {
  let controller: ArtworksController;

  const service = {
    findAll: vi.fn().mockResolvedValue([]),
    findArtists: vi.fn().mockResolvedValue(['Tom Ray']),
  };

  const imageUploadService = {
    upload: vi.fn().mockResolvedValue({ imageUrl: 'https://x/a.jpg', publicId: 'id' }),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArtworksController],
      providers: [
        { provide: ArtworksService, useValue: service },
        { provide: ImageUploadService, useValue: imageUploadService },
      ],
    }).compile();

    controller = module.get<ArtworksController>(ArtworksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('passes query params to the service', async () => {
    const query = { search: 'lake', sort: 'price-desc' as const };

    await controller.findAll(query);

    expect(service.findAll).toHaveBeenCalledWith(query);
  });

  it('returns the list of artists', async () => {
    await expect(controller.findArtists()).resolves.toEqual(['Tom Ray']);
  });

  it('delegates image upload to ImageUploadService', async () => {
    const file = { mimetype: 'image/png' } as Express.Multer.File;

    await expect(controller.uploadImage(file)).resolves.toEqual({
      imageUrl: 'https://x/a.jpg',
      publicId: 'id',
    });
    expect(imageUploadService.upload).toHaveBeenCalledWith(file);
  });
});
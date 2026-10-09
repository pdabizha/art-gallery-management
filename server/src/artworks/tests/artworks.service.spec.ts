import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ArtworksService } from '../artworks.service.js';
import { Artwork } from '../entities/artwork.entity.js';

describe('ArtworksService', () => {
  let service: ArtworksService;

  const queryBuilder = {
    andWhere: vi.fn().mockReturnThis(),
    orderBy: vi.fn().mockReturnThis(),
    addOrderBy: vi.fn().mockReturnThis(),
    getMany: vi.fn().mockResolvedValue([]),
  };
  const repository = {
    createQueryBuilder: vi.fn(() => queryBuilder),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArtworksService,
        { provide: getRepositoryToken(Artwork), useValue: repository },
      ],
    }).compile();

    service = module.get<ArtworksService>(ArtworksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('applies no filters and no sorting without params', async () => {
      await service.findAll({});

      expect(queryBuilder.andWhere).not.toHaveBeenCalled();
      expect(queryBuilder.orderBy).not.toHaveBeenCalled();
      expect(queryBuilder.getMany).toHaveBeenCalledOnce();
    });

    it('filters by title with a case-insensitive partial match', async () => {
      await service.findAll({ search: 'lake' });

      expect(queryBuilder.andWhere).toHaveBeenCalledWith(
        'artwork.title ILIKE :search',
        { search: '%lake%' },
      );
    });

    it('escapes LIKE wildcards in the search term', async () => {
      await service.findAll({ search: '100%_\\' });

      expect(queryBuilder.andWhere).toHaveBeenCalledWith(
        'artwork.title ILIKE :search',
        { search: '%100\\%\\_\\\\%' },
      );
    });

    it('filters by artist', async () => {
      await service.findAll({ artist: 'Tom Ray' });

      expect(queryBuilder.andWhere).toHaveBeenCalledWith(
        'artwork.artist = :artist',
        { artist: 'Tom Ray' },
      );
    });

    it('filters by type', async () => {
      await service.findAll({ type: 'Painting' });

      expect(queryBuilder.andWhere).toHaveBeenCalledWith(
        'artwork.type = :type',
        { type: 'Painting' },
      );
    });

    it('combines all filters', async () => {
      await service.findAll({ search: 'a', artist: 'X', type: 'Y' });

      expect(queryBuilder.andWhere).toHaveBeenCalledTimes(3);
    });

    it.each([
      ['price-asc', 'ASC'],
      ['price-desc', 'DESC'],
    ] as const)('sorts by price for %s', async (sort, direction) => {
      await service.findAll({ sort });

      expect(queryBuilder.orderBy).toHaveBeenCalledWith(
        'artwork.price',
        direction,
      );
      expect(queryBuilder.addOrderBy).toHaveBeenCalledWith('artwork.id', 'ASC');
    });
  });
});
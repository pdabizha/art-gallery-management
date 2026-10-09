import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { FindArtworksQueryDto } from '../dto/find-artworks-query.dto.js';

const run = (plain: Record<string, unknown>) => {
  const dto = plainToInstance(FindArtworksQueryDto, plain);
  return validate(dto).then((errors) => ({ dto, errors }));
};

describe('FindArtworksQueryDto', () => {
  it('accepts an empty query', async () => {
    expect((await run({})).errors).toHaveLength(0);
  });

  it.each(['price-asc', 'price-desc'])('accepts sort=%s', async (sort) => {
    expect((await run({ sort })).errors).toHaveLength(0);
  });

  it('rejects an unknown sort value', async () => {
    expect((await run({ sort: 'title-asc' })).errors).toHaveLength(1);
  });

  it('trims string params', async () => {
    const { dto } = await run({ search: '  lake ', artist: ' A ', type: ' T ' });

    expect(dto).toMatchObject({ search: 'lake', artist: 'A', type: 'T' });
  });

  it('rejects an overly long search', async () => {
    expect((await run({ search: 'a'.repeat(101) })).errors).toHaveLength(1);
  });
});
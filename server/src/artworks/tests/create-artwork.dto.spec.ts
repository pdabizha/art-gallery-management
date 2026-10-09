import { plainToInstance, type ClassConstructor } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateArtworkDto } from '../dto/create-artwork.dto.js';
import { UpdateArtworkDto } from '../dto/update-artwork.dto.js';

const base = {
  title: 'T',
  artist: 'A',
  type: 'Painting',
  imageUrl: 'https://x.com/a.jpg',
};

const priceErrors = async (
  price: unknown,
  Dto: ClassConstructor<object> = CreateArtworkDto,
) => {
  const errors = await validate(plainToInstance(Dto, { ...base, price }));
  return errors.filter((e) => e.property === 'price');
};

describe('CreateArtworkDto price', () => {
  it.each([0, 1, 1500])('accepts the whole number %s', async (price) => {
    expect(await priceErrors(price)).toHaveLength(0);
  });

  it.each([12.5, 0.01, 99.99])('rejects the fractional price %s', async (price) => {
    expect(await priceErrors(price)).toHaveLength(1);
  });

  it('rejects a negative price', async () => {
    expect(await priceErrors(-5)).toHaveLength(1);
  });

  it('rejects a fractional price on update as well', async () => {
    expect(await priceErrors(12.5, UpdateArtworkDto)).toHaveLength(1);
  });
});
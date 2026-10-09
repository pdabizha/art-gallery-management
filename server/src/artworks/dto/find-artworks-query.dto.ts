import { Transform } from 'class-transformer';
import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator';

export const SORT_ORDERS = ['price-asc', 'price-desc'] as const;
export type ArtworkSortOrder = (typeof SORT_ORDERS)[number];

const trim = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value;

export class FindArtworksQueryDto {
  @IsOptional()
  @Transform(trim)
  @IsString()
  @MaxLength(100)
  search?: string;

  @IsOptional()
  @Transform(trim)
  @IsString()
  artist?: string;

  @IsOptional()
  @Transform(trim)
  @IsString()
  type?: string;

  @IsOptional()
  @IsIn(SORT_ORDERS)
  sort?: ArtworkSortOrder;
}
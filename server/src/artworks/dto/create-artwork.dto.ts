import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  Min,
} from 'class-validator';

export class CreateArtworkDto {
  @IsString()
  title: string;

  @IsString()
  artist: string;

  @IsString()
  type: string;

  @IsInt()
  @Min(1)
  price: number;

  @IsOptional()
  @IsBoolean()
  availability?: boolean;

  @IsUrl()
  imageUrl: string;
}

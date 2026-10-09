import {
  IsBoolean,
  IsNumber,
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

  @IsNumber()
  @Min(0)
  price: number;

  @IsOptional()
  @IsBoolean()
  availability?: boolean;

  @IsUrl()
  imageUrl: string;
}

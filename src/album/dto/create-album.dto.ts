import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAlbumDto {
  @IsNotEmpty()
  readonly name: string;

  @IsNotEmpty()
  @IsInt()
  readonly year: number;

  @IsString()
  @IsOptional()
  artistId: string | null;
}

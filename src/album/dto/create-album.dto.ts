import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAlbumDto {
  @IsNotEmpty()
  readonly name: string;

  @IsNotEmpty()
  readonly year: number;

  @IsString()
  artistId: string | null;
}

import { IsBoolean, IsNotEmpty } from 'class-validator';

export class CreateArtistDto {
  @IsNotEmpty()
  readonly name: string;

  @IsNotEmpty()
  @IsBoolean()
  readonly grammy: boolean;
}

import { IsNotEmpty } from 'class-validator';

export class CreateArtistDto {
  @IsNotEmpty()
  readonly name: string;

  @IsNotEmpty()
  readonly grammy: boolean;
}

import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTrackDto {
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsOptional()
  readonly artistId: string | null;

  @IsString()
  @IsOptional()
  readonly albumId: string | null;

  @IsInt()
  readonly duration: number;
}

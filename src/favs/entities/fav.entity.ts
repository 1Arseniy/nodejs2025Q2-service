import { IsArray } from 'class-validator';
// @Entity()
export class Fav {
  //   @PrimaryColumn()
  @IsArray()
  artists: string[];

  @IsArray()
  albums: string[];

  @IsArray()
  tracks: string[];
}

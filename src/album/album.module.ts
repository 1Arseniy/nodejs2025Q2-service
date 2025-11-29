import { Module } from '@nestjs/common';
import { AlbumService } from './album.service';
import { AlbumController } from './album.controller';
import { ArtistModule } from 'src/artist/artist.module';
// import { ArtistService } from 'src/artist/artist.service';

@Module({
  imports: [ArtistModule],
  controllers: [AlbumController],
  providers: [AlbumService],
  exports: [AlbumService],
})
export class AlbumModule {}

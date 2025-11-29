import { Module } from '@nestjs/common';
import { TrackService } from './track.service';
import { TrackController } from './track.controller';
import { ArtistModule } from 'src/artist/artist.module';
import { AlbumModule } from 'src/album/album.module';

@Module({
  imports: [ArtistModule, AlbumModule],
  controllers: [TrackController],
  providers: [TrackService],
})
export class TrackModule {}

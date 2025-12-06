import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Track, Tracks } from 'src/types/types';
import { ArtistService } from 'src/artist/artist.service';
import { AlbumService } from 'src/album/album.service';
import { randomUUID } from 'crypto';
import { FavsService } from 'src/favs/favs.service';

@Injectable()
export class TrackService {
  tracks: Tracks = [];

  constructor(
    @Inject(forwardRef(() => ArtistService))
    private ArtistService: ArtistService,

    @Inject(forwardRef(() => AlbumService))
    private AlbumService: AlbumService,

    @Inject(forwardRef(() => FavsService))
    private FavsService: FavsService,
  ) {}

  private async getArtistById(id: string) {
    return await this.ArtistService.findById(id);
    // return this.ArtistService..find((artist) => artist.id === id);
  }

  private getAlbumById(id: string) {
    return this.AlbumService.albums.find((album) => album.id === id);
  }

  findAll() {
    return this.tracks;
  }

  findById(id: string) {
    const track = this.tracks.find((track) => track.id === id);

    if (!track) {
      throw new NotFoundException('Not Found');
    }

    return track;
  }

  async create(createTrackDto: CreateTrackDto) {
    const artist = await this.getArtistById(createTrackDto.artistId);
    const album = this.getAlbumById(createTrackDto.albumId);

    const track: Track = {
      id: randomUUID(),
      name: createTrackDto.name,
      artistId: artist ? artist.id : null,
      albumId: album ? album.id : null,
      duration: createTrackDto.duration,
    };

    this.tracks.push(track);

    return track;
  }

  async update(id: string, updateTrackDto: UpdateTrackDto) {
    const track = this.findById(id);
    const artist = await this.getArtistById(updateTrackDto.artistId);
    const album = this.getAlbumById(updateTrackDto.albumId);

    track.name = updateTrackDto.name;
    track.artistId = artist ? artist.id : null;
    track.albumId = album ? album.id : null;
    track.duration = updateTrackDto.duration;

    return track;
  }

  delete(id: string) {
    const trackForDel = this.findById(id);

    this.tracks = this.tracks.filter((track) => track.id !== trackForDel.id);

    try {
      this.FavsService.deleteTrack(id);
    } catch {
      console.log('Error');
    }
  }
}

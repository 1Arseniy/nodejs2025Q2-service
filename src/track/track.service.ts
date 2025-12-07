import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { TypeTrack } from 'src/types/types';
import { ArtistService } from 'src/artist/artist.service';
import { AlbumService } from 'src/album/album.service';
import { randomUUID } from 'crypto';
import { FavsService } from 'src/favs/favs.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Track } from './entities/track.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TrackService {
  constructor(
    @Inject(forwardRef(() => ArtistService))
    private ArtistService: ArtistService,

    @Inject(forwardRef(() => AlbumService))
    private AlbumService: AlbumService,

    @Inject(forwardRef(() => FavsService))
    private FavsService: FavsService,

    @InjectRepository(Track)
    private tracksRepository: Repository<Track>,
  ) {}

  private async getArtistById(id: string) {
    return (await this.ArtistService.findAll()).find(
      (artist) => artist.id === id,
    );
  }

  private async getAlbumById(id: string) {
    return (await this.AlbumService.findAll()).find((album) => album.id === id);
  }

  async findAll() {
    return await this.tracksRepository.find();
  }

  async findById(id: string) {
    const track = await this.tracksRepository.findOneBy({ id });

    if (!track) {
      throw new NotFoundException('Not Found');
    }

    return track;
  }

  async create(createTrackDto: CreateTrackDto) {
    const artist = await this.getArtistById(createTrackDto.artistId);
    const album = await this.getAlbumById(createTrackDto.albumId);

    const trackObj: TypeTrack = {
      id: randomUUID(),
      name: createTrackDto.name,
      artistId: artist ? artist.id : null,
      albumId: album ? album.id : null,
      duration: createTrackDto.duration,
    };

    const track = this.tracksRepository.create(trackObj);

    return this.tracksRepository.save(track);
  }

  async update(id: string, updateTrackDto: UpdateTrackDto) {
    const track = await this.findById(id);
    const artist = await this.getArtistById(updateTrackDto.artistId);
    const album = await this.getAlbumById(updateTrackDto.albumId);

    track.name = updateTrackDto.name;
    track.artistId = artist ? artist.id : null;
    track.albumId = album ? album.id : null;
    track.duration = updateTrackDto.duration;

    return this.tracksRepository.save(track);
  }

  async delete(id: string) {
    const res = await this.tracksRepository.delete(id);

    if (res.affected === 0) {
      throw new NotFoundException(`User not found`);
    }

    try {
      this.FavsService.deleteTrack(id);
    } catch {
      console.log('Error');
    }
  }
}

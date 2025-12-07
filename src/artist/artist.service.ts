import {
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { TypeArtist } from 'src/types/types';
import { randomUUID } from 'crypto';
import { TrackService } from 'src/track/track.service';
import { AlbumService } from 'src/album/album.service';
import { FavsService } from 'src/favs/favs.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Artist } from './entities/artist.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ArtistService {
  constructor(
    @Inject(forwardRef(() => AlbumService))
    private AlbumService: AlbumService,

    @Inject(forwardRef(() => TrackService))
    private TrackService: TrackService,

    @Inject(forwardRef(() => FavsService))
    private FavsService: FavsService,

    @InjectRepository(Artist)
    private artistsRepository: Repository<Artist>,
  ) {}

  async findAll() {
    return await this.artistsRepository.find();
  }

  async findById(id: string) {
    const artist = await this.artistsRepository.findOneBy({ id });

    if (!artist) {
      throw new NotFoundException('Not Found');
    }

    return artist;
  }

  async create(createArtistDto: CreateArtistDto) {
    const artistObj: TypeArtist = {
      id: randomUUID(),
      name: createArtistDto.name,
      grammy: createArtistDto.grammy,
    };

    const artist = this.artistsRepository.create(artistObj);

    return this.artistsRepository.save(artist);
  }

  async update(id: string, updateArtistDto: UpdateArtistDto) {
    const artist = await this.findById(id);

    artist.grammy = updateArtistDto.grammy;
    artist.name = updateArtistDto.name;

    return this.artistsRepository.save(artist);
  }

  async delete(id: string) {
    const res = await this.artistsRepository.delete(id);

    if (res.affected === 0) {
      throw new NotFoundException(`User not found`);
    }

    const albums = await this.AlbumService.findAll();

    for (const album of albums) {
      if (album.artistId === id) {
        await this.AlbumService.update(album.id, {
          name: album.name,
          artistId: null,
          year: album.year,
        });
      }
    }

    const tracks = await this.TrackService.findAll();
    for (const track of tracks) {
      if (track.artistId === id) {
        await this.TrackService.update(track.id, {
          name: track.name,
          albumId: track.albumId,
          artistId: null,
          duration: track.duration,
        });
      }
    }

    try {
      this.FavsService.deleteArtist(id);
    } catch {
      console.log('Error');
    }
  }
}

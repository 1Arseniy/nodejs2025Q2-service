import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { TypeAlbum } from 'src/types/types';
import { randomUUID } from 'crypto';
import { ArtistService } from 'src/artist/artist.service';
import { TrackService } from 'src/track/track.service';
import { FavsService } from 'src/favs/favs.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Album } from './entities/album.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AlbumService {
  constructor(
    @Inject(forwardRef(() => ArtistService))
    private readonly ArtistService: ArtistService,

    @Inject(forwardRef(() => TrackService))
    private readonly TrackService: TrackService,

    @Inject(forwardRef(() => FavsService))
    private readonly FavsService: FavsService,

    @InjectRepository(Album)
    private albumsRepository: Repository<Album>,
  ) {}

  private async getArtistById(id: string) {
    return (await this.ArtistService.findAll()).find(
      (artist) => artist.id === id,
    );
  }

  async findAll() {
    return await this.albumsRepository.find();
  }

  async findById(id: string) {
    const album = await this.albumsRepository.findOneBy({ id });

    if (!album) {
      throw new NotFoundException('Not Found');
    }

    return album;
  }

  async create(createAlbumDto: CreateAlbumDto) {
    const artist = await this.getArtistById(createAlbumDto.artistId);

    const albumObj: TypeAlbum = {
      id: randomUUID(),
      name: createAlbumDto.name,
      year: createAlbumDto.year,
      artistId: artist ? artist.id : null,
    };

    const album = this.albumsRepository.create(albumObj);

    return this.albumsRepository.save(album);
  }

  async update(id: string, updateAlbumDto: UpdateAlbumDto) {
    const album = await this.findById(id);
    const artist = await this.getArtistById(updateAlbumDto.artistId);

    album.artistId = artist ? artist.id : null;
    album.name = updateAlbumDto.name;
    album.year = updateAlbumDto.year;

    return this.albumsRepository.save(album);
  }

  async delete(id: string) {
    const res = await this.albumsRepository.delete(id);

    if (res.affected === 0) {
      throw new NotFoundException(`User not found`);
    }

    const tracks = await this.TrackService.findAll();

    for (const track of tracks) {
      if (track.albumId === id) {
        await this.TrackService.update(track.id, {
          name: track.name,
          albumId: null,
          artistId: track.artistId,
          duration: track.duration,
        });
      }
    }
    try {
      this.FavsService.deleteAlbum(id);
    } catch {
      console.log('Error');
    }
  }
}

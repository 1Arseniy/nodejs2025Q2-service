import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist, Artists } from 'src/types/types';
import { randomUUID } from 'crypto';

@Injectable()
export class ArtistService {
  artists: Artists = [];

  findAll() {
    return this.artists;
  }

  findById(id: string) {
    const artist = this.artists.find((artist) => artist.id === id);

    if (!artist) {
      throw new NotFoundException('Not Found');
    }

    return artist;
  }

  create(createArtistDto: CreateArtistDto) {
    const artist: Artist = {
      id: randomUUID(),
      name: createArtistDto.name,
      grammy: createArtistDto.grammy,
    };

    this.artists.push(artist);

    return artist;
  }

  update(id: string, updateArtistDto: UpdateArtistDto) {
    const artist = this.findById(id);

    artist.grammy = updateArtistDto.grammy;
    artist.name = updateArtistDto.name;

    return artist;
  }

  delete(id: string) {
    const artistForDel = this.findById(id);

    this.artists = this.artists.filter(
      (artist) => artist.id !== artistForDel.id,
    );
  }
}

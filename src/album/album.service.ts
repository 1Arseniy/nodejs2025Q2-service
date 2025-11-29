import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album, Albums } from 'src/types/types';
import { randomUUID } from 'crypto';
import { ArtistService } from 'src/artist/artist.service';

@Injectable()
export class AlbumService {
  albums: Albums = [];

  constructor(private readonly ArtistService: ArtistService) {}

  private getArtistById(id: string) {
    return this.ArtistService.artists.find((artist) => artist.id === id);
  }

  findAll() {
    return this.albums;
  }

  findById(id: string) {
    const album = this.albums.find((album) => album.id === id);

    if (!album) {
      throw new NotFoundException('Not Found');
    }

    return album;
  }

  create(createAlbumDto: CreateAlbumDto) {
    const artist = this.getArtistById(createAlbumDto.artistId);

    const album: Album = {
      id: randomUUID(),
      name: createAlbumDto.name,
      year: createAlbumDto.year,
      artistId: artist ? artist.id : null,
    };

    this.albums.push(album);

    return album;
  }

  update(id: string, updateAlbumDto: UpdateAlbumDto) {
    const album = this.findById(id);
    const artist = this.getArtistById(updateAlbumDto.artistId);

    album.artistId = artist ? artist.id : null;
    album.name = updateAlbumDto.name;
    album.year = updateAlbumDto.year;

    return album;
  }

  delete(id: string) {
    const albumForDel = this.findById(id);

    this.albums = this.albums.filter((album) => album.id !== albumForDel.id);
  }
}

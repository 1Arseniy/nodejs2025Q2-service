import {
  Injectable,
  HttpException,
  NotFoundException,
  forwardRef,
  Inject,
} from '@nestjs/common';
import { ArtistService } from 'src/artist/artist.service';
import { AlbumService } from 'src/album/album.service';
import { TrackService } from 'src/track/track.service';
import { Favorites } from 'src/types/types';

@Injectable()
export class FavsService {
  favorites: Favorites = { artists: [], albums: [], tracks: [] };

  constructor(
    @Inject(forwardRef(() => ArtistService))
    private ArtistService: ArtistService,
    @Inject(forwardRef(() => AlbumService))
    private AlbumService: AlbumService,
    @Inject(forwardRef(() => TrackService))
    private TrackService: TrackService,
  ) {}

  findAll() {
    return this.favorites;
  }

  addTrack(id: string) {
    const track = this.TrackService.tracks.find((track) => track.id === id);

    if (!track) {
      throw new HttpException('Track with this id not found', 422);
    }

    this.favorites.tracks.push(track);

    return track;
  }

  deleteTrack(id: string) {
    const favoriteTrack = this.favorites.tracks.find(
      (track) => track.id === id,
    );

    if (!favoriteTrack) {
      throw new NotFoundException('Track with this id not found');
    }

    this.favorites.tracks = this.favorites.tracks.filter(
      (track) => track.id !== favoriteTrack.id,
    );
  }

  addAlbum(id: string) {
    const album = this.AlbumService.albums.find((album) => album.id === id);

    if (!album) {
      throw new HttpException('Album with this id not found', 422);
    }

    this.favorites.albums.push(album);

    return album;
  }

  deleteAlbum(id: string) {
    const favoriteAlbum = this.favorites.albums.find(
      (album) => album.id === id,
    );

    if (!favoriteAlbum) {
      throw new NotFoundException('Track with this id not found');
    }

    this.favorites.albums = this.favorites.albums.filter(
      (album) => album.id !== favoriteAlbum.id,
    );
  }

  addArtist(id: string) {
    const artist = this.ArtistService.artists.find(
      (artist) => artist.id === id,
    );

    if (!artist) {
      throw new HttpException('Artist with this id not found', 422);
    }

    this.favorites.artists.push(artist);

    return artist;
  }

  deleteArtist(id: string) {
    const favoriteArtist = this.favorites.artists.find(
      (artist) => artist.id === id,
    );

    if (!favoriteArtist) {
      throw new NotFoundException('Track with this id not found');
    }

    this.favorites.artists = this.favorites.artists.filter(
      (artist) => artist.id !== favoriteArtist.id,
    );
  }
}

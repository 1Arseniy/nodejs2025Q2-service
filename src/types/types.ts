export interface TypeUser {
  id: string;
  login: string;
  password: string;
  version: number;
  createdAt: number;
  updatedAt: number;
}

export type Users = TypeUser[];

export interface TypeArtist {
  id: string;
  name: string;
  grammy: boolean;
}

export type Artists = TypeArtist[];

export interface TypeTrack {
  id: string;
  name: string;
  artistId: string | null;
  albumId: string | null;
  duration: number;
}

export type Tracks = TypeTrack[];

export interface TypeAlbum {
  id: string;
  name: string;
  year: number;
  artistId: string | null;
}

export type Albums = TypeAlbum[];

export interface Favorites {
  artists: Artists;
  albums: Albums;
  tracks: Tracks;
}

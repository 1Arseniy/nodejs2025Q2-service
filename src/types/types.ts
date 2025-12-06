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

export interface Track {
  id: string;
  name: string;
  artistId: string | null;
  albumId: string | null;
  duration: number;
}

export type Tracks = Track[];

export interface Album {
  id: string;
  name: string;
  year: number;
  artistId: string | null;
}

export type Albums = Album[];

export interface Favorites {
  artists: Artists;
  albums: Albums;
  tracks: Tracks;
}

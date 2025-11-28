export interface User {
  id: string;
  login: string;
  password: string;
  version: number;
  createdAt: number;
  updatedAt: number;
}

export type Users = User[];

export interface Artist {
  id: string;
  name: string;
  grammy: boolean;
}

export type Artists = Artist[];

export interface Track {
  id: string;
  name: string;
  artistId: string | null; // refers to Artist
  albumId: string | null; // refers to Album
  duration: number; // integer number
}

export type Tracks = Track[];

export interface Album {
  id: string;
  name: string;
  year: number;
  artistId: string | null;
}

export type Albums = Album[];

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

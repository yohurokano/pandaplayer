export interface MusicFile {
  id: string;
  title: string;
  artist: string;
  album?: string;
  path?: string;
  file?: File;  // Store the actual file object
  duration: number;
  coverArt?: string;
  year?: number;
  genre?: string;
}

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  songs: string[]; // Array of song IDs
  coverArt?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MusicLibrary {
  songs: Record<string, MusicFile>;
  playlists: Record<string, Playlist>;
  directories: string[];
}

export type SortBy = 'title' | 'artist' | 'album' | 'duration' | 'date';
export type SortOrder = 'asc' | 'desc';

export type ViewMode = 'grid' | 'list';

import type { MusicFile, Playlist, MusicLibrary } from '../types/music';
import { v4 as uuidv4 } from 'uuid';

// Function to extract music file metadata
const extractMusicMetadata = (file: File): MusicFile => {
  // Extract file name without extension
  const fullName = file.name;
  const lastDot = fullName.lastIndexOf('.');
  const fileName = lastDot > 0 ? fullName.substring(0, lastDot) : fullName;
  
  // Try to parse artist and title from filename (assuming format: Artist - Title.mp3)
  let artist = 'Unknown Artist';
  let title = fileName;
  
  const separatorIndex = fileName.indexOf(' - ');
  if (separatorIndex > 0) {
    artist = fileName.substring(0, separatorIndex).trim();
    title = fileName.substring(separatorIndex + 3).trim();
  }
  
  // Try to guess genre from file name or path
  let genre = 'Pop';
  const lowerFileName = fileName.toLowerCase();
  if (lowerFileName.includes('chill') || lowerFileName.includes('relax')) {
    genre = 'Chill';
  } else if (lowerFileName.includes('lofi') || lowerFileName.includes('lo-fi')) {
    genre = 'Lofi';
  } else if (lowerFileName.includes('ambient') || lowerFileName.includes('space')) {
    genre = 'Ambient';
  } else if (lowerFileName.includes('k-pop') || lowerFileName.includes('kpop')) {
    genre = 'K-pop';
  }
  
  return {
    id: uuidv4(),
    title: title,
    artist: artist,
    album: file.webkitRelativePath?.split('/')[1] || 'Unknown Album',
    file: file, // Store the actual file object instead of a blob URL
    duration: 180, // Default duration estimate (3 minutes)
    genre: genre,
    year: new Date().getFullYear()
  };
};

// Function to scan directories for music files
// In a real app with full filesystem access, this would be more robust
export const scanDirectory = async (directoryPath: string, fileList?: FileList | null): Promise<MusicFile[]> => {
  console.log(`Scanning directory: ${directoryPath}`);
  
  // Check if we have actual files from a file input
  if (fileList && fileList.length > 0) {
    console.log(`Found ${fileList.length} files from input`);
    
    // Filter only audio files
    const audioFiles: File[] = [];
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      console.log(`File ${i}: ${file.name}, type: ${file.type}`);
      
      // Accept files with audio MIME types or common audio extensions if type is empty
      if (file.type.startsWith('audio/') || 
          /\.(mp3|wav|ogg|m4a|flac|aac)$/i.test(file.name)) {
        audioFiles.push(file);
        console.log(`Added audio file: ${file.name}`);
      }
    }
    
    console.log(`Found ${audioFiles.length} audio files`);
    
    // Process audio files
    if (audioFiles.length > 0) {
      const musicFiles = audioFiles.map(extractMusicMetadata);
      console.log('Generated music files:', musicFiles);
      return musicFiles;
    }
  }
  
  // Fallback to mock files if no real files provided or if no audio files found
  console.log("Using mock files as fallback");
  return new Promise((resolve) => {
    // Generate between 5-10 files based on the directory name
    const count = Math.floor(Math.random() * 5) + 5;
    
    // Short delay to simulate processing
    setTimeout(() => {
      resolve(generateMockMusicFiles(count, directoryPath));
    }, 500);
  });
};

// Song title templates based on genres
const songTitlesByGenre: Record<string, string[]> = {
  'Pop': ['Happy Days', 'Sunshine', 'Dancing Stars', 'Dreamy Love', 'Pink Clouds'],
  'Lofi': ['Rainy Day', 'Study Session', 'Chill Vibes', 'Nostalgia', 'Late Night'],
  'Chill': ['Ocean Waves', 'Summer Breeze', 'Lazy Sunday', 'Peaceful Mind', 'Gentle Wind'],
  'Ambient': ['Deep Space', 'Forest Whispers', 'Mountain Echo', 'Twilight Zone', 'Cosmic Journey'],
  'K-pop': ['Pink Heart', 'Sweet Dream', 'Magic Dance', 'Starlight', 'Neon Glow']
};

// Album names based on directory
const getAlbumName = (dirName: string): string => {
  if (!dirName) return 'Unknown Album';
  
  // Clean up the directory name
  const cleanName = dirName.replace(/[^a-zA-Z0-9 ]/g, ' ').trim();
  
  // Create album name based on directory
  return `${cleanName.charAt(0).toUpperCase() + cleanName.slice(1)} Collection`;
};

// Mock function to generate fake music data
const generateMockMusicFiles = (count: number, directoryName?: string): MusicFile[] => {
  const artists = ['Bamboo Beats', 'Pink Panda', 'Fluffy Clouds', 'Pastel Dreams', 'Forest Friends'];
  const dirAlbum = directoryName ? getAlbumName(directoryName) : 'Panda Favorites';
  const albums = [dirAlbum, 'Panda Paradise', 'Pastel Pink', 'Bamboo Bliss', 'Sweet Dreams'];
  const genres = ['Pop', 'Lofi', 'Chill', 'Ambient', 'K-pop'];
  
  // Use directory name to seed genre selection
  let genreIndex = 0;
  if (directoryName) {
    genreIndex = directoryName.length % genres.length;
  }
  const primaryGenre = genres[genreIndex];
  
  return Array.from({ length: count }, (_, i) => {
    // Pick a genre, favoring the primary genre
    const genre = Math.random() > 0.3 ? primaryGenre : genres[Math.floor(Math.random() * genres.length)];
    
    // Pick a title from the genre-specific list or default
    const genreTitles = songTitlesByGenre[genre] || songTitlesByGenre['Pop'];
    const titleIndex = (i + (directoryName?.length || 0)) % genreTitles.length;
    const title = genreTitles[titleIndex] + (i > genreTitles.length - 1 ? ` ${Math.floor(i / genreTitles.length) + 1}` : '');
    
    return {
      id: uuidv4(),
      title: title,
      artist: artists[Math.floor(Math.random() * artists.length)],
      album: albums[Math.floor(Math.random() * albums.length)],
      path: `/music/song_${i + 1}.mp3`,
      duration: Math.floor(Math.random() * 300) + 60, // 1-6 minutes
      genre: genre,
      year: Math.floor(Math.random() * 5) + 2018 // 2018-2023
    };
  });
};

// Create a new playlist
export const createPlaylist = (
  library: MusicLibrary,
  name: string,
  description?: string,
  songIds: string[] = []
): MusicLibrary => {
  const newPlaylist: Playlist = {
    id: uuidv4(),
    name,
    description,
    songs: songIds,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  return {
    ...library,
    playlists: {
      ...library.playlists,
      [newPlaylist.id]: newPlaylist
    }
  };
};

// Add songs to a playlist
export const addSongsToPlaylist = (
  library: MusicLibrary,
  playlistId: string,
  songIds: string[]
): MusicLibrary => {
  const playlist = library.playlists[playlistId];
  if (!playlist) return library;
  
  const updatedPlaylist: Playlist = {
    ...playlist,
    songs: [...new Set([...playlist.songs, ...songIds])], // Ensure no duplicates
    updatedAt: new Date()
  };
  
  return {
    ...library,
    playlists: {
      ...library.playlists,
      [playlistId]: updatedPlaylist
    }
  };
};

// Remove songs from a playlist
export const removeSongsFromPlaylist = (
  library: MusicLibrary,
  playlistId: string,
  songIds: string[]
): MusicLibrary => {
  const playlist = library.playlists[playlistId];
  if (!playlist) return library;
  
  const updatedPlaylist: Playlist = {
    ...playlist,
    songs: playlist.songs.filter(id => !songIds.includes(id)),
    updatedAt: new Date()
  };
  
  return {
    ...library,
    playlists: {
      ...library.playlists,
      [playlistId]: updatedPlaylist
    }
  };
};

// Delete a playlist
export const deletePlaylist = (
  library: MusicLibrary,
  playlistId: string
): MusicLibrary => {
  const { [playlistId]: _, ...remainingPlaylists } = library.playlists;
  
  return {
    ...library,
    playlists: remainingPlaylists
  };
};

// Get a new empty library
export const getEmptyLibrary = (): MusicLibrary => ({
  songs: {},
  playlists: {},
  directories: []
});

// Save the library to localStorage
export const saveLibrary = (library: MusicLibrary): void => {
  try {
    localStorage.setItem('pandaPlayerLibrary', JSON.stringify(library));
  } catch (error) {
    console.error('Failed to save library to localStorage:', error);
  }
};

// Load the library from localStorage
export const loadLibrary = (): MusicLibrary => {
  try {
    const savedLibrary = localStorage.getItem('pandaPlayerLibrary');
    if (savedLibrary) {
      const parsed = JSON.parse(savedLibrary);
      
      // Convert date strings back to Date objects
      Object.values(parsed.playlists).forEach((playlist: any) => {
        if (playlist) {
          playlist.createdAt = new Date(playlist.createdAt);
          playlist.updatedAt = new Date(playlist.updatedAt);
        }
      });
      
      return parsed;
    }
  } catch (error) {
    console.error('Failed to load library from localStorage:', error);
  }
  
  return getEmptyLibrary();
};

// Add a directory to the library
export const addDirectory = (
  library: MusicLibrary,
  directoryPath: string
): MusicLibrary => {
  if (library.directories.includes(directoryPath)) {
    return library;
  }
  
  return {
    ...library,
    directories: [...library.directories, directoryPath]
  };
};

// Remove a directory from the library
export const removeDirectory = (
  library: MusicLibrary,
  directoryPath: string
): MusicLibrary => {
  return {
    ...library,
    directories: library.directories.filter(dir => dir !== directoryPath)
  };
};

// Delete a song from the library
export const deleteSong = (
  library: MusicLibrary,
  songId: string
): MusicLibrary => {
  // Create a new songs record without the deleted song
  const newSongs = { ...library.songs };
  delete newSongs[songId];
  
  // Also remove the song from any playlists
  const updatedPlaylists: Record<string, Playlist> = {};
  Object.entries(library.playlists).forEach(([id, playlist]) => {
    updatedPlaylists[id] = {
      ...playlist,
      songs: playlist.songs.filter(songIdToCheck => songIdToCheck !== songId)
    };
  });
  
  // Return updated library
  return {
    ...library,
    songs: newSongs,
    playlists: updatedPlaylists
  };
};

// Delete multiple songs from the library
export const deleteSongs = (
  library: MusicLibrary,
  songIds: string[]
): MusicLibrary => {
  // Handle single song deletion with existing function
  if (songIds.length === 1) {
    return deleteSong(library, songIds[0]);
  }
  
  // Create a new songs record without the deleted songs
  const newSongs = { ...library.songs };
  songIds.forEach(id => {
    delete newSongs[id];
  });
  
  // Also remove the songs from any playlists
  const updatedPlaylists: Record<string, Playlist> = {};
  Object.entries(library.playlists).forEach(([id, playlist]) => {
    updatedPlaylists[id] = {
      ...playlist,
      songs: playlist.songs.filter(songIdToCheck => !songIds.includes(songIdToCheck))
    };
  });
  
  // Return updated library
  return {
    ...library,
    songs: newSongs,
    playlists: updatedPlaylists
  };
};

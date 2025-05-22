import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { MusicFile, MusicLibrary, SortBy, SortOrder, ViewMode } from '../types/music';
// We still need Playlist type internally
import type { Playlist } from '../types/music';
import {
  scanDirectory,
  getEmptyLibrary,
  loadLibrary,
  saveLibrary,
  createPlaylist,
  addSongsToPlaylist,
  removeSongsFromPlaylist,
  deletePlaylist,
  addDirectory,
  removeDirectory,
  deleteSong,
  deleteSongs
} from '../services/MusicLibraryService';

interface MusicLibraryContextProps {
  library: MusicLibrary;
  isLoading: boolean;
  currentSortBy: SortBy;
  currentSortOrder: SortOrder;
  viewMode: ViewMode;
  selectedSongIds: string[];
  scanDirectoryForMusic: (path: string, fileList?: FileList | null) => Promise<void>;
  createNewPlaylist: (name: string, description?: string, songIds?: string[]) => void;
  addSongsToExistingPlaylist: (playlistId: string, songIds: string[]) => void;
  removeSongsFromExistingPlaylist: (playlistId: string, songIds: string[]) => void;
  deleteExistingPlaylist: (playlistId: string) => void;
  addMusicDirectory: (path: string) => void;
  removeMusicDirectory: (path: string) => void;
  setSortBy: (sortBy: SortBy) => void;
  setSortOrder: (order: SortOrder) => void;
  setViewMode: (mode: ViewMode) => void;
  toggleSongSelection: (songId: string) => void;
  selectAllSongs: () => void;
  clearSongSelection: () => void;
  deleteSingleSong: (songId: string) => void;
  deleteSelectedSongs: () => void;
}

const MusicLibraryContext = createContext<MusicLibraryContextProps | undefined>(undefined);

export const MusicLibraryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [library, setLibrary] = useState<MusicLibrary>(getEmptyLibrary());
  const [isLoading, setIsLoading] = useState(false);
  const [currentSortBy, setCurrentSortBy] = useState<SortBy>('title');
  const [currentSortOrder, setCurrentSortOrder] = useState<SortOrder>('asc');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [selectedSongIds, setSelectedSongIds] = useState<string[]>([]);

  // Load library from localStorage on component mount
  useEffect(() => {
    const savedLibrary = loadLibrary();
    setLibrary(savedLibrary);
  }, []);

  // Save library to localStorage whenever it changes
  useEffect(() => {
    saveLibrary(library);
  }, [library]);

  // Scan a directory for music files
  const scanDirectoryForMusic = async (path: string, fileList?: FileList | null) => {
    setIsLoading(true);
    try {
      // Pass actual files if provided
      const newSongs = await scanDirectory(path, fileList);
      
      // Convert array to record with ID as key
      const songsRecord = newSongs.reduce<Record<string, MusicFile>>((acc, song) => {
        acc[song.id] = song;
        return acc;
      }, {});
      
      // Update library with new songs and directory
      setLibrary(prevLibrary => ({
        ...prevLibrary,
        songs: { ...prevLibrary.songs, ...songsRecord },
        directories: [...new Set([...prevLibrary.directories, path])]
      }));
    } catch (error) {
      console.error('Error scanning directory:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Create a new playlist
  const createNewPlaylist = (name: string, description?: string, songIds: string[] = []) => {
    setLibrary(prevLibrary => createPlaylist(prevLibrary, name, description, songIds));
  };

  // Add songs to an existing playlist
  const addSongsToExistingPlaylist = (playlistId: string, songIds: string[]) => {
    setLibrary(prevLibrary => addSongsToPlaylist(prevLibrary, playlistId, songIds));
  };

  // Remove songs from an existing playlist
  const removeSongsFromExistingPlaylist = (playlistId: string, songIds: string[]) => {
    setLibrary(prevLibrary => removeSongsFromPlaylist(prevLibrary, playlistId, songIds));
  };

  // Delete an existing playlist
  const deleteExistingPlaylist = (playlistId: string) => {
    setLibrary(prevLibrary => deletePlaylist(prevLibrary, playlistId));
  };

  // Add a music directory
  const addMusicDirectory = (path: string) => {
    setLibrary(prevLibrary => addDirectory(prevLibrary, path));
  };

  // Remove a music directory
  const removeMusicDirectory = (path: string) => {
    setLibrary(prevLibrary => removeDirectory(prevLibrary, path));
  };

  // Set sort by field
  const setSortBy = (sortBy: SortBy) => {
    setCurrentSortBy(sortBy);
  };

  // Set sort order
  const setSortOrder = (order: SortOrder) => {
    setCurrentSortOrder(order);
  };

  // Toggle song selection
  const toggleSongSelection = (songId: string) => {
    setSelectedSongIds(prevSelected => {
      if (prevSelected.includes(songId)) {
        return prevSelected.filter(id => id !== songId);
      } else {
        return [...prevSelected, songId];
      }
    });
  };

  // Select all songs
  const selectAllSongs = () => {
    setSelectedSongIds(Object.keys(library.songs));
  };

  // Clear song selection
  const clearSongSelection = () => {
    setSelectedSongIds([]);
  };
  
  // Delete a single song
  const deleteSingleSong = (songId: string) => {
    setLibrary(prevLibrary => deleteSong(prevLibrary, songId));
    // If the song was selected, remove it from selection
    if (selectedSongIds.includes(songId)) {
      setSelectedSongIds(prev => prev.filter(id => id !== songId));
    }
  };
  
  // Delete all selected songs
  const deleteSelectedSongs = () => {
    if (selectedSongIds.length === 0) return;
    
    setLibrary(prevLibrary => deleteSongs(prevLibrary, selectedSongIds));
    // Clear selection after deletion
    clearSongSelection();
  };

  const value: MusicLibraryContextProps = {
    library,
    isLoading,
    currentSortBy,
    currentSortOrder,
    viewMode,
    selectedSongIds,
    scanDirectoryForMusic,
    createNewPlaylist,
    addSongsToExistingPlaylist,
    removeSongsFromExistingPlaylist,
    deleteExistingPlaylist,
    addMusicDirectory,
    removeMusicDirectory,
    setSortBy,
    setSortOrder,
    setViewMode,
    toggleSongSelection,
    selectAllSongs,
    clearSongSelection,
    deleteSingleSong,
    deleteSelectedSongs
  };

  return (
    <MusicLibraryContext.Provider value={value}>
      {children}
    </MusicLibraryContext.Provider>
  );
};

// Custom hook to use the music library context
export const useMusicLibrary = () => {
  const context = useContext(MusicLibraryContext);
  if (context === undefined) {
    throw new Error('useMusicLibrary must be used within a MusicLibraryProvider');
  }
  return context;
};

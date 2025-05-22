import React, { useState } from 'react';
import styled from 'styled-components';
import FileSelector from './FileSelector';
import SongList from './SongList';
import PlaylistManager from './PlaylistManager';
import { useMusicLibrary } from '../../context/MusicLibraryContext';

const Container = styled.div`
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: ${props => props.theme.spacing.lg};
  width: 100%;
  
  @media (max-width: 1024px) {
    grid-template-columns: 250px 1fr;
    gap: ${props => props.theme.spacing.md};
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.lg};
  
  @media (max-width: 768px) {
    flex-direction: column;
    margin-bottom: ${props => props.theme.spacing.lg};
  }
  
  @media (max-width: 600px) {
    gap: ${props => props.theme.spacing.md};
  }
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow-x: hidden;
  
  @media (max-width: 768px) {
    margin-top: 0;
  }
`;

const Library: React.FC<{ onPlaySong: (songId: string) => void }> = ({ onPlaySong }) => {
  const { library, createNewPlaylist, deleteExistingPlaylist, selectedSongIds } = useMusicLibrary();
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | undefined>(undefined);
  
  const handlePlaylistSelect = (playlistId: string) => {
    setSelectedPlaylistId(playlistId);
  };
  
  const handleDeletePlaylist = (playlistId: string) => {
    deleteExistingPlaylist(playlistId);
    if (selectedPlaylistId === playlistId) {
      setSelectedPlaylistId(undefined);
    }
  };
  
  const handleCreatePlaylist = (name: string, description: string, songIds: string[]) => {
    createNewPlaylist(name, description, songIds);
  };
  
  // Get songs for the selected playlist, or all songs if no playlist is selected
  const getSongsToDisplay = () => {
    if (selectedPlaylistId) {
      const playlist = library.playlists[selectedPlaylistId];
      if (playlist) {
        return playlist.songs.map(songId => library.songs[songId]).filter(Boolean);
      }
    }
    return undefined; // Show all songs
  };
  
  return (
    <Container>
      <Sidebar>
        <FileSelector />
        <PlaylistManager 
          onSelectPlaylist={handlePlaylistSelect}
          selectedPlaylistId={selectedPlaylistId}
          onDeletePlaylist={handleDeletePlaylist}
          onCreatePlaylist={handleCreatePlaylist}
          playlists={Object.values(library.playlists)}
          selectedSongIds={selectedSongIds}
        />
      </Sidebar>
      <MainContent>
        <SongList 
          songs={getSongsToDisplay()}
          onPlay={onPlaySong}
        />
      </MainContent>
    </Container>
  );
};

export default Library;

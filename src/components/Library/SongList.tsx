import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { Music, Clock, Heart, Plus, Play, RefreshCw, Upload, Trash2 } from 'lucide-react';
import type { MusicFile } from '../../types/music';
import { useMusicLibrary } from '../../context/MusicLibraryContext';

const Container = styled.div`
  background-color: ${props => props.theme.colors.tertiary};
  border-radius: ${props => props.theme.borderRadius.large};
  padding: ${props => props.theme.spacing.lg};
  box-shadow: ${props => props.theme.shadows.soft};
  overflow: hidden;
  border: 1px solid rgba(255, 192, 203, 0.2);
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 5px;
    background: linear-gradient(to right, ${props => props.theme.colors.primary}, transparent);
  }
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    padding: ${props => props.theme.spacing.md};
  }
`;

const Title = styled.h2`
  font-size: ${props => props.theme.fontSize.lg};
  margin-bottom: ${props => props.theme.spacing.md};
  color: ${props => props.theme.colors.secondary};
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.md};
`;

const ActionsContainer = styled.div`
  display: flex;
  gap: 8px;
`;

const ScanButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${props => props.theme.borderRadius.medium};
  padding: 8px 16px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.theme.colors.secondary};
    transform: translateY(-2px);
  }
  
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

// Create a keyframe animation for the loading spinner
const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

// Apply the animation to the rotating class
const RotatingIcon = styled(RefreshCw)`
  animation: ${spin} 1.5s linear infinite;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  
  @media (max-width: 900px) {
    display: block;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    white-space: nowrap;
    border: 1px solid rgba(0, 0, 0, 0.05);
    border-radius: ${props => props.theme.borderRadius.medium};
  }
`;

const TableHeader = styled.thead`
  border-bottom: 2px solid rgba(0, 0, 0, 0.1);
`;

const TableHeaderRow = styled.tr``;

const TableHeaderCell = styled.th`
  text-align: left;
  padding: ${props => props.theme.spacing.sm};
  font-size: ${props => props.theme.fontSize.sm};
  color: ${props => props.theme.colors.secondaryText};
`;

const TableBody = styled.tbody``;

const TableRow = styled.tr<{ $isSelected: boolean }>`
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  background-color: ${props => props.$isSelected ? 'rgba(255, 192, 203, 0.1)' : 'transparent'};
  transition: all 0.2s ease;
  
  &:hover {
    background-color: rgba(255, 192, 203, 0.05);
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.02);
  }
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    &:hover {
      transform: none;
      box-shadow: none;
    }
  }
`;

const TableCell = styled.td`
  padding: ${props => props.theme.spacing.sm};
  font-size: ${props => props.theme.fontSize.sm};
  color: ${props => props.theme.colors.text};
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.secondary};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${props => props.theme.spacing.xs};
  opacity: 0.7;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(255, 192, 203, 0.1);
    border-radius: 50%;
    transform: scale(0);
    transition: transform 0.3s ease;
  }
  
  &:hover {
    color: ${props => props.theme.colors.primary};
    opacity: 1;
    transform: scale(1.2);
    
    &::before {
      transform: scale(1.5);
    }
  }
`;

const NoSongsMessage = styled.div`
  padding: ${props => props.theme.spacing.xl};
  text-align: center;
  color: ${props => props.theme.colors.secondaryText};
  font-size: ${props => props.theme.fontSize.md};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  
  &::before {
    content: '🎵';
    font-size: 3rem;
    margin-bottom: ${props => props.theme.spacing.md};
    opacity: 0.3;
  }
`;

const SortableHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
  cursor: pointer;
  
  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

const SortIndicator = styled.span`
  font-size: 10px;
`;

const Checkbox = styled.input.attrs({ type: 'checkbox' })`
  cursor: pointer;
  width: 18px;
  height: 18px;
  accent-color: ${props => props.theme.colors.primary};
  position: relative;
  transition: all 0.2s ease;
  
  &:checked {
    transform: scale(1.1);
  }
  
  &:hover {
    transform: scale(1.1);
  }
`;

const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

interface SongListProps {
  songs?: MusicFile[];
  hideCheckboxes?: boolean;
  onPlay: (songId: string) => void;
}

const SongList: React.FC<SongListProps> = ({ songs, hideCheckboxes = false, onPlay }) => {
  const {
    library,
    currentSortBy,
    currentSortOrder,
    setSortBy,
    setSortOrder,
    selectedSongIds,
    toggleSongSelection,
    selectAllSongs,
    clearSongSelection,
    scanDirectoryForMusic,
    isLoading,
    deleteSingleSong,
    deleteSelectedSongs
  } = useMusicLibrary();
  
  // For file input handling
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [fileCount, setFileCount] = useState(0);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Use provided songs or get from library
  const songsToDisplay = songs || Object.values(library.songs);
  
  // Handle sorting
  const handleSort = (field: 'title' | 'artist' | 'album' | 'duration') => {
    if (currentSortBy === field) {
      setSortOrder(currentSortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };
  
  // Handle select all checkbox
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      selectAllSongs();
    } else {
      clearSongSelection();
    }
  };
  
  // Sort songs
  const sortedSongs = [...songsToDisplay].sort((a, b) => {
    let comparison = 0;
    
    switch (currentSortBy) {
      case 'title':
        comparison = a.title.localeCompare(b.title);
        break;
      case 'artist':
        comparison = a.artist.localeCompare(b.artist);
        break;
      case 'album':
        comparison = (a.album || '').localeCompare(b.album || '');
        break;
      case 'duration':
        comparison = a.duration - b.duration;
        break;
      default:
        comparison = 0;
    }
    
    return currentSortOrder === 'asc' ? comparison : -comparison;
  });
  
  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFiles(e.target.files);
      setFileCount(e.target.files.length);
      
      // Optional: Count audio files
      let audioCount = 0;
      for (let i = 0; i < e.target.files.length; i++) {
        if (e.target.files[i].type.startsWith('audio/')) {
          audioCount++;
        }
      }
      
      console.log(`Selected ${e.target.files.length} files (${audioCount} audio files)`);
    } else {
      setSelectedFiles(null);
      setFileCount(0);
    }
  };
  
  // Handle scan button click
  const handleScanClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  // Handle scanning files
  const handleScanFiles = async () => {
    if (!selectedFiles || selectedFiles.length === 0) {
      alert('Please select music files first');
      return;
    }
    
    // Use a default directory name if none exists
    const directoryPath = library.directories.length > 0 
      ? library.directories[0] 
      : 'My Music Collection';
    
    console.log('Starting music file scan...');
    try {
      await scanDirectoryForMusic(directoryPath, selectedFiles);
      console.log('Scan completed successfully');
      setSelectedFiles(null);
      setFileCount(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error scanning music files:', error);
      alert('There was an error scanning the music files');
    }
  };
  
  // Handle deleting selected songs
  const handleDeleteSelected = () => {
    if (selectedSongIds.length === 0) return;
    
    const songCount = selectedSongIds.length;
    const confirmMessage = `Are you sure you want to delete ${songCount} song${songCount !== 1 ? 's' : ''}?`;
    
    if (window.confirm(confirmMessage)) {
      deleteSelectedSongs();
    }
  };
  
  // Handle deleting a single song
  const handleDeleteSong = (songId: string, songTitle: string) => {
    const confirmMessage = `Are you sure you want to delete "${songTitle}"?`;
    
    if (window.confirm(confirmMessage)) {
      deleteSingleSong(songId);
    }
  };
  
  return (
    <Container>
      <HeaderContainer>
        <Title>
          <Music size={20} />
          Music Library
        </Title>
        <ActionsContainer>
          {selectedSongIds.length > 0 && (
            <ScanButton 
              onClick={handleDeleteSelected} 
              disabled={isLoading} 
              style={{ backgroundColor: '#ff6b6b' }}
            >
              <Trash2 size={16} />
              Delete {selectedSongIds.length} Selected
            </ScanButton>
          )}
          <ScanButton onClick={handleScanClick} disabled={isLoading}>
            {isLoading ? <RotatingIcon size={16} /> : <Upload size={16} />}
            Import Music
          </ScanButton>
        </ActionsContainer>
        <input 
          type="file" 
          ref={fileInputRef}
          style={{ display: 'none' }}
          multiple
          accept="audio/*"
          onChange={handleFileChange}
        />
      </HeaderContainer>
      {selectedFiles && selectedFiles.length > 0 && (
        <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>{fileCount} file{fileCount !== 1 ? 's' : ''} selected</span>
            <ScanButton onClick={handleScanFiles} disabled={isLoading} style={{ padding: '4px 8px' }}>
              {isLoading ? <RotatingIcon size={14} /> : <RefreshCw size={14} />}
              Scan Files
            </ScanButton>
          </div>
        </div>
      )}
      
      {songsToDisplay.length > 0 ? (
        <Table>
          <TableHeader>
            <TableHeaderRow>
              {!hideCheckboxes && (
                <TableHeaderCell style={{ width: '40px' }}>
                  <Checkbox 
                    checked={selectedSongIds.length === songsToDisplay.length && songsToDisplay.length > 0}
                    onChange={handleSelectAll}
                  />
                </TableHeaderCell>
              )}
              <TableHeaderCell>
                <SortableHeader onClick={() => handleSort('title')}>
                  Title
                  {currentSortBy === 'title' && (
                    <SortIndicator>
                      {currentSortOrder === 'asc' ? '▲' : '▼'}
                    </SortIndicator>
                  )}
                </SortableHeader>
              </TableHeaderCell>
              <TableHeaderCell>
                <SortableHeader onClick={() => handleSort('artist')}>
                  Artist
                  {currentSortBy === 'artist' && (
                    <SortIndicator>
                      {currentSortOrder === 'asc' ? '▲' : '▼'}
                    </SortIndicator>
                  )}
                </SortableHeader>
              </TableHeaderCell>
              <TableHeaderCell>
                <SortableHeader onClick={() => handleSort('album')}>
                  Album
                  {currentSortBy === 'album' && (
                    <SortIndicator>
                      {currentSortOrder === 'asc' ? '▲' : '▼'}
                    </SortIndicator>
                  )}
                </SortableHeader>
              </TableHeaderCell>
              <TableHeaderCell style={{ width: '80px' }}>
                <SortableHeader onClick={() => handleSort('duration')}>
                  <Clock size={14} />
                  {currentSortBy === 'duration' && (
                    <SortIndicator>
                      {currentSortOrder === 'asc' ? '▲' : '▼'}
                    </SortIndicator>
                  )}
                </SortableHeader>
              </TableHeaderCell>
              <TableHeaderCell style={{ width: '80px' }}></TableHeaderCell>
            </TableHeaderRow>
          </TableHeader>
          <TableBody>
            {sortedSongs.map(song => (
              <TableRow 
                key={song.id} 
                $isSelected={selectedSongIds.includes(song.id)}
                onClick={() => !hideCheckboxes && toggleSongSelection(song.id)}
              >
                {!hideCheckboxes && (
                  <TableCell onClick={e => e.stopPropagation()}>
                    <Checkbox 
                      checked={selectedSongIds.includes(song.id)}
                      onChange={() => toggleSongSelection(song.id)}
                    />
                  </TableCell>
                )}
                <TableCell>{song.title}</TableCell>
                <TableCell>{song.artist}</TableCell>
                <TableCell>{song.album || '-'}</TableCell>
                <TableCell>{formatDuration(song.duration)}</TableCell>
                <TableCell>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <ActionButton 
                      onClick={(e) => {
                        e.stopPropagation();
                        onPlay && onPlay(song.id);
                      }}
                      title="Play"
                    >
                      <Play size={16} />
                    </ActionButton>
                    <ActionButton 
                      onClick={(e) => e.stopPropagation()}
                      title="Add to favorites"
                    >
                      <Heart size={16} />
                    </ActionButton>
                    <ActionButton 
                      onClick={(e) => e.stopPropagation()}
                      title="Add to playlist"
                    >
                      <Plus size={16} />
                    </ActionButton>
                    <ActionButton 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteSong(song.id, song.title);
                      }}
                      title="Delete song"
                      style={{ color: '#ff6b6b' }}
                    >
                      <Trash2 size={16} />
                    </ActionButton>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <NoSongsMessage>
          No songs found. Scan your music directories to find songs.
        </NoSongsMessage>
      )}
    </Container>
  );
};

export default SongList;

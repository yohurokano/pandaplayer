import React, { useState } from 'react';
import styled from 'styled-components';
import { ListMusic, Plus, Trash2, Music, Edit, Play } from 'lucide-react';
import type { Playlist } from '../../types/music';

const Container = styled.div`
  background-color: ${props => props.theme.colors.tertiary};
  border-radius: ${props => props.theme.borderRadius.large};
  padding: ${props => props.theme.spacing.lg};
  box-shadow: ${props => props.theme.shadows.soft};
  margin-bottom: ${props => props.theme.spacing.lg};
  border: 1px solid rgba(255, 192, 203, 0.2);
  position: relative;
  overflow: hidden;
  
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

const PlaylistList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  margin-bottom: ${props => props.theme.spacing.md};
`;

const PlaylistItem = styled.div<{ $isSelected: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.medium};
  background-color: ${props => props.$isSelected ? 'rgba(255, 192, 203, 0.1)' : 'transparent'};
  margin-bottom: ${props => props.theme.spacing.sm};
  cursor: pointer;
  transition: all ${props => props.theme.animation.fast} ease;
  border: 1px solid transparent;
  
  &:hover {
    background-color: rgba(255, 192, 203, 0.05);
    transform: translateX(5px);
    border-color: rgba(255, 192, 203, 0.1);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
  }
  
  ${props => props.$isSelected && `
    border-left: 3px solid ${props.theme.colors.primary};
    padding-left: ${props.theme.spacing.md};
  `}
`;

const PlaylistInfo = styled.div`
  flex: 1;
`;

const PlaylistName = styled.div`
  font-size: ${props => props.theme.fontSize.md};
  font-weight: 500;
  color: ${props => props.theme.colors.text};
`;

const PlaylistSongs = styled.div`
  font-size: ${props => props.theme.fontSize.xs};
  color: ${props => props.theme.colors.secondaryText};
`;

const IconButton = styled.button`
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
  z-index: 1;
  
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
    z-index: -1;
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

const ActionButtons = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.xs};
`;

const CreatePlaylistButton = styled.button`
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${props => props.theme.borderRadius.medium};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  font-size: ${props => props.theme.fontSize.sm};
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${props => props.theme.spacing.xs};
  transition: all ${props => props.theme.animation.fast} ease;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      to right,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transition: all 0.6s ease;
  }
  
  &:hover {
    background-color: #ff9cb3; /* Slightly darker pink */
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(255, 192, 203, 0.3);
    
    &::before {
      left: 100%;
    }
  }
  
  &:active {
    transform: translateY(0);
  }
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
    font-size: ${props => props.theme.fontSize.xs};
  }
`;

const CreatePlaylistForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};
  margin-top: ${props => props.theme.spacing.md};
  padding: ${props => props.theme.spacing.md};
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: ${props => props.theme.borderRadius.small};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.xs};
`;

const Label = styled.label`
  font-size: ${props => props.theme.fontSize.sm};
  font-weight: 500;
  color: ${props => props.theme.colors.text};
`;

const PlaylistNameInput = styled.input`
  flex: 1;
  padding: ${props => props.theme.spacing.sm};
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: ${props => props.theme.borderRadius.medium};
  font-size: ${props => props.theme.fontSize.sm};
  margin-right: ${props => props.theme.spacing.sm};
  background-color: rgba(255, 255, 255, 0.9);
  transition: all 0.3s ease;
  
  &:focus {
    border-color: ${props => props.theme.colors.primary};
    outline: none;
    box-shadow: 0 0 0 3px rgba(255, 192, 203, 0.2);
    background-color: #fff;
  }
  
  &::placeholder {
    color: #aaa;
  }
`;

const TextArea = styled.textarea`
  padding: ${props => props.theme.spacing.sm};
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: ${props => props.theme.borderRadius.small};
  font-size: ${props => props.theme.fontSize.sm};
  resize: vertical;
  min-height: 80px;
  
  &:focus {
    border-color: ${props => props.theme.colors.primary};
    outline: none;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${props => props.theme.spacing.sm};
`;

const CancelButton = styled.button`
  background-color: transparent;
  color: ${props => props.theme.colors.secondaryText};
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: ${props => props.theme.borderRadius.small};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  font-size: ${props => props.theme.fontSize.sm};
  font-weight: 500;
  cursor: pointer;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
`;

const SubmitButton = styled.button`
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${props => props.theme.borderRadius.small};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  font-size: ${props => props.theme.fontSize.sm};
  font-weight: 600;
  cursor: pointer;
  
  &:hover {
    background-color: #ff9cb3; /* Slightly darker pink */
  }
`;

const NoPlaylistsMessage = styled.div`
  padding: ${props => props.theme.spacing.xl};
  text-align: center;
  color: ${props => props.theme.colors.secondaryText};
  font-size: ${props => props.theme.fontSize.md};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 120px;
  
  &::before {
    content: '➕';
    font-size: 2rem;
    margin-bottom: ${props => props.theme.spacing.md};
    opacity: 0.3;
  }
`;

interface PlaylistManagerProps {
  onSelectPlaylist: (playlistId: string) => void;
  onDeletePlaylist: (playlistId: string) => void;
  onCreatePlaylist: (playlistName: string, playlistDescription: string, selectedSongIds: string[]) => void;
  selectedPlaylistId?: string;
  playlists: Playlist[];
  selectedSongIds: string[];
}

const PlaylistManager: React.FC<PlaylistManagerProps> = ({ 
  onSelectPlaylist, 
  onDeletePlaylist,
  onCreatePlaylist,
  selectedPlaylistId,
  playlists = [],
  selectedSongIds = []
}) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [playlistName, setPlaylistName] = useState('');
  const [playlistDescription, setPlaylistDescription] = useState('');
  const [editingPlaylistId, setEditingPlaylistId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleSelectPlaylist = (playlistId: string) => {
    onSelectPlaylist(playlistId);
  };

  const handlePlayPlaylist = (playlistId: string) => {
    // Placeholder for play functionality
    console.log(`Play playlist: ${playlistId}`);
  };

  const handleEditPlaylist = (playlistId: string) => {
    // Find the playlist to edit
    const playlistToEdit = playlists.find(p => p.id === playlistId);
    if (!playlistToEdit) return;
    
    // Set form values
    setPlaylistName(playlistToEdit.name);
    setPlaylistDescription(playlistToEdit.description || '');
    setEditingPlaylistId(playlistId);
    setIsEditing(true);
    setShowCreateForm(true);
  };
  
  const handleCreatePlaylist = (e: React.FormEvent) => {
    e.preventDefault();
    if (playlistName.trim()) {
      if (isEditing && editingPlaylistId) {
        // If editing, update the playlist
        // Since we don't have a direct update method, we'll delete and recreate
        const editedPlaylist = playlists.find(p => p.id === editingPlaylistId);
        if (editedPlaylist) {
          onDeletePlaylist(editingPlaylistId);
          onCreatePlaylist(playlistName.trim(), playlistDescription.trim(), editedPlaylist.songs);
        }
      } else {
        // If creating new playlist
        onCreatePlaylist(playlistName.trim(), playlistDescription.trim(), selectedSongIds);
      }
      
      // Reset form
      setPlaylistName('');
      setPlaylistDescription('');
      setShowCreateForm(false);
      setIsEditing(false);
      setEditingPlaylistId(null);
    }
  };
  
  const handleDeletePlaylist = (playlistId: string) => {
    if (window.confirm('Are you sure you want to delete this playlist?')) {
      onDeletePlaylist(playlistId);
    }
  };
  
  return (
    <Container>
      <Title>
        <ListMusic size={20} />
        Playlists
      </Title>
      
      {playlists.length > 0 ? (
        <PlaylistList>
          {playlists.map(playlist => (
            <PlaylistItem
              key={playlist.id}
              $isSelected={selectedPlaylistId === playlist.id}
              onClick={() => handleSelectPlaylist(playlist.id)}
            >
              <PlaylistInfo>
                <PlaylistName>{playlist.name}</PlaylistName>
                <PlaylistSongs>
                  <Music size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                  {playlist.songs.length} songs
                </PlaylistSongs>
              </PlaylistInfo>
              <ActionButtons>
                <IconButton onClick={() => handlePlayPlaylist(playlist.id)}>
                  <Play size={16} />
                </IconButton>
                <IconButton onClick={() => handleEditPlaylist(playlist.id)}>
                  <Edit size={16} />
                </IconButton>
                <IconButton onClick={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  handleDeletePlaylist(playlist.id);
                }}>
                  <Trash2 size={16} />
                </IconButton>
              </ActionButtons>
            </PlaylistItem>
          ))}
        </PlaylistList>
      ) : (
        <NoPlaylistsMessage>
          No playlists created yet
        </NoPlaylistsMessage>
      )}
      
      {showCreateForm ? (
        <CreatePlaylistForm onSubmit={handleCreatePlaylist}>
          <h3>{isEditing ? 'Edit Playlist' : 'Create New Playlist'}</h3>
          <FormGroup>
            <Label htmlFor="playlistName">Playlist Name</Label>
            <PlaylistNameInput
              id="playlistName"
              value={playlistName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPlaylistName(e.target.value)}
              placeholder="Enter playlist name"
              autoFocus
              required
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="playlistDescription">Description (optional)</Label>
            <TextArea 
              id="playlistDescription"
              value={playlistDescription}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setPlaylistDescription(e.target.value)}
              placeholder="A collection of my favorite songs..."
            />
          </FormGroup>
          
          <ButtonGroup>
            <CancelButton 
              type="button" 
              onClick={() => setShowCreateForm(false)}
            >
              Cancel
            </CancelButton>
            <SubmitButton type="submit">
              {isEditing ? 'Update Playlist' : 'Create Playlist'}
            </SubmitButton>
          </ButtonGroup>
        </CreatePlaylistForm>
      ) : (
        <CreatePlaylistButton onClick={() => setShowCreateForm(true)}>
          <Plus size={16} />
          Create Playlist
        </CreatePlaylistButton>
      )}
    </Container>
  );
};

export default PlaylistManager;

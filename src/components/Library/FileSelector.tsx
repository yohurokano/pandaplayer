import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { FolderOpen, Plus, Trash2, Music, RefreshCw, Search } from 'lucide-react';
import { useMusicLibrary } from '../../context/MusicLibraryContext';

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

const DirectoryList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  margin-bottom: ${props => props.theme.spacing.md};
`;

const DirectoryItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${props => props.theme.spacing.sm};
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background-color: rgba(255, 192, 203, 0.05);
  }
`;

const DirectoryPath = styled.span`
  font-size: ${props => props.theme.fontSize.sm};
  color: ${props => props.theme.colors.text};
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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
  
  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

const ScanButton = styled.button`
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
  width: 100%;
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
  
  &:disabled {
    background-color: #d4d4d4;
    cursor: not-allowed;
    transform: none;
  }
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    padding: ${props => props.theme.spacing.md};
  }
`;

const AddDirectoryForm = styled.form`
  display: flex;
  gap: ${props => props.theme.spacing.sm};
  margin-bottom: ${props => props.theme.spacing.md};
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

// Using regular input instead of styled component for file input

const LoadingIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  font-size: ${props => props.theme.fontSize.sm};
  color: ${props => props.theme.colors.secondaryText};
  margin-top: ${props => props.theme.spacing.sm};
`;

const Spinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid rgba(0, 0, 0, 0.1);
  border-top-color: ${props => props.theme.colors.primary};
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const NoDirectoriesMessage = styled.p`
  font-size: ${props => props.theme.fontSize.sm};
  color: ${props => props.theme.colors.secondaryText};
  text-align: center;
  padding: ${props => props.theme.spacing.md};
`;

const FileSelector: React.FC = () => {
  const { 
    library, 
    isLoading, 
    scanDirectoryForMusic, 
    addMusicDirectory, 
    removeMusicDirectory 
  } = useMusicLibrary();
  
  const [newDirectory, setNewDirectory] = useState('');
  
  // Store files from input
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [fileCount, setFileCount] = useState(0);
  
  const handleAddDirectory = (e: React.FormEvent) => {
    e.preventDefault();
    if (newDirectory.trim()) {
      addMusicDirectory(newDirectory.trim());
      setNewDirectory('');
    }
  };
  
  const handleRemoveDirectory = (path: string) => {
    removeMusicDirectory(path);
  };
  
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
  
  const handleScanDirectory = async () => {
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
      
      // Add directory if it doesn't exist
      if (!library.directories.includes(directoryPath)) {
        addMusicDirectory(directoryPath);
      }
    } catch (error) {
      console.error('Error scanning music files:', error);
      alert('There was an error scanning the music files');
    }
  };
  
  return (
    <Container>
      <Title>
        <FolderOpen size={20} />
        Music Directories
      </Title>
      
      <AddDirectoryForm onSubmit={handleAddDirectory}>
        {/* Use regular input instead of styled component to avoid prop warnings */}
        <div style={{ position: 'relative', flex: 1 }}>
          <input 
            type="text" 
            placeholder="Add folder name (optional)"
            value={newDirectory}
            onChange={(e) => setNewDirectory(e.target.value)}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid rgba(0, 0, 0, 0.1)',
              borderRadius: '8px',
              fontSize: '14px',
              backgroundColor: 'rgba(255, 255, 255, 0.9)'
            }}
          />
        </div>
        <ActionButton type="submit" title="Add Directory">
          <Plus size={18} />
        </ActionButton>
      </AddDirectoryForm>
      
      {/* File selector for actual music files */}
      <div style={{ marginTop: '16px' }}>
        <h4 style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Music size={16} /> Select Music Files
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input 
              type="file" 
              multiple
              accept="audio/*"
              style={{
                flex: 1,
                padding: '8px',
                border: '1px solid rgba(0, 0, 0, 0.1)',
                borderRadius: '8px',
                fontSize: '14px',
                backgroundColor: 'rgba(255, 255, 255, 0.9)'
              }}
              onChange={handleFileChange}
            />
            <ActionButton 
              type="button" 
              onClick={handleScanDirectory}
              disabled={isLoading || !selectedFiles || selectedFiles.length === 0}
              title="Scan Selected Files"
              style={{ backgroundColor: isLoading ? '#ccc' : '#ff85a2' }}
            >
              {isLoading ? <RotatingIcon size={18} /> : <Search size={18} />}
            </ActionButton>
          </div>
          {fileCount > 0 && (
            <span style={{ fontSize: '14px', color: '#666' }}>
              {fileCount} file{fileCount !== 1 ? 's' : ''} selected
              {isLoading && ' - Scanning...'}
            </span>
          )}
        </div>
      </div>
      
      {library.directories.length > 0 ? (
        <DirectoryList>
          {library.directories.map((dir, index) => (
            <DirectoryItem key={index}>
              <DirectoryPath>{dir}</DirectoryPath>
              <ActionButton 
                onClick={() => handleRemoveDirectory(dir)}
                title="Remove Directory"
              >
                <Trash2 size={16} />
              </ActionButton>
            </DirectoryItem>
          ))}
        </DirectoryList>
      ) : (
        <NoDirectoriesMessage>
          No music directories added yet
        </NoDirectoriesMessage>
      )}
      
      <ScanButton 
        onClick={handleScanDirectory} 
        disabled={isLoading || library.directories.length === 0}
      >
        {isLoading ? 'Scanning...' : 'Scan for Music'}
      </ScanButton>
      
      {isLoading && (
        <LoadingIndicator>
          <Spinner />
          Scanning for music files...
        </LoadingIndicator>
      )}
    </Container>
  );
};

export default FileSelector;

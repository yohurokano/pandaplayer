
import { useState } from 'react';
import { ThemeProvider } from 'styled-components';
import Player from './components/Player/Player';
import Library from './components/Library/Library';
import GlobalStyles from './styles/GlobalStyles';
import theme from './styles/theme';
import styled from 'styled-components';
import { MusicLibraryProvider } from './context/MusicLibraryContext';
import { Music, Headphones } from 'lucide-react';

// Create a container for our app
const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  min-height: 100%;
  position: relative;
  padding: ${props => props.theme.spacing.lg};
  max-width: 1400px;
  margin: 0 auto;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    padding: ${props => props.theme.spacing.sm};
  }
`;

// Add a title to our app
const AppTitle = styled.h1`
  font-size: min(8vw, 2.5rem);
  font-weight: 800;
  color: ${props => props.theme.colors.text};
  margin-bottom: 2rem;
  text-align: center;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  letter-spacing: -0.5px;
  
  &::before {
    content: '';
    position: absolute;
    width: 40px;
    height: 40px;
    background-color: rgba(255, 192, 203, 0.3);
    border-radius: 50%;
    z-index: -1;
    left: 0;
    transform: translateX(-50%);
  }
  
  span {
    background: linear-gradient(to right, #ffc0cb, #ff7c98);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  
  .emoji {
    font-size: min(8vw, 2rem);
    display: inline-block;
    margin-left: 10px;
    animation: bounce 2s infinite;
  }
  
  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    margin-bottom: 1rem;
  }
`;

// Tab container for navigation
const TabContainer = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.lg};
  background-color: rgba(255, 255, 255, 0.7);
  padding: ${props => props.theme.spacing.xs};
  border-radius: ${props => props.theme.borderRadius.large};
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: ${props => props.theme.spacing.lg};
  z-index: 10;
  width: fit-content;
  margin-left: auto;
  margin-right: auto;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    width: 100%;
    margin-bottom: ${props => props.theme.spacing.md};
    top: ${props => props.theme.spacing.sm};
  }
`;

// Tab button for navigation
const TabButton = styled.button<{ $isActive: boolean }>`
  background-color: ${props => props.$isActive ? props.theme.colors.primary : 'transparent'};
  color: ${props => props.$isActive ? 'white' : props.theme.colors.secondary};
  border: none;
  border-radius: ${props => props.theme.borderRadius.medium};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  font-size: ${props => props.theme.fontSize.sm};
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
  transition: all ${props => props.theme.animation.fast} ease;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(to right, #ffc0cb, #ff7c98);
    transform: translateY(${props => props.$isActive ? '0' : '-100%'});
    transition: transform 0.3s ease;
  }
  
  &:hover {
    background-color: ${props => props.$isActive ? props.theme.colors.primary : 'rgba(0, 0, 0, 0.05)'};
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
    
    &::before {
      transform: translateY(0);
    }
  }
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    flex: 1;
    justify-content: center;
  }
`;

// Content container
const ContentContainer = styled.div`
  width: 100%;
  flex: 1;
  overflow: visible;
  background-color: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border-radius: ${props => props.theme.borderRadius.large};
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  padding: ${props => props.theme.spacing.lg};
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: -10px;
    right: -10px;
    width: 30px;
    height: 30px;
    background-color: rgba(255, 192, 203, 0.3);
    border-radius: 50%;
    z-index: -1;
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: -15px;
    left: 10%;
    width: 40px;
    height: 40px;
    background-color: rgba(255, 192, 203, 0.2);
    border-radius: 50%;
    z-index: -1;
  }
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    padding: ${props => props.theme.spacing.md};
  }
`;

function App() {
  const [activeTab, setActiveTab] = useState<'player' | 'library'>('player');
  const [currentSongId, setCurrentSongId] = useState<string | undefined>(undefined);
  
  const handlePlaySong = (songId: string) => {
    setCurrentSongId(songId);
    setActiveTab('player');
  };
  
  return (
    <ThemeProvider theme={theme}>
      <MusicLibraryProvider>
        <GlobalStyles />
        <AppContainer>
          <AppTitle>
            <span>Panda Player</span> <span className="emoji">🐼</span>
          </AppTitle>
          
          <TabContainer>
            <TabButton 
              $isActive={activeTab === 'player'}
              onClick={() => setActiveTab('player')}
            >
              <Headphones size={18} /> Player
            </TabButton>
            <TabButton 
              $isActive={activeTab === 'library'}
              onClick={() => setActiveTab('library')}
            >
              <Music size={18} /> Library
            </TabButton>
          </TabContainer>
          
          <ContentContainer>
            {activeTab === 'player' ? (
              <Player songId={currentSongId} />
            ) : (
              <Library onPlaySong={handlePlaySong} />
            )}
          </ContentContainer>
        </AppContainer>
      </MusicLibraryProvider>
    </ThemeProvider>
  );
}

export default App;

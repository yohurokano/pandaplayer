import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, 
  Shuffle, Repeat, ListMusic, Heart, Settings 
} from 'lucide-react';
import { useMusicLibrary } from '../../context/MusicLibraryContext';
import type { ThemeColor } from '../../styles/theme';
import type { Track, RepeatMode } from '../../types/track';
import AuroraWavesVisualizer from './AuroraWavesVisualizer';
import {
  PlayerContainer,
  AlbumArtContainer,
  AlbumArt,
  TrackEmoji,
  PlayerControls,
  TrackInfo,
  TrackTitle,
  TrackArtist,
  TrackGenre,
  ProgressBarContainer,
  ProgressBar,
  Progress,
  TimeDisplay,
  ButtonsContainer,
  PrimaryControls,
  SecondaryControls,
  IconButton,
  PlayButton,
  VolumeContainer,
  VolumeSlider,
  HeartsContainer,
  Heart as HeartIcon,
  SettingsContainer,
  SettingsTitle,
  SettingsOption,
  SettingsLabel,
  OptionButton,
  OptionButtonGroup,
  CloseSettingsButton,
  PlaylistContainer,
  PlaylistTitle,
  PlaylistItem,
  TrackNumber,
  TrackItemInfo,
  TrackItemTitle,
  TrackItemArtist,
  TrackItemDuration,
  ClosePlaylistButton
} from './PlayerStyles';

// Default track to display when no track is selected
const defaultTrack: Track = { 
  id: "default",
  title: "No Track Selected", 
  artist: "Panda Player", 
  albumArtGradient: "pandaPink", 
  durationSeconds: 0, 
  emoji: "🐼", 
  accentColor: "pink", 
  genre: "None" 
};

// Map to store accent colors for different genres
const genreToAccentColor: Record<string, ThemeColor> = {
  'Pop': 'pink',
  'Rock': 'indigo',
  'Hip Hop': 'purple',
  'Electronic': 'sky',
  'Jazz': 'amber',
  'Classical': 'indigo',
  'R&B': 'rose',
  'Country': 'lime',
  'Folk': 'amber',
  'Blues': 'teal',
  'Ambient': 'purple',
  'Lo-fi': 'rose',
  'Chillwave': 'sky',
  'K-pop': 'pink',
  'Chill': 'teal',
};

// Map for emojis based on genre
const genreToEmoji: Record<string, string> = {
  'Pop': '🎵',
  'Rock': '🎸',
  'Hip Hop': '🎤',
  'Electronic': '🎧',
  'Jazz': '🎷',
  'Classical': '🎻',
  'R&B': '🎶',
  'Country': '🤠',
  'Folk': '🪕',
  'Blues': '🎹',
  'Ambient': '✨',
  'Lo-fi': '🌸',
  'Chillwave': '🌊',
  'K-pop': '💖',
  'Chill': '❄️',
};

// Map for album art gradient based on genre
const genreToGradient: Record<string, string> = {
  'Pop': 'pandaPink',
  'Rock': 'pandaContrast',
  'Hip Hop': 'pandaDark',
  'Electronic': 'pandaLight',
  'Jazz': 'pandaMix',
  'Classical': 'pandaPastel',
  'R&B': 'pandaPink',
  'Country': 'pandaLight',
  'Folk': 'pandaPastel',
  'Blues': 'pandaContrast',
  'Ambient': 'pandaLight',
  'Lo-fi': 'pandaPastel',
  'Chillwave': 'pandaLight',
  'K-pop': 'pandaPink',
  'Chill': 'pandaPastel',
};

interface PlayerProps {
  songId?: string;
}

const Player: React.FC<PlayerProps> = ({ songId }) => {
  // Get music library
  const { library } = useMusicLibrary();
  
  // Player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [hearts, setHearts] = useState(3);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>('off');
  const [showSettings, setShowSettings] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [lastHeartClicked, setLastHeartClicked] = useState(-1);
  const [visualizerType, setVisualizerType] = useState<'aurora' | 'cosmic' | 'none'>('aurora');
  
  // Album art tilt effect
  const [albumArtTilt, setAlbumArtTilt] = useState({ x: 0, y: 0 });
  const albumArtRef = useRef<HTMLDivElement>(null);
  
  // State to store tracks converted from library songs
  const [tracks, setTracks] = useState<Track[]>([]);
  
  // Convert library songs to tracks when the library changes
  useEffect(() => {
    if (Object.keys(library.songs).length > 0) {
      const newTracks = Object.values(library.songs).map(song => {
        const genre = song.genre || 'Pop';
        const accentColor = genreToAccentColor[genre] || 'pink';
        const emoji = genreToEmoji[genre] || '🎵';
        const gradient = genreToGradient[genre] || 'pandaPink';
        
        return {
          id: song.id,
          title: song.title,
          artist: song.artist,
          albumArtGradient: gradient as any,
          durationSeconds: song.duration,
          emoji: emoji,
          accentColor: accentColor,
          genre: genre,
          path: song.path, // Include the path to the actual audio file if it exists
          file: song.file // Include the file object for creating fresh blob URLs
        };
      });
      
      setTracks(newTracks);
    }
  }, [library.songs]);
  
  // Set track from songId if provided
  useEffect(() => {
    if (songId && library.songs[songId]) {
      const trackIndex = tracks.findIndex(track => track.id === songId);
      if (trackIndex >= 0) {
        setCurrentTrackIndex(trackIndex);
        setIsPlaying(true);
      }
    }
  }, [songId, library.songs]);
  
  // Use default track if no tracks available
  const currentTrack = tracks.length > 0 ? tracks[currentTrackIndex] || defaultTrack : defaultTrack;
  
  // Audio element reference
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyzerRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  
  // Create ref for track ended handler
  const trackEndedRef = useRef<() => void>(() => {});
  
  // Initialize audio element
  useEffect(() => {
    // Create audio element if it doesn't exist
    if (!audioRef.current) {
      audioRef.current = new Audio();
      
      // Set up Web Audio API for visualizer
      try {
        // Create AudioContext
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        audioContextRef.current = new AudioContext();
        
        // Create analyzer node
        analyzerRef.current = audioContextRef.current.createAnalyser();
        analyzerRef.current.fftSize = 256;
        analyzerRef.current.smoothingTimeConstant = 0.8;
        
        // Connect audio element to analyzer
        sourceRef.current = audioContextRef.current.createMediaElementSource(audioRef.current);
        sourceRef.current.connect(analyzerRef.current);
        analyzerRef.current.connect(audioContextRef.current.destination);
        
        console.log('Audio analyzer setup successfully');
      } catch (err) {
        console.error('Failed to set up audio analyzer:', err);
      }
      
      // Add event listeners
      audioRef.current.addEventListener('timeupdate', () => {
        if (audioRef.current) {
          setCurrentTime(audioRef.current.currentTime);
        }
      });
      
      audioRef.current.addEventListener('loadedmetadata', () => {
        if (audioRef.current) {
          setDuration(audioRef.current.duration);
        }
      });
      
      // We'll set up the ended event handler after nextTrack is defined
      audioRef.current.addEventListener('ended', () => trackEndedRef.current());
    }
    
    // Set initial volume
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
    
    // Clean up on unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);
  
  // Load track when currentTrackIndex changes
  useEffect(() => {
    if (!tracks.length) return;
    
    // Set duration from track data
    setDuration(currentTrack.durationSeconds);
    setCurrentTime(0);
    
    if (audioRef.current) {
      // Stop current playback
      audioRef.current.pause();
      
      // Try to use the file object if it exists, otherwise fallback to path or sample
      console.log('Current track file:', currentTrack.file, 'path:', currentTrack.path);
      
      // Clean up any previous blob URLs to prevent memory leaks
      if (audioRef.current.src.startsWith('blob:')) {
        URL.revokeObjectURL(audioRef.current.src);
      }
      
      if (currentTrack.file) {
        // Create a fresh blob URL from the file object
        const freshBlobUrl = URL.createObjectURL(currentTrack.file);
        console.log('Created fresh blob URL for:', currentTrack.title, freshBlobUrl);
        audioRef.current.src = freshBlobUrl;
      } else if (currentTrack.path && typeof currentTrack.path === 'string') {
        // Use the existing path (might be a remote URL or stored blob)
        console.log('Using existing path for:', currentTrack.title);
        audioRef.current.src = currentTrack.path;
      } else {
        // Fallback to a sample file
        console.log('Using fallback audio for:', currentTrack.title);
        // Use a royalty-free sample based on genre
        const sampleUrl = 'https://s3.amazonaws.com/freecodecamp/drums/Heater-1.mp3';
        audioRef.current.src = sampleUrl;
      }
      
      // Load the audio
      audioRef.current.load();
      
      // Start playing if needed
      if (isPlaying) {
        audioRef.current.play().catch(err => {
          console.error('Error playing audio:', err);
          setIsPlaying(false);
        });
      }
    }
  }, [currentTrackIndex, tracks.length, isPlaying, currentTrack]);
  
  // Control playback when isPlaying changes
  useEffect(() => {
    if (!audioRef.current || !tracks.length) return;
    
    if (isPlaying) {
      audioRef.current.play().catch(err => {
        console.error('Error playing audio:', err);
        setIsPlaying(false);
      });
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, tracks.length]);
  
  // Update volume when it changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);
  
  // Next track function - defined before it's used in the effect
  const nextTrack = useCallback(() => {
    if (tracks.length === 0) return;
    
    let nextIndex;
    if (isShuffled) {
      do { 
        nextIndex = Math.floor(Math.random() * tracks.length); 
      } while (nextIndex === currentTrackIndex && tracks.length > 1);
    } else {
      nextIndex = (currentTrackIndex + 1) % tracks.length;
    }
    
    setCurrentTrackIndex(nextIndex);
    setCurrentTime(0);
    
    // Reset audio if needed
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [tracks.length, currentTrackIndex, isShuffled]);
  
  // Set up track ended handler - after nextTrack is defined
  useEffect(() => {
    trackEndedRef.current = () => {
      if (repeatMode === 'one') {
        if (audioRef.current) {
          audioRef.current.currentTime = 0;
          audioRef.current.play().catch(console.error);
        }
      } else if (repeatMode === 'all' || currentTrackIndex < tracks.length - 1) {
        nextTrack();
      } else {
        setIsPlaying(false);
        setCurrentTime(0);
        if (audioRef.current) {
          audioRef.current.currentTime = 0;
        }
      }
    };
  }, [repeatMode, currentTrackIndex, tracks.length, nextTrack]);
  
  // Previous track function
  const prevTrack = useCallback(() => {
    if (tracks.length === 0) return;
    
    if (currentTime > 3) {
      // If we're more than 3 seconds into the track, restart it
      setCurrentTime(0);
      
      // Reset audio position
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
      }
    } else {
      // Otherwise go to previous track
      let prevIndex;
      
      if (isShuffled) {
        // Get a random track that's not the current one
        do { 
          prevIndex = Math.floor(Math.random() * tracks.length); 
        } while (prevIndex === currentTrackIndex && tracks.length > 1);
      } else {
        // Get the previous track or wrap around to the last track
        prevIndex = currentTrackIndex > 0 ? currentTrackIndex - 1 : tracks.length - 1;
      }
      
      setCurrentTrackIndex(prevIndex);
      setCurrentTime(0);
    }
  }, [currentTrackIndex, currentTime, isShuffled, tracks.length]);
  
  // Toggle play/pause
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };
  
  // Toggle mute
  const toggleMute = () => {
    setIsMuted(!isMuted);
    
    if (audioRef.current) {
      audioRef.current.volume = !isMuted ? 0 : volume;
    }
  };
  
  // Toggle shuffle
  const toggleShuffle = () => {
    setIsShuffled(!isShuffled);
  };
  
  // Cycle repeat mode
  const cycleRepeatMode = () => {
    const modes: RepeatMode[] = ['off', 'all', 'one'];
    const currentIndex = modes.indexOf(repeatMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setRepeatMode(modes[nextIndex]);
  };
  
  // Handle progress bar click
  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const width = rect.width;
    const percentage = offsetX / width;
    const newTime = percentage * duration;
    
    setCurrentTime(newTime);
    
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };
  
  // Handle volume change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
    
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };
  
  // Format time (seconds to mm:ss)
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };
  
  // Handle hearts click
  const handleHeartClick = (index: number) => {
    setLastHeartClicked(index);
    setHearts(index + 1);
    
    // Reset the clicked state after animation
    setTimeout(() => {
      setLastHeartClicked(-1);
    }, 500);
  };
  
  // Album art tilt effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!albumArtRef.current) return;
      
      const rect = albumArtRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      // Calculate the tilt based on mouse position relative to center
      const tiltX = ((e.clientX - centerX) / (rect.width / 2)) * 5;
      const tiltY = ((e.clientY - centerY) / (rect.height / 2)) * -5;
      
      setAlbumArtTilt({ x: tiltX, y: tiltY });
    };
    
    const handleMouseLeave = () => {
      // Reset tilt when mouse leaves
      setAlbumArtTilt({ x: 0, y: 0 });
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    albumArtRef.current?.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      albumArtRef.current?.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);
  
  return (
    <PlayerContainer $accentColor={currentTrack.accentColor as ThemeColor}>
      <AlbumArtContainer ref={albumArtRef} $isPlaying={isPlaying}>
        <AlbumArt 
          $gradient={currentTrack.albumArtGradient} 
          $tiltX={albumArtTilt.x} 
          $tiltY={albumArtTilt.y}
          $isPlaying={isPlaying}
        >
          <TrackEmoji $isPlaying={isPlaying}>{currentTrack.emoji}</TrackEmoji>
          {visualizerType !== 'none' && (
            visualizerType === 'aurora' ? (
              <AuroraWavesVisualizer 
                $isPlaying={isPlaying} 
                $accentColor={currentTrack.accentColor as ThemeColor} 
                analyzerNode={analyzerRef.current}
              />
            ) : (
              // Placeholder for cosmic visualizer - you can create a CosmicVisualizer component later
              <AuroraWavesVisualizer 
                $isPlaying={isPlaying} 
                $accentColor={currentTrack.accentColor as ThemeColor}
                analyzerNode={analyzerRef.current}
              />
            )
          )}
        </AlbumArt>
      </AlbumArtContainer>
      
      <PlayerControls>
        <TrackInfo>
          <TrackTitle>{currentTrack.title}</TrackTitle>
          <TrackArtist>{currentTrack.artist}</TrackArtist>
          <TrackGenre>{currentTrack.genre}</TrackGenre>
        </TrackInfo>
        
        <ProgressBarContainer>
          <ProgressBar onClick={handleProgressBarClick}>
            <Progress $width={(currentTime / duration) * 100} />
          </ProgressBar>
          <TimeDisplay>
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </TimeDisplay>
        </ProgressBarContainer>
        
        <ButtonsContainer>
          <PrimaryControls>
            <IconButton onClick={prevTrack}>
              <SkipBack size={24} />
            </IconButton>
            <PlayButton 
              onClick={togglePlayPause} 
              $isPlaying={isPlaying}
            >
              {isPlaying ? <Pause size={28} /> : <Play size={28} />}
            </PlayButton>
            <IconButton onClick={nextTrack}>
              <SkipForward size={24} />
            </IconButton>
          </PrimaryControls>
        </ButtonsContainer>
        
        <SecondaryControls>
          <VolumeContainer>
            <IconButton onClick={toggleMute}>
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </IconButton>
            <VolumeSlider 
              $value={isMuted ? 0 : volume} 
              onChange={handleVolumeChange} 
            />
          </VolumeContainer>
          
          <IconButton onClick={toggleShuffle} $active={isShuffled}>
            <Shuffle size={20} />
          </IconButton>
          
          <IconButton onClick={cycleRepeatMode} $active={repeatMode !== 'off'}>
            <Repeat size={20} />
          </IconButton>
          
          <IconButton onClick={() => setShowPlaylist(true)}>
            <ListMusic size={20} />
          </IconButton>
          
          <IconButton onClick={() => setShowSettings(true)}>
            <Settings size={20} />
          </IconButton>
        </SecondaryControls>
        
        <HeartsContainer>
          {Array.from({ length: 5 }).map((_, i) => (
            <HeartIcon
              key={i}
              $filled={i < hearts}
              $clicked={i === lastHeartClicked}
              onClick={() => handleHeartClick(i)}
            >
              <Heart size={20} />
            </HeartIcon>
          ))}
        </HeartsContainer>
      </PlayerControls>
      
      {/* Visualizer */}
      {visualizerType === 'aurora' && (
        <AuroraWavesVisualizer 
          $isPlaying={isPlaying} 
          $accentColor={currentTrack.accentColor as ThemeColor} 
        />
      )}
      
      {/* Settings Panel */}
      <SettingsContainer $visible={showSettings}>
        <CloseSettingsButton onClick={() => setShowSettings(false)}>×</CloseSettingsButton>
        <SettingsTitle>Settings</SettingsTitle>
        
        <SettingsOption>
          <SettingsLabel>Visualizer</SettingsLabel>
          <OptionButtonGroup>
            <OptionButton 
              $active={visualizerType === 'aurora'} 
              onClick={() => setVisualizerType('aurora')}
            >
              Aurora
            </OptionButton>
            <OptionButton 
              $active={visualizerType === 'cosmic'} 
              onClick={() => setVisualizerType('cosmic')}
            >
              Cosmic
            </OptionButton>
            <OptionButton 
              $active={visualizerType === 'none'} 
              onClick={() => setVisualizerType('none')}
            >
              None
            </OptionButton>
          </OptionButtonGroup>
        </SettingsOption>
        
        <SettingsOption>
          <SettingsLabel>Shuffle</SettingsLabel>
          <OptionButtonGroup>
            <OptionButton 
              $active={isShuffled} 
              onClick={() => setIsShuffled(true)}
            >
              On
            </OptionButton>
            <OptionButton 
              $active={!isShuffled} 
              onClick={() => setIsShuffled(false)}
            >
              Off
            </OptionButton>
          </OptionButtonGroup>
        </SettingsOption>
        
        <SettingsOption>
          <SettingsLabel>Repeat</SettingsLabel>
          <OptionButtonGroup>
            <OptionButton 
              $active={repeatMode === 'off'} 
              onClick={() => setRepeatMode('off')}
            >
              Off
            </OptionButton>
            <OptionButton 
              $active={repeatMode === 'all'} 
              onClick={() => setRepeatMode('all')}
            >
              All
            </OptionButton>
            <OptionButton 
              $active={repeatMode === 'one'} 
              onClick={() => setRepeatMode('one')}
            >
              One
            </OptionButton>
          </OptionButtonGroup>
        </SettingsOption>
      </SettingsContainer>
      
      {/* Playlist Panel */}
      <PlaylistContainer $visible={showPlaylist}>
        <ClosePlaylistButton onClick={() => setShowPlaylist(false)}>×</ClosePlaylistButton>
        <PlaylistTitle>Playlist</PlaylistTitle>
        
        {tracks.map((track, index) => (
          <PlaylistItem 
            key={track.id} 
            $active={index === currentTrackIndex}
            onClick={() => {
              setCurrentTrackIndex(index);
              setCurrentTime(0);
              setShowPlaylist(false);
              setIsPlaying(true);
            }}
          >
            <TrackNumber $active={index === currentTrackIndex}>
              {index + 1}
            </TrackNumber>
            <TrackItemInfo>
              <TrackItemTitle>{track.title}</TrackItemTitle>
              <TrackItemArtist>{track.artist}</TrackItemArtist>
            </TrackItemInfo>
            <TrackItemDuration>{formatTime(track.durationSeconds)}</TrackItemDuration>
          </PlaylistItem>
        ))}
      </PlaylistContainer>
    </PlayerContainer>
  );
};

export default Player;

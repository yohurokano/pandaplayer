import type { ThemeColor, GradientName } from '../styles/theme';

export interface Track {
  id: string;
  title: string;
  artist: string;
  albumArtGradient: GradientName;
  durationSeconds: number;
  emoji: string;
  accentColor: ThemeColor;
  genre: string;
  path?: string; // Path to audio file (optional)
  file?: File;  // The actual File object (optional)
}

export type RepeatMode = 'off' | 'all' | 'one';

export interface PlayerState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  currentTrackIndex: number;
  hearts: number;
  volume: number;
  isMuted: boolean;
  isShuffled: boolean;
  repeatMode: RepeatMode;
  visualizerType: 'aurora' | 'cosmic' | 'none';
}

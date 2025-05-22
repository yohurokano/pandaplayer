import styled, { css, keyframes } from 'styled-components';
import type { ThemeColor } from '../../styles/theme';

// Keyframes animations
const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const glow = keyframes`
  0% { box-shadow: 0 0 5px rgba(var(--accent-color-rgb), 0.3); }
  50% { box-shadow: 0 0 20px rgba(var(--accent-color-rgb), 0.6); }
  100% { box-shadow: 0 0 5px rgba(var(--accent-color-rgb), 0.3); }
`;

// Container for the entire player
export const PlayerContainer = styled.div<{ $accentColor: ThemeColor }>`
  --accent-color: ${props => props.theme.colors.palette[props.$accentColor].main};
  --accent-color-rgb: ${props => {
    const hex = props.theme.colors.palette[props.$accentColor].main;
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `${r}, ${g}, ${b}`;
  }};
  
  position: relative;
  width: 100%;
  max-width: 400px;
  height: auto;
  min-height: 600px;
  display: flex;
  flex-direction: column;
  background-color: ${props => props.theme.colors.tertiary};
  color: ${props => props.theme.colors.text};
  border-radius: ${props => props.theme.borderRadius.large};
  overflow: hidden;
  padding: ${props => props.theme.spacing.lg};
  box-shadow: ${props => props.theme.shadows.medium};
  transition: all ${props => props.theme.animation.medium} ease;
  margin: 0 auto;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(
      circle at center,
      rgba(var(--accent-color-rgb), 0.1) 0%,
      rgba(0, 0, 0, 0) 70%
    );
    z-index: 0;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: -20px;
    right: -20px;
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background-color: rgba(255, 192, 203, 0.2);
    z-index: -1;
  }
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    padding: ${props => props.theme.spacing.md};
    max-width: 100%;
  }
`;

// Album art container with 3D effect
export const AlbumArtContainer = styled.div<{ $isPlaying: boolean }>`
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  border-radius: ${props => props.theme.borderRadius.large};
  overflow: hidden;
  margin-bottom: ${props => props.theme.spacing.lg};
  perspective: 1000px;
  transform-style: preserve-3d;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  
  ${props => props.$isPlaying && css`
    animation: ${float} 6s ease-in-out infinite;
  `}
  
  &::before {
    content: '';
    position: absolute;
    top: -5px;
    left: -5px;
    right: -5px;
    bottom: -5px;
    background: linear-gradient(135deg, rgba(255, 192, 203, 0.7), rgba(255, 255, 255, 0.3));
    border-radius: ${props => props.theme.borderRadius.large};
    z-index: -1;
    filter: blur(10px);
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.05);
    pointer-events: none;
  }
`;

export const AlbumArt = styled.div<{ 
  $gradient: string; 
  $tiltX: number; 
  $tiltY: number;
  $isPlaying: boolean;
}>`
  width: 100%;
  height: 100%;
  border-radius: ${props => props.theme.borderRadius.round};
  background: ${props => props.$gradient ? props.theme.gradients[props.$gradient as keyof typeof props.theme.gradients] : 'none'};
  display: flex;
  align-items: center;
  justify-content: center;
  transform: perspective(1000px) rotateX(${props => props.$tiltY}deg) rotateY(${props => props.$tiltX}deg);
  transform-style: preserve-3d;
  transition: transform 0.1s ease, box-shadow 0.3s ease;
  box-shadow: ${props => 
    props.$isPlaying
      ? `0 10px 30px rgba(var(--accent-color-rgb), 0.3),
        inset 0 0 20px rgba(255, 255, 255, 0.5)`
      : `0 5px 15px rgba(0, 0, 0, 0.1),
        inset 0 0 10px rgba(255, 255, 255, 0.2)`
  };
  position: relative;
  overflow: hidden;
  z-index: 1;
`;

export const VisualizerCanvas = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: inherit;
  z-index: 2;
  opacity: 0.6;
  pointer-events: none;
`;

export const TrackEmoji = styled.div<{ $isPlaying: boolean }>`
  font-size: min(15vw, 6rem);
  filter: drop-shadow(0 0 10px rgba(0, 0, 0, 0.3));
  position: relative;
  z-index: 2;
  
  ${props => props.$isPlaying && css`
    animation: ${pulse} 2s ease-in-out infinite;
  `}
  
  &::after {
    content: '';
    position: absolute;
    width: 40px;
    height: 40px;
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    z-index: -1;
    top: 0;
    right: -10px;
  }
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    font-size: 4rem;
  }
`;

export const PlayerControls = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.lg};
  z-index: 1;
`;

export const TrackInfo = styled.div`
  text-align: center;
  margin-bottom: ${props => props.theme.spacing.md};
`;

export const TrackTitle = styled.h2`
  font-size: ${props => props.theme.fontSize.xl};
  font-weight: 700;
  margin: 0;
  margin-bottom: ${props => props.theme.spacing.xs};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const TrackArtist = styled.p`
  font-size: ${props => props.theme.fontSize.md};
  color: ${props => props.theme.colors.secondaryText};
  margin: 0;
  margin-bottom: ${props => props.theme.spacing.xs};
`;

export const TrackGenre = styled.span`
  display: inline-block;
  font-size: ${props => props.theme.fontSize.xs};
  background-color: rgba(var(--accent-color-rgb), 0.2);
  color: var(--accent-color);
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borderRadius.small};
`;

export const ProgressBarContainer = styled.div`
  width: 100%;
  margin-bottom: ${props => props.theme.spacing.md};
`;

export const ProgressBar = styled.div`
  width: 100%;
  height: 4px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: ${props => props.theme.spacing.xs};
  cursor: pointer;
`;

export const Progress = styled.div<{ $width: number }>`
  height: 100%;
  width: ${props => props.$width}%;
  background-color: var(--accent-color);
  border-radius: 2px;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 8px;
    height: 8px;
    background-color: #fff;
    border-radius: 50%;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
  }
`;

export const TimeDisplay = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: ${props => props.theme.fontSize.sm};
  color: ${props => props.theme.colors.secondaryText};
`;

export const ButtonsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.lg};
`;

export const PrimaryControls = styled.div`
  display: flex;
  justify-content: center;
  gap: ${props => props.theme.spacing.md};
  align-items: center;
  width: 100%;
`;

export const SecondaryControls = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

export const IconButton = styled.button<{ $active?: boolean }>`
  background: none;
  border: none;
  color: ${props => props.$active ? 'var(--accent-color)' : props.theme.colors.text};
  cursor: pointer;
  padding: ${props => props.theme.spacing.xs};
  border-radius: ${props => props.theme.borderRadius.round};
  transition: all ${props => props.theme.animation.fast} ease;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    color: var(--accent-color);
    transform: scale(1.1);
  }
  
  &:active {
    transform: scale(0.95);
  }
  
  ${props => props.$active && css`
    animation: ${pulse} 2s ease-in-out infinite;
  `}
`;

export const PlayButton = styled(IconButton)<{ $isPlaying: boolean }>`
  width: 70px;
  height: 70px;
  background-color: rgba(var(--accent-color-rgb), 0.1);
  border-radius: ${props => props.theme.borderRadius.round};
  position: relative;
  z-index: 1;
  color: ${props => props.$isPlaying ? 'var(--accent-color)' : props.theme.colors.secondary};
  
  ${props => props.$isPlaying && css`
    animation: ${glow} 2s ease-in-out infinite;
  `}
  
  &::before {
    content: '';
    position: absolute;
    top: -5px;
    left: -5px;
    right: -5px;
    bottom: -5px;
    background: linear-gradient(135deg, rgba(255, 192, 203, 0.4), rgba(255, 255, 255, 0.1));
    border-radius: 50%;
    z-index: -1;
    opacity: ${props => props.$isPlaying ? 1 : 0};
    transition: opacity 0.3s ease;
  }
  
  &:hover {
    background-color: rgba(var(--accent-color-rgb), 0.2);
    transform: scale(1.05);
    
    &::before {
      opacity: 1;
    }
  }
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    width: 60px;
    height: 60px;
  }
`;

export const VolumeContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
`;

export const VolumeSlider = styled.input.attrs({
  type: 'range',
  min: 0,
  max: 1,
  step: 0.01
})<{ $value?: number }>`
  width: 80px;
  height: 4px;
  -webkit-appearance: none;
  background: ${props => {
    const valuePercent = props.$value !== undefined ? Math.floor(props.$value * 100) : 0;
    return `linear-gradient(
      to right, 
      var(--accent-color) 0%, 
      var(--accent-color) ${valuePercent}%, 
      rgba(255, 255, 255, 0.1) ${valuePercent}%, 
      rgba(255, 255, 255, 0.1) 100%
    )`;
  }};
  border-radius: 2px;
  outline: none;
  
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #fff;
    cursor: pointer;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
  }
  
  &::-moz-range-thumb {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #fff;
    cursor: pointer;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
    border: none;
  }
`;

export const HeartsContainer = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.xs};
  margin-bottom: ${props => props.theme.spacing.md};
`;

export const Heart = styled.div<{ $filled: boolean, $clicked: boolean }>`
  color: ${props => props.$filled ? 'var(--accent-color)' : 'rgba(255, 255, 255, 0.2)'};
  transition: color ${props => props.theme.animation.fast} ease, 
              transform ${props => props.theme.animation.fast} ease;
  cursor: pointer;
  
  ${props => props.$clicked && css`
    animation: ${pulse} 0.5s ease;
  `}
  
  &:hover {
    transform: scale(1.2);
  }
`;

// Using the VisualizerCanvas styled component defined above

export const SettingsContainer = styled.div<{ $visible: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(5px);
  z-index: 10;
  display: flex;
  flex-direction: column;
  padding: ${props => props.theme.spacing.lg};
  transform: translateY(${props => props.$visible ? '0' : '100%'});
  opacity: ${props => props.$visible ? 1 : 0};
  transition: transform ${props => props.theme.animation.medium} ease,
              opacity ${props => props.theme.animation.medium} ease;
`;

export const SettingsTitle = styled.h2`
  font-size: ${props => props.theme.fontSize.lg};
  margin-bottom: ${props => props.theme.spacing.lg};
  text-align: center;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
`;

export const SettingsOption = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${props => props.theme.spacing.md} 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

export const SettingsLabel = styled.span`
  font-size: ${props => props.theme.fontSize.md};
  color: white;
  font-weight: 500;
`;

export const OptionButton = styled.button<{ $active: boolean }>`
  background-color: ${props => props.$active ? 'var(--accent-color)' : 'rgba(255, 255, 255, 0.1)'};
  color: ${props => props.$active ? props.theme.colors.primary : props.theme.colors.text};
  border: none;
  border-radius: ${props => props.theme.borderRadius.small};
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  cursor: pointer;
  transition: all ${props => props.theme.animation.fast} ease;
  
  &:hover {
    background-color: ${props => props.$active ? 'var(--accent-color)' : 'rgba(255, 255, 255, 0.2)'};
  }
`;

export const OptionButtonGroup = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.xs};
`;

export const CloseSettingsButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.text};
  position: absolute;
  top: ${props => props.theme.spacing.md};
  right: ${props => props.theme.spacing.md};
  cursor: pointer;
  font-size: ${props => props.theme.fontSize.lg};
  
  &:hover {
    color: var(--accent-color);
  }
`;

export const PlaylistContainer = styled.div<{ $visible: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(5px);
  z-index: 10;
  display: flex;
  flex-direction: column;
  padding: ${props => props.theme.spacing.lg};
  transform: translateY(${props => props.$visible ? '0' : '100%'});
  opacity: ${props => props.$visible ? 1 : 0};
  transition: transform ${props => props.theme.animation.medium} ease,
              opacity ${props => props.theme.animation.medium} ease;
  overflow-y: auto;
`;

export const PlaylistTitle = styled.h2`
  font-size: ${props => props.theme.fontSize.lg};
  margin-bottom: ${props => props.theme.spacing.lg};
  text-align: center;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
`;

export const PlaylistItem = styled.div<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
  padding: ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.small};
  background-color: ${props => props.$active ? 'rgba(var(--accent-color-rgb), 0.3)' : 'rgba(255, 255, 255, 0.05)'};
  cursor: pointer;
  transition: all ${props => props.theme.animation.fast} ease;
  color: white;
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
  
  &:hover {
    background-color: rgba(var(--accent-color-rgb), 0.2);
    transform: translateY(-2px);
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
  }
`;

export const TrackNumber = styled.span<{ $active: boolean }>`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${props => props.theme.borderRadius.round};
  background-color: ${props => props.$active ? 'var(--accent-color)' : 'rgba(255, 255, 255, 0.15)'};
  color: ${props => props.$active ? 'white' : 'white'};
  font-size: ${props => props.theme.fontSize.sm};
  font-weight: bold;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export const TrackItemInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  line-height: 1.3;
`;

export const TrackItemTitle = styled.h3`
  font-size: ${props => props.theme.fontSize.md};
  margin: 0;
  margin-bottom: ${props => props.theme.spacing.xs};
  color: white;
  font-weight: 600;
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.15);
`;

export const TrackItemArtist = styled.p`
  font-size: ${props => props.theme.fontSize.sm};
  color: rgba(255, 255, 255, 0.85);
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
  margin: 0;
`;

export const TrackItemDuration = styled.span`
  font-size: ${props => props.theme.fontSize.sm};
  color: rgba(255, 255, 255, 0.9);
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
  font-weight: 500;
`;

export const ClosePlaylistButton = styled.button`
  background: rgba(0, 0, 0, 0.2);
  border: none;
  color: white;
  position: absolute;
  top: ${props => props.theme.spacing.md};
  right: ${props => props.theme.spacing.md};
  cursor: pointer;
  font-size: ${props => props.theme.fontSize.lg};
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 0.8;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
  
  &:hover {
    background: var(--accent-color);
    transform: scale(1.1);
  }
`;

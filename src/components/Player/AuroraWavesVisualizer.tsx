import React, { useRef, useEffect } from 'react';
import type { ThemeColor } from '../../styles/theme';
import { VisualizerCanvas } from './PlayerStyles';
import { theme, hexToRgba } from '../../styles/theme';

interface AuroraWavesVisualizerProps {
  $isPlaying: boolean;
  $accentColor: ThemeColor;
  analyzerNode?: AnalyserNode | null;
}

const AuroraWavesVisualizer: React.FC<AuroraWavesVisualizerProps> = ({ $isPlaying, $accentColor, analyzerNode }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameIdRef = useRef<number | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Initialize frequency data array if analyzer is available
    if (analyzerNode && !dataArrayRef.current) {
      const bufferLength = analyzerNode.frequencyBinCount;
      dataArrayRef.current = new Uint8Array(bufferLength);
      console.log('Created frequency data array with length:', bufferLength);
    }

    const setupCanvas = () => {
      const scale = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        canvas.width = Math.floor(rect.width * scale);
        canvas.height = Math.floor(rect.height * scale);
        ctx.setTransform(scale, 0, 0, scale, 0, 0);
      }
    };
    
    setupCanvas();
    window.addEventListener('resize', setupCanvas);

    let t = 0;
    const draw = () => {
      const logicalWidth = canvas.offsetWidth;
      const logicalHeight = canvas.offsetHeight;

      if (logicalWidth <= 0 || logicalHeight <= 0) {
        animationFrameIdRef.current = requestAnimationFrame(draw);
        return;
      }

      ctx.clearRect(0, 0, logicalWidth, logicalHeight); 
      const baseAccentHex = theme.colors.palette[$accentColor as keyof typeof theme.colors.palette].main;
      
      // Get frequency data if available
      let frequencyData: Uint8Array | null = null;
      if (analyzerNode && dataArrayRef.current && $isPlaying) {
        analyzerNode.getByteFrequencyData(dataArrayRef.current);
        frequencyData = dataArrayRef.current;
      }

      if (!$isPlaying) { // Static, gentle waves when paused
        for (let i = 0; i < 2; i++) { 
          ctx.beginPath();
          for (let x = 0; x < logicalWidth; x++) {
            const y = logicalHeight / 2 + Math.sin(x * 0.015 + i * Math.PI) * (logicalHeight * 0.1); 
            if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
          }
          ctx.strokeStyle = hexToRgba(baseAccentHex, 0.05 + i * 0.03); 
          ctx.lineWidth = 1 + i * 0.5;
          ctx.stroke();
        }
        animationFrameIdRef.current = requestAnimationFrame(draw);
        return; 
      }

      t += 0.008; // Slower animation speed

      for (let i = 0; i < 3; i++) { // Three wave layers
        ctx.beginPath();
        for (let x = 0; x < logicalWidth; x++) {
          const waveOffset = t + i * Math.PI * 0.8;
          
          // Calculate amplitude based on frequency data if available
          let amplitude;
          if (frequencyData) {
            // Map x position to frequency bin index
            const binIndex = Math.floor((x / logicalWidth) * (frequencyData.length / 2));
            // Use frequency data to influence amplitude
            const frequencyValue = frequencyData[binIndex] || 0;
            const normalizedValue = frequencyValue / 255; // Normalize to 0-1 range
            amplitude = logicalHeight * 0.05 * (1 + normalizedValue * 2.5);
          } else {
            // Fallback to sine wave if no frequency data
            amplitude = logicalHeight * 0.12 * (Math.sin(waveOffset * 0.3 + i) * 0.3 + 0.7);
          }
          
          const frequency = 0.015 + Math.sin(waveOffset * 0.1 + i) * 0.003;
          const y = logicalHeight / 2 + Math.sin(x * frequency + waveOffset) * amplitude * (0.7 + Math.random() * 0.1);
          if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        
        // Adjust colors based on wave layer
        const opacity = frequencyData ? [0.15, 0.25, 0.35][i] : [0.1, 0.15, 0.2][i];
        ctx.strokeStyle = hexToRgba(baseAccentHex, opacity); 
        ctx.lineWidth = 1 + i * 0.7;
        ctx.stroke();
      }
      
      animationFrameIdRef.current = requestAnimationFrame(draw);
    };

    draw(); 
    
    return () => {
      if (animationFrameIdRef.current) cancelAnimationFrame(animationFrameIdRef.current);
      window.removeEventListener('resize', setupCanvas);
    };
  }, [$isPlaying, $accentColor, analyzerNode]); 

  return <VisualizerCanvas ref={canvasRef} />;
};

export default AuroraWavesVisualizer;

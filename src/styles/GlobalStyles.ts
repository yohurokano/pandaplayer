import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  :root {
    font-family: 'Inter', 'Helvetica Neue', Arial, sans-serif;
    font-synthesis: none;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    -webkit-text-size-adjust: 100%;
  }

  html, body {
    height: 100%;
    width: 100%;
    overflow: hidden;
  }

  html, body {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    overflow: hidden;
    font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 16px;
    line-height: 1.5;
    color: #1a202c;
  }

  body {
    background: #fff5f7; /* Light pink background */
    color: #1a202c;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    background-attachment: fixed;
    background-image: linear-gradient(135deg, #fff5f7 0%, #ffecef 100%);
  }
  
  body::after {
    content: '';
    position: fixed;
    bottom: 0;
    right: 0;
    width: min(40vw, 300px);
    height: min(40vw, 300px);
    background-image: url('/panda.svg');
    background-repeat: no-repeat;
    background-position: bottom right;
    background-size: contain;
    z-index: 0;
    pointer-events: none;
    transition: all 0.5s ease;
    animation: float-panda 8s ease-in-out infinite;
  }

  @keyframes float-panda {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }

  #root {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding: 0;
    overflow-y: auto;
  }

  @keyframes floatingHearts {
    0% { transform: translateY(0) rotate(0deg); }
    100% { transform: translateY(-2000px) rotate(360deg); }
  }

  body::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    background-image: radial-gradient(circle at center, rgba(255, 192, 203, 0.2) 1px, transparent 1px);
    background-size: 50px 50px;
    z-index: -1;
    animation: floatingHearts 100s linear infinite;
  }

  /* Add a subtle pink glow */
  body::after {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at 80% 20%, rgba(255, 192, 203, 0.2) 0%, transparent 50%),
                radial-gradient(circle at 20% 80%, rgba(255, 192, 203, 0.15) 0%, transparent 50%);
    pointer-events: none;
    z-index: -1;
  }

  button {
    font-family: inherit;
  }
`;

export default GlobalStyles;

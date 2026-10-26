import { StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';
import '@fontsource-variable/fraunces/wght.css';
import '@fontsource-variable/dm-sans/wght.css';
import './lb.css';
import './index.css';
import App from './App';

hydrateRoot(document.getElementById('root')!, <StrictMode><App /></StrictMode>);

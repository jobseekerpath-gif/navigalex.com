import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import ModalCloseGuard from './components/ModalCloseGuard';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
    <ModalCloseGuard />
  </React.StrictMode>
);

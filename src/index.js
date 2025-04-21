import React from 'react';
import ReactDOM from 'react-dom/client';
import './normalize.css';
import App from './App';
import { Online, Offline } from 'react-detect-offline';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <>
    <Online>
        <App />
    </Online>
    <Offline>
      <div className='offline-mode'>
        You're offline right now. Check your connection.
      </div>
    </Offline>
  </>
);

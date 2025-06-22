import React from 'react'; 
import ReactDOM from 'react-dom/client';
import App from './App';
import 'core-js';
import 'core-js/stable';
import 'regenerator-runtime/runtime'; // Necesar pentru async/await

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

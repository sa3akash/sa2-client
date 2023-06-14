import { BrowserRouter } from 'react-router-dom';
import { AppRouter } from './router';
import React from 'react';

function App() {
  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  );
}

export default App;

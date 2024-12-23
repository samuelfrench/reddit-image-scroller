import React from 'react';
import ImageList from './components/ImageList';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Reddit Image Scraper</h1>
      </header>
      <ImageList />
    </div>
  );
}

export default App;
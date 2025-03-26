import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RaceList from './components/RaceList';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Race Tournament Manager</h1>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<RaceList />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App; 
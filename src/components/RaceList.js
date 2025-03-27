import React, { useState, useEffect } from 'react';
import RaceCard from './RaceCard';
import NewRaceForm from './NewRaceForm';
import './RaceList.css';


function RaceList() {
  const [races, setRaces] = useState([]);
  const [showNewRaceForm, setShowNewRaceForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch races on component mount
  useEffect(() => {
    fetchRaces();
  }, []);

  const fetchRaces = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/v1/races');
      if (!response.ok) {
        throw new Error('Failed to fetch races');
      }
      const data = await response.json();
      setRaces(data);
      setError(null);
    } catch (err) {
      setError('Failed to load races. Please try again later.');
      console.error('Error fetching races:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateRace = async (newRace) => {
    try {
      const response = await fetch('/api/v1/races', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newRace),
      });

      if (!response.ok) {
        throw new Error('Failed to create race');
      }

      const createdRace = await response.json();
      setRaces([...races, createdRace]);
      setShowNewRaceForm(false);
      setError(null);
    } catch (err) {
      setError('Failed to create race. Please try again.');
      console.error('Error creating race:', err);
    }
  };

  const handleUpdateRace = async (updatedRace) => {
    try {
      const response = await fetch(`/api/v1/races/${updatedRace.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedRace),
      });

      if (!response.ok) {
        throw new Error('Failed to update race');
      }

      const updatedRaceData = await response.json();
      setRaces(races.map(race => 
        race.id === updatedRaceData.id ? updatedRaceData : race
      ));
      setError(null);
    } catch (err) {
      setError('Failed to update race. Please try again.');
      console.error('Error updating race:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="race-list">
        <div className="loading">Loading races...</div>
      </div>
    );
  }

  return (
    <div className="race-list">
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      <div className="race-list-header">
        <h2>Current Races</h2>
        <button 
          className="create-race-btn"
          onClick={() => setShowNewRaceForm(true)}
        >
          Create New Race
        </button>
      </div>

      {showNewRaceForm && (
        <NewRaceForm 
          onSubmit={handleCreateRace}
          onCancel={() => setShowNewRaceForm(false)}
        />
      )}

      {races.length === 0 && !isLoading ? (
        <div className="no-races">No races found</div>
      ) : (
        races.map(race => (
          <RaceCard 
            key={race.id} 
            race={race} 
            onUpdateRace={handleUpdateRace}
          />
        ))
      )}
    </div>
  );
}

export default RaceList; 
import React, { useState } from 'react';
import RaceCard from './RaceCard';
import NewRaceForm from './NewRaceForm';
import './RaceList.css';

// Sample data structure
const sampleRaces = [
  {
    id: 1,
    name: "100m Sprint - Heat 1",
    status: "completed", // possible values: "scheduled", "in_progress", "completed"
    participants: [
      { id: 1, name: "John Doe", lane: 1, place: 1 },
      { id: 2, name: "Jane Smith", lane: 2, place: 2 },
      { id: 3, name: "Mike Johnson", lane: 3, place: 3 },
    ]
  },
  {
    id: 2,
    name: "100m Sprint - Heat 2",
    status: "scheduled",
    participants: [
      { id: 4, name: "Sarah Wilson", lane: 1, place: null },
      { id: 5, name: "Tom Brown", lane: 2, place: null },
      { id: 6, name: "Lisa Davis", lane: 3, place: null },
    ]
  }
];

function RaceList() {
  const [races, setRaces] = useState(sampleRaces);
  const [showNewRaceForm, setShowNewRaceForm] = useState(false);

  const handleCreateRace = (newRace) => {
    setRaces([...races, { ...newRace, id: races.length + 1 }]);
    setShowNewRaceForm(false);
  };

  const handleUpdateRace = (updatedRace) => {
    setRaces(races.map(race => 
      race.id === updatedRace.id ? updatedRace : race
    ));
  };

  return (
    <div className="race-list">
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

      {races.map(race => (
        <RaceCard 
          key={race.id} 
          race={race} 
          onUpdateRace={handleUpdateRace}
        />
      ))}
    </div>
  );
}

export default RaceList; 
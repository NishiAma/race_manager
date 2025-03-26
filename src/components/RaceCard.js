import React, { useState } from 'react';
import EditRaceForm from './EditRaceForm';
import './RaceCard.css';

function RaceCard({ race, onUpdateRace }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'completed':
        return 'status-badge completed';
      case 'in_progress':
        return 'status-badge in-progress';
      default:
        return 'status-badge scheduled';
    }
  };

  const handleEditSubmit = (updatedRace) => {
    onUpdateRace(updatedRace);
    setIsEditing(false);
  };

  return (
    <div className="race-card">
      <div className="race-header" onClick={() => setIsExpanded(!isExpanded)}>
        <h3>{race.name}</h3>
        <div className={getStatusBadgeClass(race.status)}>
          {race.status.replace('_', ' ')}
        </div>
      </div>
      
      {isExpanded && !isEditing && (
        <div className="race-details">
          {race.status === 'scheduled' && (
            <button 
              className="edit-race-btn"
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(true);
              }}
            >
              Update Results
            </button>
          )}
          <table>
            <thead>
              <tr>
                <th>Lane</th>
                <th>Name</th>
                <th>Place</th>
              </tr>
            </thead>
            <tbody>
              {race.participants.map(participant => (
                <tr key={participant.id}>
                  <td>{participant.lane}</td>
                  <td>{participant.name}</td>
                  <td>{participant.place || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isEditing && (
        <EditRaceForm 
          race={race}
          onSubmit={handleEditSubmit}
          onCancel={() => setIsEditing(false)}
        />
      )}
    </div>
  );
}

export default RaceCard; 
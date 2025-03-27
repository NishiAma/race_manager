import React, { useState, useEffect } from 'react';
import EditRaceForm from './EditRaceForm';
import './RaceCard.css';

function RaceCard({ race, onUpdateRace }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [raceData, setRaceData] = useState(race);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRaceData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/v1/races/${race.id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch race details');
      }

      const data = await response.json();
      setRaceData(data);
      setError(null);
    } catch (err) {
      setError('Failed to load race details');
      console.error('Error fetching race:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch race data when expanded
  useEffect(() => {
    if (isExpanded) {
      fetchRaceData();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isExpanded, race.id]);

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'completed':
        return 'status-badge completed';
      case 'ready':
        return 'status-badge ready';
      default:
        return 'status-badge scheduled';
    }
  };

  const handleEditSubmit = async (updatedRace) => {
    await onUpdateRace(updatedRace);
    setIsEditing(false);
    // Refresh race data after update
    fetchRaceData();
  };

  // Ensure we have race_students array, or use empty array as fallback
  const participants = raceData.race_students || [];

  return (
    <div className="race-card">
      <div className="race-header" onClick={() => setIsExpanded(!isExpanded)}>
        <h3>{raceData.name}</h3>
        <div className={getStatusBadgeClass(raceData.status)}>
          {raceData.status.replace('_', ' ')}
        </div>
      </div>
      
      {isExpanded && !isEditing && (
        <div className="race-details">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          
          {isLoading ? (
            <div className="loading">Loading race details...</div>
          ) : (
            <>
              {raceData.status === 'ready' && (
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
                  {participants.map(participant => (
                    <tr key={participant.id}>
                      <td>{participant.lane}</td>
                      <td>{participant.student?.name}</td>
                      <td>{participant.place || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      )}

      {isEditing && (
        <EditRaceForm 
          race={raceData}
          onSubmit={handleEditSubmit}
          onCancel={() => setIsEditing(false)}
        />
      )}
    </div>
  );
}

export default RaceCard; 
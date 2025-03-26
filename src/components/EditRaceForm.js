import React, { useState } from 'react';
import './EditRaceForm.css';

function EditRaceForm({ race, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    ...race,
    participants: race.participants.map(p => ({
      ...p,
      place: p.place || '',
    }))
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      status: 'completed',
      participants: formData.participants.map(p => ({
        ...p,
        place: p.place || null,
      }))
    });
  };

  const handleParticipantChange = (id, field, value) => {
    setFormData({
      ...formData,
      participants: formData.participants.map(p => 
        p.id === id ? { ...p, [field]: value } : p
      )
    });
  };

  const isFormValid = () => {
    // Check if all participants have places assigned
    return formData.participants.every(p => 
      p.place !== '' && 
      p.place !== null && 
      !isNaN(p.place) && 
      parseInt(p.place) > 0 && 
      parseInt(p.place) <= formData.participants.length
    );
  };

  return (
    <div className="edit-race-form">
      <h4>Update Race Results</h4>
      <form onSubmit={handleSubmit}>
        <table>
          <thead>
            <tr>
              <th>Lane</th>
              <th>Name</th>
              <th>Place</th>
            </tr>
          </thead>
          <tbody>
            {formData.participants.map(participant => (
              <tr key={participant.id}>
                <td>{participant.lane}</td>
                <td>{participant.name}</td>
                <td>
                  <input
                    type="number"
                    min="1"
                    max={formData.participants.length}
                    value={participant.place}
                    onChange={(e) => handleParticipantChange(
                      participant.id, 
                      'place', 
                      e.target.value
                    )}
                    required
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="form-actions">
          <button 
            type="submit" 
            disabled={!isFormValid()}
            className={!isFormValid() ? 'disabled' : ''}
          >
            Complete Race
          </button>
          <button type="button" onClick={onCancel} className="cancel-btn">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditRaceForm; 
import React, { useState } from 'react';
import './NewRaceForm.css';

function NewRaceForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    participants: [
      { id: 1, name: '', lane: 1 },
      { id: 2, name: '', lane: 2 },
    ]
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      status: 'scheduled',
      participants: formData.participants.filter(p => p.name.trim() !== '')
    });
  };

  const handleParticipantChange = (id, value) => {
    setFormData({
      ...formData,
      participants: formData.participants.map(p => 
        p.id === id ? { ...p, name: value } : p
      )
    });
  };

  const addLane = () => {
    const newLaneNumber = formData.participants.length + 1;
    const newParticipant = {
      id: Date.now(), // Using timestamp as a unique id
      name: '',
      lane: newLaneNumber
    };
    setFormData({
      ...formData,
      participants: [...formData.participants, newParticipant]
    });
  };

  const removeLane = (laneId) => {
    // Don't allow removing if only 2 lanes remain
    if (formData.participants.length <= 2) return;

    const updatedParticipants = formData.participants
      .filter(p => p.id !== laneId)
      // Reassign lane numbers sequentially
      .map((p, index) => ({
        ...p,
        lane: index + 1
      }));

    setFormData({
      ...formData,
      participants: updatedParticipants
    });
  };

  const isFormValid = () => {
    const lane1Participant = formData.participants.find(p => p.lane === 1);
    const lane2Participant = formData.participants.find(p => p.lane === 2);
    return (
      formData.name.trim() !== '' &&
      lane1Participant?.name.trim() !== '' &&
      lane2Participant?.name.trim() !== ''
    );
  };

  return (
    <div className="new-race-form">
      <h3>Create New Race</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Race Name:</label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>Participants:</label>
          <div className="participants-container">
            {formData.participants.map(participant => (
              <div key={participant.id} className="participant-input">
                <label>Lane {participant.lane}:</label>
                <input
                  type="text"
                  value={participant.name}
                  onChange={(e) => handleParticipantChange(participant.id, e.target.value)}
                  placeholder={`Participant in lane ${participant.lane}`}
                />
                {formData.participants.length > 2 && (
                  <button 
                    type="button" 
                    className="remove-lane-btn"
                    onClick={() => removeLane(participant.id)}
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
          <button 
            type="button" 
            className="add-lane-btn"
            onClick={addLane}
          >
            + Add Lane
          </button>
        </div>

        <div className="form-actions">
          <button 
            type="submit" 
            disabled={!isFormValid()}
            className={!isFormValid() ? 'disabled' : ''}
          >
            Create Race
          </button>
          <button type="button" onClick={onCancel} className="cancel-btn">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default NewRaceForm; 
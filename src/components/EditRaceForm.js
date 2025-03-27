import React, { useState } from 'react';
import './EditRaceForm.css';

function EditRaceForm({ race, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    race_students: race.race_students.map(student => ({
      ...student,
      place: student.place || ''
    }))
  });
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      // First update the race results
      const updateResponse = await fetch(`/api/v1/races/${race.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          race: {
            race_students: formData.race_students.map(student => ({
              id: student.id,
              place: parseInt(student.place)
            }))
          }
        }),
      });

      if (!updateResponse.ok) {
        throw new Error('Failed to update race results');
      }

      // Then complete the race with empty body
      const completeResponse = await fetch(`/api/v1/races/${race.id}/complete`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}) // Send empty object as body
      });

      if (!completeResponse.ok) {
        const errorData = await completeResponse.text();
        console.error('Complete race response:', errorData);
        throw new Error('Failed to complete race');
      }

      const completedRace = await completeResponse.json();
      onSubmit(completedRace);
    } catch (err) {
      setError('Failed to update race results. Please try again.');
      console.error('Error updating race:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStudentChange = (id, field, value) => {
    setFormData({
      ...formData,
      race_students: formData.race_students.map(student =>
        student.id === id ? { ...student, [field]: value } : student
      )
    });
  };

  const isFormValid = () => {
    // Check if all students have places assigned
    return formData.race_students.every(student => 
      student.place && 
      student.place.toString().trim() !== '' && 
      parseInt(student.place) > 0 && 
      parseInt(student.place) <= formData.race_students.length
    );
  };

  return (
    <div className="edit-race-form">
      <h4>Update Race Results</h4>
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
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
            {formData.race_students.map(student => (
              <tr key={student.id}>
                <td>{student.lane}</td>
                <td>{student.student.name}</td>
                <td>
                  <input
                    type="number"
                    min="1"
                    max={formData.race_students.length}
                    value={student.place}
                    onChange={(e) => handleStudentChange(
                      student.id,
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
            disabled={!isFormValid() || isSubmitting}
            className={!isFormValid() || isSubmitting ? 'disabled' : ''}
          >
            {isSubmitting ? 'Updating...' : 'Save Results'}
          </button>
          <button 
            type="button" 
            onClick={onCancel} 
            className="cancel-btn"
            disabled={isSubmitting}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditRaceForm; 
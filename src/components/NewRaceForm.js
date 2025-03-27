import React, { useState, useEffect } from 'react';
import NewStudentForm from './NewStudentForm';
import './NewRaceForm.css';

function NewRaceForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    participants: [
      { id: 1, name: '', lane: 1, studentId: '' },
      { id: 2, name: '', lane: 2, studentId: '' },
    ]
  });
  const [students, setStudents] = useState([]);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingStudents, setIsLoadingStudents] = useState(true);
  const [showNewStudentForm, setShowNewStudentForm] = useState(false);

  // Fetch students when component mounts
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setIsLoadingStudents(true);
      const response = await fetch('/api/v1/students');
      
      if (!response.ok) {
        throw new Error('Failed to fetch students');
      }

      const data = await response.json();
      setStudents(data);
      setError(null);
    } catch (err) {
      setError('Failed to load students. Please try again later.');
      console.error('Error fetching students:', err);
    } finally {
      setIsLoadingStudents(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    // Check for at least two selected students
    const selectedStudents = formData.participants.filter(p => p.studentId);
    if (selectedStudents.length < 2) {
      setError('Please select at least two students for the race');
      setIsSubmitting(false);
      return;
    }

    try {
      const raceData = {
        race: {
          name: formData.name,
          status: 'ready',
          race_students_attributes: formData.participants
            .filter(p => p.studentId)
            .map(p => ({
              student_id: parseInt(p.studentId),
              lane: p.lane
            }))
        }
      };

      console.log('Sending race data:', JSON.stringify(raceData));

      const response = await fetch('/api/v1/races', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(raceData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server response:', errorData);
        
        const errorMessage = errorData.errors 
          ? Object.entries(errorData.errors)
              .map(([key, messages]) => 
                key === 'base' 
                  ? messages.join(', ')
                  : `${key}: ${messages.join(', ')}`)
              .join('; ')
          : 'Failed to create race';
          
        throw new Error(errorMessage);
      }

      const createdRace = await response.json();
      console.log('Created race:', createdRace);
      onSubmit(createdRace);
    } catch (err) {
      setError(err.message);
      console.error('Error creating race:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleParticipantChange = (laneId, studentId) => {
    const selectedStudent = students.find(s => s.id === studentId);
    setFormData({
      ...formData,
      participants: formData.participants.map(p => 
        p.id === laneId ? {
          ...p,
          studentId: studentId,
          name: selectedStudent ? selectedStudent.name : ''
        } : p
      )
    });
  };

  const addLane = () => {
    const newLaneNumber = formData.participants.length + 1;
    const newParticipant = {
      id: Date.now(),
      name: '',
      lane: newLaneNumber,
      studentId: ''
    };
    setFormData({
      ...formData,
      participants: [...formData.participants, newParticipant]
    });
  };

  const removeLane = (laneId) => {
    if (formData.participants.length <= 2) return;

    const updatedParticipants = formData.participants
      .filter(p => p.id !== laneId)
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
    const selectedStudents = formData.participants.filter(p => p.studentId);
    return (
      formData.name.trim() !== '' &&
      selectedStudents.length >= 2
    );
  };

  const handleAddStudent = (newStudent) => {
    setStudents([...students, newStudent]);
    setShowNewStudentForm(false);
  };

  if (isLoadingStudents) {
    return (
      <div className="new-race-form">
        <div className="loading">Loading students...</div>
      </div>
    );
  }

  return (
    <div className="new-race-form">
      <h3>Create New Race</h3>
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {showNewStudentForm ? (
        <NewStudentForm 
          onSubmit={handleAddStudent}
          onCancel={() => setShowNewStudentForm(false)}
        />
      ) : (
        <button 
          type="button" 
          className="add-student-btn"
          onClick={() => setShowNewStudentForm(true)}
        >
          + Add New Student
        </button>
      )}

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
                <select
                  value={participant.studentId}
                  onChange={(e) => handleParticipantChange(participant.id, e.target.value)}
                  required={participant.lane <= 2}
                >
                  <option value="">Select a student</option>
                  {students.map(student => (
                    <option 
                      key={student.id} 
                      value={student.id}
                      disabled={formData.participants.some(
                        p => p.studentId === student.id.toString() && p.id !== participant.id
                      )}
                    >
                      {student.name}
                    </option>
                  ))}
                </select>
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
            disabled={!isFormValid() || isSubmitting}
            className={!isFormValid() || isSubmitting ? 'disabled' : ''}
          >
            {isSubmitting ? 'Creating...' : 'Create Race'}
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

export default NewRaceForm; 
import React, { useState } from 'react';
import './NewStudentForm.css';

function NewStudentForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    age: ''
  });
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/v1/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          student: {
            name: formData.name,
            age: parseInt(formData.age)
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create student');
      }

      const createdStudent = await response.json();
      onSubmit(createdStudent);
      setFormData({ name: '', age: '' });
    } catch (err) {
      setError('Failed to create student. Please try again.');
      console.error('Error creating student:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = () => {
    return (
      formData.name.trim() !== '' && 
      formData.age !== '' && 
      !isNaN(formData.age) && 
      parseInt(formData.age) > 0
    );
  };

  return (
    <div className="new-student-form">
      <h3>Add New Student</h3>
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="studentName">Name:</label>
          <input
            type="text"
            id="studentName"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="studentAge">Age:</label>
          <input
            type="number"
            id="studentAge"
            value={formData.age}
            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
            min="1"
            required
          />
        </div>

        <div className="form-actions">
          <button 
            type="submit" 
            disabled={!isFormValid() || isSubmitting}
            className={(!isFormValid() || isSubmitting) ? 'disabled' : ''}
          >
            {isSubmitting ? 'Creating...' : 'Add Student'}
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

export default NewStudentForm; 
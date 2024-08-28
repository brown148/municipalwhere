// src/components/CitySimulator.js
import React, { useState } from 'react';
import PropTypes from 'prop-types';

const cityOptions = [
  { name: 'Santa Ana', coordinates: [33.7455, -117.8677] },
  { name: 'Irvine', coordinates: [33.6846, -117.8265] },
  { name: 'Anaheim', coordinates: [33.8366, -117.9143] },
  { name: 'Fullerton', coordinates: [33.8704, -117.9243] },
  { name: 'Costa Mesa', coordinates: [33.6411, -117.9187] },
];

export default function CitySimulator({ onClose, onCitySelect }) {
  const [selectedCity, setSelectedCity] = useState('');

  const handleSelectChange = (event) => {
    setSelectedCity(event.target.value);
  };

  const handleSubmit = () => {
    const city = cityOptions.find(option => option.name === selectedCity);
    if (city) {
      onCitySelect(city.coordinates);
    }
    onClose();
  };

  return (
    <div style={styles.modalContainer}>
      <div style={styles.modalContent}>
        <h2 style={styles.modalTitle}>Simulate Location</h2>
        <label style={styles.label}>
          Select a City:
          <select
            value={selectedCity}
            onChange={handleSelectChange}
            style={styles.select}
          >
            <option value="">--Select City--</option>
            {cityOptions.map((option) => (
              <option key={option.name} value={option.name}>
                {option.name}
              </option>
            ))}
          </select>
        </label>
        <button style={styles.submitButton} onClick={handleSubmit}>
          Simulate
        </button>
        <button style={styles.closeButton} onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}

CitySimulator.propTypes = {
  onClose: PropTypes.func.isRequired,
  onCitySelect: PropTypes.func.isRequired,
};

const styles = {
  modalContainer: {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    padding: '1rem',
    borderRadius: '0.5rem',
    width: '80%',
    maxWidth: '400px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    zIndex: 1001,
  },
  modalTitle: {
    fontSize: '1.5rem',
    fontWeight: '500',
    marginBottom: '1rem',
    color: '#333',
  },
  label: {
    marginBottom: '1rem',
    fontSize: '1rem',
    color: '#333',
  },
  select: {
    padding: '0.5rem',
    fontSize: '1rem',
    marginTop: '0.5rem',
    width: '100%',
  },
  submitButton: {
    backgroundColor: '#333',
    padding: '0.5rem 1rem',
    borderRadius: '0.25rem',
    marginTop: '1rem',
    color: '#FAFAFA',
    fontWeight: '500',
    border: 'none',
    cursor: 'pointer',
    width: '100%',
  },
  closeButton: {
    backgroundColor: '#333',
    padding: '0.5rem 1rem',
    borderRadius: '0.25rem',
    marginTop: '1rem',
    color: '#FAFAFA',
    fontWeight: '500',
    border: 'none',
    cursor: 'pointer',
    width: '100%',
    textAlign: 'center',
  },
};

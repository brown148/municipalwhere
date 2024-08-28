import React from 'react';
import PropTypes from 'prop-types';

const InfoModal = ({ visible, onClose, fields, insideFeature }) => {
  if (!visible) return null;

  return (
    <div style={styles.modalContainer}>
      <div style={styles.modalContent}>
        <h2 style={styles.modalTitle}>Information</h2>
        <div style={styles.infoContent}>
          {fields.map((field) => (
            <div key={field.key} style={styles.infoItem}>
              <strong>{field.label}:</strong> {insideFeature?.properties[field.key] || 'N/A'}
            </div>
          ))}
        </div>
        <button style={styles.closeButton} onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

InfoModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  fields: PropTypes.array.isRequired,
  insideFeature: PropTypes.object,
};

const styles = {
  modalContainer: {
    position: 'fixed',
    top: 0,
    left: 0,
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
  infoContent: {
    width: '100%',
  },
  infoItem: {
    marginBottom: '0.5rem',
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
    zIndex: 1002,
  },
};

export default InfoModal;

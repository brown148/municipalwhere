import React from 'react';
import PropTypes from 'prop-types';
import '../InfoModal.css'; // Import the CSS file for styling

const InfoModal = ({ visible, onClose, fields, insideFeature }) => {
  if (!visible) return null;

  const formatValue = (value, isString) => {
    if (isString) {
      return value;
    }
    if (!isNaN(value)) {
      return Number(value).toLocaleString();
    }
    return value;
  };

  const toProperCase = (input) => {
    return input
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="modal-title">{toProperCase(fields[0].label)}</h2>
        <p className="modal-value">
          {formatValue(insideFeature.properties[fields[0].key], true)}
        </p>
        <div className="table">
          {fields.slice(1).map((field, index) => (
            <div key={index} className="table-row">
              <div className="table-cell-label">
                {toProperCase(field.label)}
              </div>
              <div className="table-cell-value">
                {formatValue(insideFeature.properties[field.key], false)}
              </div>
            </div>
          ))}
        </div>
        <button className="close-button" onClick={onClose}>Close</button>
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

export default InfoModal;

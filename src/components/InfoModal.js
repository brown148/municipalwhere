import React from 'react';
import '../InfoModal.css'; // Import the CSS file for styles

function toProperCase(input) {
  return input
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export default function InfoModal({ visible, onClose, fields, insideFeature }) {
  if (!insideFeature || !visible) {
    return null;
  }

  const formatValue = (value, isString) => {
    if (isString) {
      return value;
    }
    if (!isNaN(value)) {
      return Number(value).toLocaleString();
    }
    return value;
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
              <span className="table-cell-label">
                {toProperCase(field.label)}
              </span>
              <span className="table-cell-value">
                {formatValue(insideFeature.properties[field.key], false)}
              </span>
            </div>
          ))}
        </div>
        <button className="close-button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}

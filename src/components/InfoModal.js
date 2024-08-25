import React from 'react';

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

// CSS styles equivalent to the React Native styles

const styles = `
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  width: 80%;
  max-width: 500px;
  text-align: center;
}

.modal-title {
  font-family: 'SF-Pro', sans-serif;
  font-size: 1.5rem;
  color: red;
  margin-bottom: 10px;
}

.modal-value {
  font-family: 'SF-Pro', sans-serif;
  font-size: 1.5rem;
  color: black;
  margin-bottom: 20px;
}

.table {
  width: 100%;
  margin: 20px 0;
}

.table-row {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
}

.table-cell-label {
  font-family: 'SF-Pro', sans-serif;
  font-size: 1rem;
  color: black;
  flex: 1;
}

.table-cell-value {
  font-family: 'SF-Pro', sans-serif;
  font-size: 1rem;
  color: red;
  flex: 1;
  text-align: right;
}

.close-button {
  padding: 10px 20px;
  font-size: 1rem;
  background-color: red;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.close-button:hover {
  background-color: darkred;
}
`;

// Add the styles to the page
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

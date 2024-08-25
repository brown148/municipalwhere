import React from 'react';
import './CommonCardStyles.css'; // Import the CSS file

const CommonCard = ({ label, value, location, distance }) => {
  return (
    <div className="card">
      <div className="label">{label}</div>
      <div className="value">{value}</div>
      <div className="location">{location}</div>
      <div className="distance">{distance}</div>
    </div>
  );
};

export default CommonCard;

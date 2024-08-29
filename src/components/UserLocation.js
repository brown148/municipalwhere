import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import '../CommonCardStyles.css'; // Import the CSS file

const UserLocationInfo = ({ userLocationDataObj, backgroundColor = '#fff' }) => {
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    if (userLocationDataObj) {
      console.log('ULD:',userLocationDataObj);
      setUserLocation(userLocationDataObj.geometry.coordinates);
      
    }
  }, [userLocationDataObj]);

console.log('ULD:',userLocationDataObj);
console.log('TEST:', ' ', userLocation);

  return (
    <div className="user-location-info" style={{ backgroundColor }}>
      {userLocation ? (
        <div className="card">
          <span className="label">User Location</span>
          <span className="location">
            Latitude: {userLocation[1].toFixed(2)}°, Longitude: {userLocation[0].toFixed(2)}°
          </span>
        </div>
      ) : (
        <p className="text">User location data not available.</p>
      )}
    </div>
  );
};

UserLocationInfo.propTypes = {
  userLocationDataObj: PropTypes.shape({
    type: PropTypes.string.isRequired,
    geometry: PropTypes.shape({
      type: PropTypes.string.isRequired,
      coordinates: PropTypes.arrayOf(PropTypes.number).isRequired,
    }).isRequired,
    properties: PropTypes.object,
  }),
  backgroundColor: PropTypes.string,
};

export default UserLocationInfo;

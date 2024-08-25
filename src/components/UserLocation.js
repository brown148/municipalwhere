import React, { useEffect, useState } from 'react';
import '../CommonCardStyles.css'; // Import the CSS file

const UserLocationInfo = ({ backgroundColor = '#fff' }) => {
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    const requestLocationPermission = async () => {
      if (!navigator.geolocation) {
        console.error('Geolocation is not supported by this browser.');
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation(position.coords);

          navigator.geolocation.watchPosition(
            (newLocation) => {
              setUserLocation(newLocation.coords);
            },
            (error) => {
              console.error('Error watching position:', error);
            }
          );
        },
        (error) => {
          console.error('Error getting user location:', error);
        }
      );
    };

    requestLocationPermission();
  }, []);

  return (
    <div className="user-location-info" style={{ backgroundColor }}>
      {userLocation ? (
        <div className="card">
          <span className="label">User Location</span>
          <span className="location">
            Altitude: {userLocation.altitude ? (userLocation.altitude * 3.28084).toFixed(0) : 'N/A'} ft. at {userLocation.latitude.toFixed(2)}°, {userLocation.longitude.toFixed(2)}°
          </span>
        </div>
      ) : (
        <p className="text">User location data not available.</p>
      )}
    </div>
  );
};

export default UserLocationInfo;

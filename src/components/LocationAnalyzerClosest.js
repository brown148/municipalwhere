import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import * as turf from '@turf/turf';
import '../CommonCardStyles.css'; // Import the CSS file

export default function LocationAnalyzerClosest({ featureData, keyField, featureType }) {
  const [nearestPoint, setNearestPoint] = useState(null);
  const [bearing, setBearing] = useState(null);
  const [distance, setDistance] = useState(null);
  const featureDataRef = useRef(featureData);

  useEffect(() => {
    const calculateNearestLocation = () => {
      if (!navigator.geolocation) {
        console.error('Geolocation is not supported by this browser.');
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { longitude, latitude } = position.coords;
          const referencePoint = turf.point([longitude, latitude]);
          const closestPoint = turf.nearestPoint(referencePoint, featureDataRef.current);
          const newBearing = turf.bearing(referencePoint, closestPoint);
          const newCardinalDirection = calculateCardinalDirection(newBearing);
          const newDistance = (closestPoint.properties.distanceToPoint.toFixed(2) * 0.621371).toFixed(2);

          setNearestPoint(closestPoint);
          setBearing(newCardinalDirection);
          setDistance(newDistance);
        },
        (error) => {
          console.error('Error getting user location:', error);
        }
      );
    };

    calculateNearestLocation();
    const intervalId = setInterval(calculateNearestLocation, 2000);

    return () => {
      clearInterval(intervalId);
    };
  }, [featureData]);

  const calculateCardinalDirection = (bearing) => {
    const cardinalDirections = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const bearingDegrees = (bearing + 360) % 360;
    const index = Math.floor((bearingDegrees + 22.5) / 45);
    return cardinalDirections[index];
  };

  return (
    <div className="card">
      {nearestPoint ? (
        <div >
          <span className="label">Nearest {featureType}</span>
          <span className="value">{nearestPoint.properties[keyField]}</span>
          <span className="distance">{distance} mi {bearing}</span>
        </div>
      ) : (
        <p className="label">Loading nearest {featureType}...</p>
      )}
    </div>
  );
}

LocationAnalyzerClosest.propTypes = {
  featureData: PropTypes.array.isRequired,
  keyField: PropTypes.string.isRequired,
  featureType: PropTypes.string.isRequired,
};

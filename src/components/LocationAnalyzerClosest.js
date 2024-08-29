import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import * as turf from '@turf/turf';
import '../CommonCardStyles.css'; // Import the CSS file

export default function LocationAnalyzerClosest({ featureData, keyField, featureType, userLocationDataObj }) {
  const [nearestPoint, setNearestPoint] = useState(null);
  const [bearing, setBearing] = useState(null);
  const [distance, setDistance] = useState(null);
  const featureDataRef = useRef(featureData);

  useEffect(() => {
    const calculateNearestLocation = () => {
      if (!userLocationDataObj || !userLocationDataObj.geometry || userLocationDataObj.geometry.coordinates.length !== 2) {
        console.error('Invalid user location data.');
        return;
      }

      const referencePoint = turf.point(userLocationDataObj.geometry.coordinates);
      const closestPoint = turf.nearestPoint(referencePoint, featureDataRef.current);
      const newBearing = turf.bearing(referencePoint, closestPoint);
      const newCardinalDirection = calculateCardinalDirection(newBearing);
      const newDistance = (closestPoint.properties.distanceToPoint.toFixed(2) * 0.621371).toFixed(2);

      setNearestPoint(closestPoint);
      setBearing(newCardinalDirection);
      setDistance(newDistance);
    };

    calculateNearestLocation();
  }, [userLocationDataObj, featureData]);

  const calculateCardinalDirection = (bearing) => {
    const cardinalDirections = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const bearingDegrees = (bearing + 360) % 360;
    const index = Math.floor((bearingDegrees + 22.5) / 45);
    return cardinalDirections[index];
  };

  return (
    <div className="card">
      {nearestPoint ? (
        <div>
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
  userLocationDataObj: PropTypes.object.isRequired, // Expecting userLocationDataObj with geometry.coordinates
};

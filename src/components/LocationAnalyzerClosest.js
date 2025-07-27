import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import * as turf from '@turf/turf';
import '../CommonCardStyles.css'; // Import the CSS file
import InfoModal from './InfoModal'; // Import the InfoModal component

export default function LocationAnalyzerClosest({ featureData, keyField, featureType, userLocationDataObj, fields }) {
  const [nearestPoint, setNearestPoint] = useState(null);
  const [bearing, setBearing] = useState(null);
  const [distance, setDistance] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility
  const featureDataRef = useRef(featureData);

  useEffect(() => {
    console.log('User location data:', userLocationDataObj);
    console.log('Feature data:', featureData);

    const calculateNearestLocation = () => {
  if (
    !userLocationDataObj ||
    !userLocationDataObj.geometry ||
    userLocationDataObj.geometry.coordinates.length !== 2
  ) {
    console.error('Invalid user location data:', userLocationDataObj);
    return;
  }

  try {
    const referencePoint = turf.point(userLocationDataObj.geometry.coordinates);
    const featureCollection = turf.featureCollection(featureDataRef.current);
    const closestPoint = turf.nearestPoint(referencePoint, featureCollection);

    const newBearing = turf.bearing(referencePoint, closestPoint);
    const newCardinalDirection = calculateCardinalDirection(newBearing);

    const newDistance = (
      closestPoint.properties.distanceToPoint.toFixed(2) * 0.621371
    ).toFixed(2);

    setNearestPoint(closestPoint);
    setBearing(newCardinalDirection);
    setDistance(newDistance);
  } catch (error) {
    console.error('Error during nearest location calculation:', error);
  }
};


    calculateNearestLocation();
  }, [userLocationDataObj, featureData]);

  const calculateCardinalDirection = (bearing) => {
    const cardinalDirections = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const bearingDegrees = (bearing + 360) % 360;
    const index = Math.floor((bearingDegrees + 22.5) / 45);
    return cardinalDirections[index];
  };

  const handleOpenModal = () => {
    console.log('Opening modal...');
    setIsModalOpen(true); // Open the modal
  };

  const handleCloseModal = () => {
    console.log('Closing modal...');
    setIsModalOpen(false); // Close the modal
  };

  return (
    <div className="card">
      {nearestPoint ? (
        <div onClick={handleOpenModal} style={{ cursor: 'pointer' }}>
          <span className="label">Nearest {featureType}</span>
          <span className="value">{nearestPoint.properties[keyField]}</span>
          <span className="distance">{distance} mi {bearing}</span>
        </div>
      ) : (
        <p className="label">Loading nearest {featureType}...</p>
      )}
      
      {nearestPoint && (
        <InfoModal 
          visible={isModalOpen} 
          onClose={handleCloseModal}
          fields={fields} // Pass the fields prop to the InfoModal
          insideFeature={nearestPoint}
        />
      )}
    </div>
  );
}

LocationAnalyzerClosest.propTypes = {
  featureData: PropTypes.array.isRequired,
  keyField: PropTypes.string.isRequired,
  featureType: PropTypes.string.isRequired,
  userLocationDataObj: PropTypes.object.isRequired, // Expecting userLocationDataObj with geometry.coordinates
  fields: PropTypes.array.isRequired, // Expecting an array of field objects
};

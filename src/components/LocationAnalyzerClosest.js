import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import * as turf from '@turf/turf';
import '../CommonCardStyles.css';
import InfoModal from './InfoModal';

export default function LocationAnalyzerClosest({ featureData, keyField, featureType, userLocationDataObj, fields }) {
  const [nearestPoint, setNearestPoint] = useState(null);
  const [bearing, setBearing] = useState(null);
  const [distance, setDistance] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const featureDataRef = useRef(featureData);

  useEffect(() => {
    const extractFeatures = (data) => {
      if (!data) return [];
      if (Array.isArray(data)) return data;
      if (data.type === 'FeatureCollection') return data.features || [];
      return [];
    };

    const calculateNearestLocation = () => {
      if (
        !userLocationDataObj ||
        !userLocationDataObj.geometry ||
        !Array.isArray(userLocationDataObj.geometry.coordinates) ||
        userLocationDataObj.geometry.coordinates.length !== 2
      ) {
        console.error('Invalid user location data:', userLocationDataObj);
        return;
      }

      try {
        const referencePoint = turf.point(userLocationDataObj.geometry.coordinates);
        const rawFeatures = extractFeatures(featureDataRef.current);

        const validFeatures = rawFeatures.filter(
          (f) =>
            f &&
            f.geometry &&
            f.geometry.type === 'Point' &&
            Array.isArray(f.geometry.coordinates) &&
            f.geometry.coordinates.length === 2 &&
            typeof f.geometry.coordinates[0] === 'number' &&
            typeof f.geometry.coordinates[1] === 'number'
        );

        if (validFeatures.length === 0) {
          console.warn('No valid Point features found in featureData');
          return;
        }

        const featureCollection = turf.featureCollection(validFeatures);
        const closest = turf.nearestPoint(referencePoint, featureCollection);

        const newBearing = turf.bearing(referencePoint, closest);
        const newCardinalDirection = calculateCardinalDirection(newBearing);
        const newDistance = (closest.properties.distanceToPoint.toFixed(2) * 0.621371).toFixed(2); // km to mi

        setNearestPoint(closest);
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
    const index = Math.floor((bearingDegrees + 22.5) / 45) % 8;
    return cardinalDirections[index];
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
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
          fields={fields}
          insideFeature={nearestPoint}
        />
      )}
    </div>
  );
}

LocationAnalyzerClosest.propTypes = {
  featureData: PropTypes.oneOfType([
    PropTypes.array, // Array of Features
    PropTypes.object // Full FeatureCollection
  ]).isRequired,
  keyField: PropTypes.string.isRequired,
  featureType: PropTypes.string.isRequired,
  userLocationDataObj: PropTypes.object.isRequired,
  fields: PropTypes.array.isRequired,
};

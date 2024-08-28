import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { booleanPointInPolygon } from '@turf/turf';
import InfoModal from './InfoModal';
import '../CommonCardStyles.css'; // Import the CSS file

export default function LocationAnalyzer({ featureData, fields = [], featureType }) {
  const [insideFeature, setInsideFeature] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false); // New state for refresh indicator
  const featureDataRef = useRef(featureData);

  const fetchUserLocation = () => {
    console.log('Checking user location...'); // Log when fetching starts
    setIsRefreshing(true); // Set refresh state to true

    if (!navigator.geolocation) {
      console.error('Geolocation is not supported by this browser');
      setIsRefreshing(false); // Reset refresh state if geolocation is not supported
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { longitude, latitude } = position.coords;

        const userLocationDataObj = {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [longitude, latitude],
          },
          properties: {
            name: 'Device',
            description: 'This is the device location.',
          },
        };

        // Check if the user is inside any of the features
        const featureInside = featureDataRef.current.find((feature) =>
          booleanPointInPolygon(userLocationDataObj, feature)
        );

        setInsideFeature(featureInside || null);
        console.log('Location update:', featureInside ? 'Inside feature' : 'Not inside any feature'); // Log location update
        setIsRefreshing(false); // Reset refresh state after checking
      },
      (error) => {
        console.error('Error getting user location:', error);
        setIsRefreshing(false); // Reset refresh state if there is an error
      }
    );
  };

  useEffect(() => {
    fetchUserLocation(); // Initial fetch
    const intervalId = setInterval(fetchUserLocation, 5000); // Check every 5 seconds

    return () => {
      clearInterval(intervalId); // Cleanup interval on unmount
    };
  }, [featureData]);

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
    <div className="card" onClick={() => setIsModalVisible(true)}>
      <div className="card-content">
        {insideFeature ? (
          <div>
            <span className="label">{fields[0].label}</span>
            <span className="value">
              {formatValue(insideFeature.properties[fields[0].key], true)}
            </span>
          </div>
        ) : (
          <p className="label">
            User Device is not inside any {featureType}.
          </p>
        )}
        {/* Subtle dot for refresh indicator */}
        <div className={`refresh-indicator ${isRefreshing ? 'active' : ''}`}></div>
      </div>
      <InfoModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        fields={fields}
        insideFeature={insideFeature}
      />
    </div>
  );
}

LocationAnalyzer.propTypes = {
  featureData: PropTypes.array.isRequired,
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ),
  featureType: PropTypes.string.isRequired,
};

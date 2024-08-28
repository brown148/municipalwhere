import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { booleanPointInPolygon } from '@turf/turf';
import InfoModal from './InfoModal';
import '../CommonCardStyles.css'; // Import the CSS file

export default function LocationAnalyzer({ featureData, fields = [], featureType }) {
  const [insideFeature, setInsideFeature] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const featureDataRef = useRef(featureData);

  const fetchUserLocation = () => {
    console.log('Checking user location...');

    if (!navigator.geolocation) {
      console.error('Geolocation is not supported by this browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { longitude, latitude } = position.coords;

        console.log(`User location obtained: Longitude=${longitude}, Latitude=${latitude}`);

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

        let foundInsideFeature = false;

        for (const feature of featureDataRef.current) {
          const isInside = booleanPointInPolygon(userLocationDataObj, feature);
          if (isInside) {
            console.log('User is inside a feature.');
            setInsideFeature(feature);
            foundInsideFeature = true;
            break;
          }
        }

        if (!foundInsideFeature) {
          console.log('User is not inside any feature.');
          setInsideFeature(null);
        }
      },
      (error) => {
        console.error('Error getting user location:', error);
      }
    );
  };

  useEffect(() => {
    console.log('Component mounted or featureData changed. Fetching location.');
    fetchUserLocation();

    const intervalId = setInterval(() => {
      console.log('Interval fetch triggered.');
      fetchUserLocation();
    }, 2000);

    return () => {
      console.log('Cleaning up interval on component unmount.');
      clearInterval(intervalId);
    };
  }, [featureData]); // Ensures location is fetched when featureData changes or component mounts

  const formatValue = (value, isString) => {
    if (isString) {
      return value;
    }
    if (!isNaN(value)) {
      return Number(value).toLocaleString();
    }
    return value;
  };

  console.log('Rendering LocationAnalyzer component.');

  return (
    <div className="card" onClick={() => setIsModalVisible(true)}>
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

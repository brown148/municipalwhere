import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { booleanPointInPolygon } from '@turf/turf';
import InfoModal from './InfoModal';
import '../CommonCardStyles.css'; // Import the CSS file

export default function LocationAnalyzer({ featureData, fields = [], featureType }) {
  const [insideFeature, setInsideFeature] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [highlight, setHighlight] = useState(false); // State for highlight effect

  const fetchUserLocation = async () => {
    try {
      if (!navigator.geolocation) {
        console.error('Geolocation is not supported by this browser');
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

          for (const feature of featureData) {
            const isInside = booleanPointInPolygon(userLocationDataObj, feature);
            if (isInside) {
              setInsideFeature(feature);
              return;
            }
          }

          setInsideFeature(null);
        },
        (error) => {
          console.error('Error getting user location:', error);
        }
      );
    } catch (error) {
      console.error('Error fetching user location:', error);
    }
  };

  useEffect(() => {
    fetchUserLocation();
  }, [featureData]);

  useEffect(() => {
    if (insideFeature) {
      setHighlight(true);
      const timer = setTimeout(() => {
        setHighlight(false);
      }, 500); // Highlight for 500ms
      return () => clearTimeout(timer);
    }
  }, [insideFeature]); // Trigger effect on insideFeature change

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
    <div>
      {insideFeature ? (
        <div className="card" onClick={() => setIsModalVisible(true)}>
          <span className="label">{fields[0].label}</span>
          <span
            className={`value ${highlight ? 'highlight' : ''}`}
          >
            {formatValue(insideFeature.properties[fields[0].key], true)}
          </span>
        </div>
      ) : (
        <p>
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

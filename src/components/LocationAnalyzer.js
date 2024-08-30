import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { booleanPointInPolygon } from '@turf/turf';
import InfoModal from './InfoModal';
import '../CommonCardStyles.css';

export default function LocationAnalyzer({ featureData, fields = [], featureType, userLocationDataObj }) {
  const [insideFeature, setInsideFeature] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState(''); // State for background color
  const [originalBackgroundColor, setOriginalBackgroundColor] = useState(''); // State for the original background color

  useEffect(() => {
    // Save the original background color when component mounts
    const cardElement = document.querySelector('.card');
    if (cardElement) {
      setOriginalBackgroundColor(getComputedStyle(cardElement).backgroundColor);
    }
  }, []);

  useEffect(() => {
    const analyzeUserLocation = () => {
      console.log('Checking user location...'); // Log when fetching starts

      for (const feature of featureData) {
        const isInside = booleanPointInPolygon(userLocationDataObj, feature);
        if (isInside) {
          setInsideFeature(feature);
          console.log('Location update: Inside feature', feature); // Log location update
          return;
        }
      }

      setInsideFeature(null);
      console.log('Location update: Not inside any feature'); // Log when not inside any feature
    };

    analyzeUserLocation();
  }, [userLocationDataObj, featureData]);

  // Effect to handle background color change when insideFeature changes
  useEffect(() => {
    if (insideFeature) {
      // Change background color to lighter green with transparency immediately
      setBackgroundColor('rgba(0, 255, 0, 0.1)'); // Lighter green with 20% opacity

      // Fade background color back to original after 10 seconds
      const timer = setTimeout(() => {
        setBackgroundColor(originalBackgroundColor);
      }, 10000); // 10 seconds

      return () => clearTimeout(timer); // Cleanup timer on unmount or insideFeature change
    } else {
      // Ensure background color fades back to original even when insideFeature is null
      setBackgroundColor(originalBackgroundColor);
    }
  }, [insideFeature, originalBackgroundColor]);

  const handleCloseModal = () => {
    console.log('Modal close requested');
    setIsModalVisible((prev) => {
      console.log('Previous state:', prev);
      return false;
    });
  };

  useEffect(() => {
    console.log('Modal visibility changed:', isModalVisible);
  }, [isModalVisible]);

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
    <div 
      className="card" 
      onClick={() => setIsModalVisible(true)}
      style={{ backgroundColor }} // Apply the background color with immediate change and fade
    >
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
      </div>
      <InfoModal
        visible={isModalVisible}
        onClose={handleCloseModal}
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
  userLocationDataObj: PropTypes.object.isRequired,
};

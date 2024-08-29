import React, { useState, useEffect } from 'react';
import LocationAnalyzer from './components/LocationAnalyzer';
import LocationAnalyzerClosest from './components/LocationAnalyzerClosest';
import UserLocationInfo from './components/UserLocation';

import cityData from './data/cityData.json';
import countyData from './data/countyData.json';
import zipCodes from './data/zipcodes.json';
import supData from './data/supData.json';
import schoolDistrictData from './data/schoolDistricts.json';
import waterDistrictData from './data/waterDistricts.json';
import fireStations from './data/fireStations.json';

export default function App() {
  const [cardVisibility, setCardVisibility] = useState({
    City: { visible: true, label: 'City' },
    County: { visible: false, label: 'County' },
    ZipCode: { visible: false, label: 'Zip Code' },
    Sup: { visible: false, label: 'County Supervisor' },
    SchoolDistrict: { visible: true, label: 'School District' },
    WaterDistrict: { visible: true, label: 'Water District' },
    FireStation: { visible: true, label: 'Nearest Fire Station' },
    DeviceLocation: { visible: true, label: 'Device Location' },
  });

  const [deviceLocation, setDeviceLocation] = useState([-117.78, 33.89]); // Default to some coordinates

  // Update location every second
  useEffect(() => {
    const updateLocation = () => {
      navigator.geolocation.watchPosition(
        (position) => {
          const { longitude, latitude } = position.coords;
          console.log(position.coords);
          setDeviceLocation([longitude, latitude]);
        },
        (error) => {
          console.error('Error fetching location:', error);
        }
      );
    };

    // Call updateLocation every second
    const locationInterval = setInterval(updateLocation, 1000);

    // Cleanup the interval on component unmount
    return () => clearInterval(locationInterval);
  }, []);

  // Construct userLocationDataObj based on deviceLocation
  const userLocationDataObj = {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: deviceLocation,
    },
    properties: {
      name: 'Device',
      description: 'This is the device location.',
    },
  };

  const cardsConfig = [
    { key: 'City', component: <LocationAnalyzer featureData={cityData.features} fields={[{ key: 'CITY', label: 'City' }]} featureType="CITY" userLocationDataObj={userLocationDataObj} /> },
    { key: 'County', component: <LocationAnalyzer featureData={countyData.features} fields={[{ key: 'COUNTY_NAME', label: 'County' }]} featureType="County" userLocationDataObj={userLocationDataObj} /> },
    { key: 'ZipCode', component: <LocationAnalyzer featureData={zipCodes.features} fields={[{ key: 'ZIP_CODE', label: 'Zip Code' }, { key: 'POPULATION', label: 'Population' }, { key: 'POP_SQMI', label: 'Pop. Per Sq. Mi.' }]} featureType="Zip Code" userLocationDataObj={userLocationDataObj} /> },
    { key: 'Sup', component: <LocationAnalyzer featureData={supData.features} fields={[{ key: 'NAME', label: 'County Supervisor' }, { key: 'Label', label: 'Area' }]} featureType="Supervisorial District" userLocationDataObj={userLocationDataObj} /> },
    { key: 'SchoolDistrict', component: <LocationAnalyzer featureData={schoolDistrictData.features} fields={[ { key: 'S_DISTRICT', label: 'School District' }]} featureType="School District" userLocationDataObj={userLocationDataObj} /> },
    { key: 'WaterDistrict', component: <LocationAnalyzer featureData={waterDistrictData.features} fields={[{ key: 'NAME', label: 'Water District' }]} featureType="Water District" userLocationDataObj={userLocationDataObj} /> },
    { key: 'FireStation', component: <LocationAnalyzerClosest featureData={fireStations} keyField="Alias" featureType="Fire Station" userLocationDataObj={userLocationDataObj} /> },
    { key: 'DeviceLocation', component: <UserLocationInfo userLocationDataObj={userLocationDataObj} /> },
  ];

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.h1}>The Municipal Where</h1>
        <h4 style={styles.h4}>One Location, Many Layers of Governance</h4>
      </header>
      <hr style={styles.divider} />
      <main style={styles.scrollViewContent}>
        <div style={styles.cardsContainer}>
          {cardsConfig.map(
            (card) =>
              cardVisibility[card.key].visible && (
                <div style={styles.card} key={card.key}>
                  {card.component}
                </div>
              )
          )}
          <hr style={styles.divider} />
        </div>
        <h4 style={styles.h4}>©2024 The Municipal Where</h4>
      </main>

      <footer style={styles.footer}>
      </footer>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    padding: '10px',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    width: '380px',
    maxWidth: '1200px',
    margin: '0 auto',
    position: 'relative',
  },
  header: {
    width: '100%',
    maxWidth: '1200px',
    backgroundColor: '#FAFAFA',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  h1: {
    fontFamily: 'Times New Roman',
    fontSize: '2rem',
    fontWeight: '500',
    textAlign: 'center',
    color: '#333',
    margin: 0,
  },
  h4: {
    fontFamily: 'Times New Roman',
    fontSize: '1rem',
    fontWeight: '500',
    textAlign: 'center',
    color: '#333',
    margin: '5px 0',
  },
  divider: {
    width: '360px',
    height: '1px',
    backgroundColor: '#E0E0E0',
    margin: '10px 0',
  },
  scrollViewContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
  },
  cardsContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
  },
  toggleButton: {
    backgroundColor: '#333',
    padding: '10px',
    borderRadius: '5px',
    marginTop: '10px',
    color: '#FAFAFA',
    fontWeight: '500',
    border: 'none',
    cursor: 'pointer',
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: '5px',
    padding: '10px',
    boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)',
    marginBottom: '10px',
    width: '360px',
  },
  modalContainer: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: '5px',
    padding: '20px',
    boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)',
    width: '400px',
    textAlign: 'center',
  },
  modalTitle: {
    fontFamily: 'Times New Roman',
    fontSize: '1.5rem',
    fontWeight: '500',
    marginBottom: '20px',
  },
  cardTogglesContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '10px',
  },
  checkboxText: {
    fontFamily: 'Times New Roman',
    fontSize: '1rem',
    marginLeft: '10px',
  },
  closeButton: {
    backgroundColor: '#333',
    padding: '10px',
    borderRadius: '5px',
    marginTop: '20px',
    color: '#FAFAFA',
    fontWeight: '500',
    border: 'none',
    cursor: 'pointer',
  },
  footer: {
    marginTop: '20px',
    backgroundColor: '#FAFAFA',
    padding: '10px',
    borderRadius: '5px',
    boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '360px',
    textAlign: 'center',
    position: 'fixed',
    bottom: 0,
  },
};

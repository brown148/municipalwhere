import React, { useState } from 'react';
import LocationAnalyzer from './components/LocationAnalyzer';
import LocationAnalyzerClosest from './components/LocationAnalyzerClosest';
import DeviceLocation from './components/UserLocation';

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

  const [isModalVisible, setIsModalVisible] = useState(false);

  const toggleCardVisibility = (cardType) => {
    setCardVisibility((prevState) => ({
      ...prevState,
      [cardType]: {
        ...prevState[cardType],
        visible: !prevState[cardType].visible,
      },
    }));
  };

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const cardsConfig = [
    { key: 'City', component: <LocationAnalyzer featureData={cityData.features} fields={[{ key: 'CITY', label: 'City' }]} keyField="CITY" featureType="CITY" /> },
    { key: 'County', component: <LocationAnalyzer featureData={countyData.features} fields={[{ key: 'COUNTY_NAME', label: 'County' }]} featureType="County" /> },
    { key: 'ZipCode', component: <LocationAnalyzer featureData={zipCodes.features} fields={[{ key: 'ZIP_CODE', label: 'Zip Code' }, { key: 'POPULATION', label: 'Population' }, { key: 'POP_SQMI', label: 'Pop. Per Sq. Mi.' }]} featureType="Zip Code" /> },
    { key: 'Sup', component: <LocationAnalyzer featureData={supData.features} fields={[{ key: 'NAME', label: 'County Supervisor' },{ key: 'Label', label: 'Area' }]} featureType="Supervisorial District" /> },
    { key: 'SchoolDistrict', component: <LocationAnalyzer featureData={schoolDistrictData.features} fields={[{ key: 'SCHOOL', label: 'School District' }, { key: 'S_DISTRICT', label: 'School District' }]} featureType="School District" /> },
    { key: 'WaterDistrict', component: <LocationAnalyzer featureData={waterDistrictData.features} fields={[{ key: 'NAME', label: 'Water District' }]} featureType="Water District" /> },
    { key: 'FireStation', component: <LocationAnalyzerClosest featureData={fireStations} keyField="Alias" featureType="Fire Station" /> },
    { key: 'DeviceLocation', component: <DeviceLocation /> },
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
          <button style={styles.toggleButton} onClick={toggleModal}>
            Toggle Cards
          </button>
        </div>
        <h4 style={styles.h4}>©2024 The Municipal Where</h4>
      </main>

      {isModalVisible && (
        <div style={styles.modalContainer}>
          <div style={styles.modalContent}>
            <h2 style={styles.modalTitle}>Toggle Cards</h2>
            <div style={styles.cardTogglesContainer}>
              {Object.keys(cardVisibility).map((cardType) => (
                <label style={styles.checkboxLabel} key={cardType}>
                  <input
                    type="checkbox"
                    checked={cardVisibility[cardType].visible}
                    onChange={() => toggleCardVisibility(cardType)}
                  />
                  <span style={styles.checkboxText}>{cardVisibility[cardType].label}</span>
                </label>
              ))}
            </div>
            <button style={styles.closeButton} onClick={toggleModal}>
              Close
            </button>
          </div>
        </div>
      )}
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
  modalContainer: {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    padding: '1rem',
    borderRadius: '0.5rem',
    width: '80%',
    maxWidth: '400px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    zIndex: 1001,
  },
  modalTitle: {
    fontSize: '1.5rem',
    fontWeight: '500',
    marginBottom: '1rem',
    color: '#333',
  },
  cardTogglesContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginBottom: '1rem',
  },
  checkboxLabel: {
    display: 'inline-flex',
    alignItems: 'center',
    marginBottom: '0.5rem',
    width: '100%',
  },
  checkboxText: {
    marginLeft: '8px',
    fontSize: '1rem',
    color: '#333',
  },
  closeButton: {
    backgroundColor: '#333',
    padding: '0.5rem 1rem',
    borderRadius: '0.25rem',
    marginTop: '1rem',
    color: '#FAFAFA',
    fontWeight: '500',
    border: 'none',
    cursor: 'pointer',
    width: '100%',
    textAlign: 'center',
  },
};

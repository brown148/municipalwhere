import React, { useState } from 'react';
import LocationAnalyzer from './components/LocationAnalyzer';
import LocationAnalyzerClosest from './components/LocationAnalyzerClosest';
import DeviceLocation from './components/UserLocation';

import cityData from './data/cityData.json';
import countyData from './data/countyData.json';
import zipCodes from './data/zipcodes.json';
import supData from './data/supData.json';
import privateSchoolData from './data/privateSchoolData.json';
import fireStations from './data/fireStations.json';

export default function App() {
  const [cardVisibility, setCardVisibility] = useState({
    City: true,
    County: true,
    ZipCode: true,
    Sup: true,
    School: true,
    PrivateSchool: false,
    FireStation: true,
    Congress: true,
    DeviceLocation: true,
  });

  const [isModalVisible, setIsModalVisible] = useState(false);

  const toggleCardVisibility = (cardType) => {
    setCardVisibility((prevState) => ({
      ...prevState,
      [cardType]: !prevState[cardType],
    }));
  };

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const cardsConfig = [
    {
      key: 'City',
      component: (
        <LocationAnalyzer
          featureData={cityData.features}
          fields={[{ key: 'CITY', label: 'City' }]}
          keyField="CITY"
          featureType="CITY"
        />
      ),
    },
    {
      key: 'County',
      component: (
        <LocationAnalyzer
          featureData={countyData.features}
          fields={[{ key: 'COUNTY_NAME', label: 'County' }]}
          featureType="County"
        />
      ),
    },
    {
      key: 'ZipCode',
      component: (
        <LocationAnalyzer
          featureData={zipCodes.features}
          fields={[
            { key: 'ZIP_CODE', label: 'Zip Code' },
            { key: 'POPULATION', label: 'Population' },
            { key: 'POP_SQMI', label: 'Pop. Per Sq. Mi.' },
          ]}
          featureType="Zip Code"
        />
      ),
    },
    {
      key: 'Sup',
      component: (
        <LocationAnalyzer
          featureData={supData.features}
          fields={[{ key: 'NAME', label: 'County Supervisor' }]}
          featureType="Supervisorial District"
        />
      ),
    },
    {
      key: 'PrivateSchool',
      component: (
        <LocationAnalyzerClosest
          featureData={privateSchoolData}
          keyField="School"
          featureType="Private School"
        />
      ),
    },
    {
      key: 'FireStation',
      component: (
        <LocationAnalyzerClosest
          featureData={fireStations}
          keyField="Alias"
          featureType="Fire Station"
        />
      ),
    },
    {
      key: 'DeviceLocation',
      component: (
        <DeviceLocation />
      ),
    }
  ];

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.h1}>The Municipal Where</h1>
      </header>
      <hr style={styles.divider} />
      <main style={styles.scrollViewContent}>
        <div style={styles.cardsContainer}>
          {cardsConfig.map(
            (card) =>
              cardVisibility[card.key] && (
                <div style={styles.card} key={card.key}>
                  {card.component}
                </div>
              )
          )}
          <button style={styles.toggleButton} onClick={toggleModal}>
            Toggle Cards
          </button>
        </div>
      </main>
      {isModalVisible && (
        <div style={styles.modalContainer}>
          <div style={styles.modalContent}>
            <h2 style={styles.modalTitle}>Toggle Cards</h2>
            {Object.keys(cardVisibility).map((cardType) => (
              <div style={styles.cardToggle} key={cardType}>
                <p style={styles.modalText}>{cardType}</p>
                <label style={{display: 'inline-flex', alignItems: 'center'}}>
                  <input
                    type="checkbox"
                    checked={cardVisibility[cardType]}
                    onChange={() => toggleCardVisibility(cardType)}
                  />
                  <span style={{marginLeft: '8px'}}>{cardType}</span>
                </label>
              </div>
            ))}
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
    width: '400px',
    margin: '0 auto',
  },
  header: {
    width: '100%',
    //padding: '10px',
    backgroundColor: '#FAFAFA',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  h1: {
    fontFamily: 'Times New Roman',
    fontSize: '35px',
    fontWeight: '500',
    textAlign: 'center',
    color: '#333',
  },
  divider: {
    width: '100%',
    height: '1px',
    backgroundColor: '#E0E0E0',
    //margin: '10px 0',
  },
  scrollViewContent: {
    display: 'flex',
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
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    padding: '20px',
    borderRadius: '10px',
    width: '80%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: '20px',
    fontWeight: '500',
    marginBottom: '10px',
    color: '#333',
  },
  modalText: {
    color: '#666',
  },
  cardToggle: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
    width: '100%',
  },
  closeButton: {
    backgroundColor: '#333',
    padding: '10px',
    borderRadius: '5px',
    marginTop: '10px',
    color: '#FAFAFA',
    fontWeight: '500',
    border: 'none',
    cursor: 'pointer',
    width: '100%',
    textAlign: 'center',
  },
};

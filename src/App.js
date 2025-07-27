import React, { useState, useEffect, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import LocationAnalyzer from './components/LocationAnalyzer';
import LocationAnalyzerClosest from './components/LocationAnalyzerClosest';
import UserLocationInfo from './components/UserLocation';
import './InfoModal.css'; // Keep this import if InfoModal.css is still used
import './App.css'; // Import the new CSS file

import cityData from './data/cityData.json';
import countyData from './data/countyData.json';
import zipCodes from './data/zipcodes.json';
import supData from './data/supData.json';
import schoolDistrictData from './data/schoolDistricts.json';
import waterDistrictData from './data/waterDistricts.json';
import fireStations from './data/fireStations.json';
import congress from './data/congress.json';
import countyFacilities from './data/countyFacilities.json';
import stateAssembly from './data/stateAssembly.json';
import stateSenate from './data/stateSenate.json';
import schoolSites from './data/schoolSiteData.json';
import privateSchools from './data/privateSchoolData.json';

export default function App() {
  const [cardVisibility, setCardVisibility] = useState({
    City: { visible: true, label: 'City' },
    County: { visible: false, label: 'County' },
    ZipCode: { visible: false, label: 'Zip Code' },
    Sup: { visible: false, label: 'County Supervisor' },
    SchoolDistrict: { visible: true, label: 'School District' },
    schoolSites: { visible: true, label: 'Public Schools' },
    privateSchools: { visible: true, label: 'Private Schools' },
    WaterDistrict: { visible: false, label: 'Water District' },
    FireStation: { visible: false, label: 'Nearest Fire Station' },
    DeviceLocation: { visible: true, label: 'Device Location' },
    StateSenate: { visible: false, label: 'State Senate' },
    StateAssembly: { visible: false, label: 'State Assembly' },
    Congress: { visible: false, label: 'Congressional District' },
    countyFacilities: { visible: true, label: 'County Facilities' }
  });

  const [deviceLocation, setDeviceLocation] = useState([-117.78, 33.89]); // Default to some coordinates
  const [isModalOpen, setIsModalOpen] = useState(false);

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

    const locationInterval = setInterval(updateLocation, 1000);

    return () => clearInterval(locationInterval);
  }, []);

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
    { key: 'SchoolDistrict', component: <LocationAnalyzer featureData={schoolDistrictData.features} fields={[{ key: 'S_DISTRICT', label: 'School District' }]} featureType="School District" userLocationDataObj={userLocationDataObj} /> },
    { key: 'schoolSites', component: <LocationAnalyzerClosest featureData={schoolSites} keyField="SchoolName" featureType="Public School" userLocationDataObj={userLocationDataObj} fields={[{key: 'SchoolName', label: 'School Name' },{ key: 'DistrictName', label: 'District Name' },{ key: 'SchoolType', label: 'School Type' },{ key: 'EnrollTotal', label: 'Enrollment' }]} /> },
    { key: 'privateSchools', component: <LocationAnalyzerClosest featureData={privateSchools} keyField="School" featureType="Private School" userLocationDataObj={userLocationDataObj} fields={[{key: 'School', label: 'School Name' }]} /> },
    { key: 'WaterDistrict', component: <LocationAnalyzer featureData={waterDistrictData.features} fields={[{ key: 'SA_NAME', label: 'Water District' }]} featureType="Water District" userLocationDataObj={userLocationDataObj} /> },
    { key: 'FireStation', component: <LocationAnalyzerClosest featureData={fireStations} keyField="Alias" featureType="Fire Station" userLocationDataObj={userLocationDataObj} fields={[{key: 'SiteAddress', label: 'Address' },{ key: 'City', label: 'City' },{ key: 'Agency', label: 'Agency' },{ key: 'StationNumber', label: 'StationNumber' }]} /> },
    { key: 'countyFacilities', component: <LocationAnalyzerClosest featureData={countyFacilities} keyField="Name" featureType="Facility Name" userLocationDataObj={userLocationDataObj} fields={[{key: 'Name', label: 'Facility Name' },{ key: 'Agency', label: 'Agency' }]} /> },
    { key: 'StateSenate', component: <LocationAnalyzer featureData={stateSenate.features} fields={[{ key: 'LABEL', label: 'State Senator' }]} featureType="State Senator" userLocationDataObj={userLocationDataObj} /> },
    { key: 'StateAssembly', component: <LocationAnalyzer featureData={stateAssembly.features} fields={[{ key: 'LABEL', label: 'State Assemblyperson' }]} featureType="State Assemblyperson" userLocationDataObj={userLocationDataObj} /> },
    { key: 'Congress', component: <LocationAnalyzer featureData={congress.features} fields={[{ key: 'NAME', label: 'Congressperson' }]} featureType="Congressperson" userLocationDataObj={userLocationDataObj} /> },
    { key: 'DeviceLocation', component: <UserLocationInfo userLocationDataObj={userLocationDataObj} /> }
    
  ];

  const handleCardVisibilityChange = (key) => {
    setCardVisibility(prevState => ({
      ...prevState,
      [key]: { ...prevState[key], visible: !prevState[key].visible }
    }));
  };

  return (
    <div className="container">
      <header className="header">
        <h1 className="h1">The Municipal Where</h1>
        <h4 className="h4">One Location, Many Layers of Governance</h4>
      </header>
      <hr className="divider" />
      <main className="scrollViewContent">
        <div className="cardsContainer">
          {cardsConfig.map(
            (card) =>
              cardVisibility[card.key].visible && (
                <div key={card.key}>
                  {card.component}
                </div>
              )
          )}
          <hr className="divider" />
        </div>
        <h4 className="h4">©2024 The Municipal Where</h4>
      </main>

      <footer className="footer">
        <button
          className="toggleButton"
          onClick={() => setIsModalOpen(true)}
        >
          Toggle Card Visibility
        </button>
      </footer>

      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog as="div" className="modal-overlay" open={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <div className="modal-content" aria-hidden="true" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="modalContent">
              <Dialog.Title as="h3" className="modalTitle">
                Card Visibility Settings
              </Dialog.Title>
              <div className="mt-4">
                {Object.keys(cardVisibility).map((key) => (
                  <div className="flex items-center mb-2" key={key}>
                    <input
                      type="checkbox"
                      id={`toggle-${key}`}
                      checked={cardVisibility[key].visible}
                      onChange={() => handleCardVisibilityChange(key)}
                      style={{ marginRight: '10px' }}
                    />
                    <label htmlFor={`toggle-${key}`}>{cardVisibility[key].label}</label>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  className="closeButton"
                  onClick={() => setIsModalOpen(false)}
                >
                  Close
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}

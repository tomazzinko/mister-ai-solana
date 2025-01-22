import React, { useState } from 'react';
import './App.css';
import Map from './components/Map';

function App() {
  const [currentLocation, setCurrentLocation] = useState(0);

  const handleCityClick = (cityId: number) => {
    setCurrentLocation(cityId);
  };

  return (
    <div className="App">
      <h1>Find Mister AI</h1>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Map currentLocation={currentLocation} onCityClick={handleCityClick} />
      </div>
    </div>
  );
}

export default App;

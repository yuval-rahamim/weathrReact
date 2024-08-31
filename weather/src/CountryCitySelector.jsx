import React, { useState, useEffect } from 'react';
import MySelect from './MySelect';


function CountryCitySelector() {
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [weatherData, setWeatherData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch countries
    fetch("https://countriesnow.space/api/v0.1/countries/info?returns=flag")
      .then(response => response.json())
      .then(data => {
        const countryOptions = data.data.map(c => ({ value: c.name, label: c.name }));
        setCountries(countryOptions);
      })
      .catch(error => console.error("Error fetching countries:", error));
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      // Fetch cities based on selected country
      fetch(`https://countriesnow.space/api/v0.1/countries/cities/q?country=${selectedCountry}`)
        .then(response => response.json())
        .then(data => {
          const cityOptions = data.data.map(c => ({ value: c, label: c }));
          setCities(cityOptions);
        })
        .catch(error => console.error("Error fetching cities:", error));
    }
  }, [selectedCountry]);

  useEffect(() => {
    if (selectedCity && selectedCountry) {
      setLoading(true);

      // Fetch geolocation data
      fetch(`https://nominatim.openstreetmap.org/search.php?city=${selectedCity}&country=${selectedCountry}&format=jsonv2`)
        .then(response => response.json())
        .then(data => {
          if (data.length > 0) {
            const { lon, lat } = data[0];

            // Fetch weather data
            fetch(`https://www.7timer.info/bin/astro.php?lon=${lon}&lat=${lat}&ac=0&unit=metric&output=json&tzshift=0`)
              .then(response => response.json())
              .then(weather => {
                setWeatherData(weather.dataseries);
              })
              .catch(error => console.error("Error fetching weather data:", error))
              .finally(() => setLoading(false));
          }
        })
        .catch(error => {
          console.error("Error fetching geolocation data:", error);
          setLoading(false);
        });
    }
  }, [selectedCity, selectedCountry]);

  const handleCountryChange = (event) => {
    setSelectedCountry(event.target.value);
    setSelectedCity(''); // Reset city selection when country changes
  };

  const handleCityChange = (event) => {
    setSelectedCity(event.target.value);
  };

  const createWeather = (weather) => {
    return weather.map((w, index) => (
      <div key={index} className="weather-item">
        <h3>+{w.timepoint}hrs</h3>
        <img src={getWeatherIcon(w)} alt="Weather icon" />
        <h2>{w.temp2m}°</h2>
      </div>
    ));
  };

  const getWeatherIcon = (w) => {
    if (w.prec_type === 'rain') {
      return "/downpour-rainy-day-16531.png";
    } else if (w.prec_type === 'snow') {
      return "/snowfall-and-blue-cloud-16541.png";
    } else if (w.prec_type === 'none') {
      if (w.cloudcover < 20) {
        return "/yellow-sun-16526.png";
      } else if (w.cloudcover < 80) {
        return "/yellow-sun-and-blue-cloud-16528.png";
      } else {
        return "/blue-cloud-and-weather-16527.png";
      }
    } else if (w.lifted_index <= -6) {
      if (w.prec_amount < 4) {
        return "/cloud-and-yellow-lightning-16534.png";
      } else {
        return "/lightning-and-blue-rain-cloud-16533.png";
      }
    }
    return "/default-weather-icon.png"; // Default icon
  };

  return (
    <div>
      <div id='top'>
        <MySelect
          selectText="Countries"
          selectId="Country"
          onChange={handleCountryChange}
          options={countries}
        />
        <MySelect
          selectText="Cities"
          selectId="City"
          onChange={handleCityChange}
          options={cities}
          disabled={!selectedCountry} // Disable city selector if no country is selected
        />
        </div>
      <h1>{selectedCountry && selectedCity ? `${selectedCountry} - ${selectedCity}` : 'Select a country and city'}</h1>
      {loading ? <p>Loading...</p> : (
        <div className="weather-container">
          {createWeather(weatherData)}
        </div>
      )}
    </div>
  );
}

export default CountryCitySelector;

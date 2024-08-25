import React from 'react';

const WeatherDisplay = ({ weatherData, loading }) => {
    const getCloudCover = (w) => {
        switch (w.cloudcover) {
            case 1: return 6;
            case 2: return 19;
            case 3: return 31;
            case 4: return 44;
            case 5: return 56;
            case 6: return 69;
            case 7: return 81;
            case 8: return 94;
            case 9: return 100;
            default: return 0;
        }
    };

    const renderWeather = () => {
        return weatherData.map((w, index) => {
            let weatherIcon = "";
            const cloudCover = getCloudCover(w);
            switch (w.prec_type) {
                case "rain":
                    weatherIcon = "public/downpour-rainy-day-16531.png";
                    break;
                case "snow":
                    weatherIcon = "public/snowfall-and-blue-cloud-16541.png";
                    break;
                case "none":
                    weatherIcon = cloudCover < 20 ? "public/yellow-sun-16526.png"
                        : cloudCover < 80 ? "public/yellow-sun-and-blue-cloud-16528.png"
                        : "public/blue-cloud-and-weather-16527.png";
                    break;
                default:
                    weatherIcon = "";
            }
            if (w.lifted_index <= -6) {
                weatherIcon = w.prec_amount < 4 ? "public/cloud-and-yellow-lightning-16534.png" : "public/lightning-and-blue-rain-cloud-16533.png";
            }

            return (
                <div key={index} id="ho">
                    <h3>+{w.timepoint}hrs</h3>
                    <img src={weatherIcon} alt="Weather Icon" />
                    <h2>{w.temp2m}°</h2>
                </div>
            );
        });
    };

    return (
        <div id="cool">
            {loading ? <p>Loading...</p> : renderWeather()}
        </div>
    );
};

export default WeatherDisplay;
import React, { useState, useEffect } from 'react';
import api from '../apikey';
const WeatherUi = () => {
    const [loading, setLoading] = useState(true);
    const [weatherData, setWeatherData] = useState(null);
    const [search, setSearch] = useState(null);

    const handleInputChange = (e) => {
        setSearch(e.target.value);
    };

    const handleGetWeather = async () => {
        try {
            const URL = `${api.base}?q=${search || 'Surat'}&units=metric&appid=${api.key}`;
            const response = await fetch(URL);
            const data = await response.json();
            setWeatherData({
                humidity: data.main.humidity,
                temperature: Math.floor(data.main.temp),
                windSpeed: data.wind.speed,
                location: data.name,
                icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
            });
        } catch(err){
            if(err){
                setWeatherData(null);
                console.error("wrong name entered....");
            }
        }
    }

    useEffect(() => {
        const fetchWeatherData = async (lat, lon) => {
            try {
                const URL = `${api.base}?lat=${lat}&lon=${lon}&units=metric&appid=${api.key}`;
                const result = await fetch(URL);
                const data = await result.json();
                setWeatherData({
                    humidity: data.main.humidity,
                    temperature: Math.floor(data.main.temp),
                    windSpeed: data.wind.speed,
                    location: data.name,
                    icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
                });
                console.log("Weather Data : ", data);
            } catch (err){
                console.error("Error fetching weather data....", err);
            }
        }

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLoading(false);
                    console.log('User location:', position);
                    let lat = position.coords.latitude;
                    let lon = position.coords.longitude;
                    fetchWeatherData(lat, lon);
                },
                (error) => {
                    handleGetWeather();
                    setLoading(false);
                    console.error('Geolocation error:', error);
                }
            );
        }
    }, []);

    return (
        <div className="h-screen bg-weather flex items-center justify-center">
            <div className="backdrop-blur-lg bg-white/20 border border-white/30 rounded-lg shadow-2xl p-6 text-center glass-card relative z-10">
                {loading ? (
                    <div className="flex flex-col items-center justify-center">
                        <img
                            src="/WeatherIcons.gif"
                            alt="Loading..."
                            className="mb-4"
                        />
                        <p className="text-white text-lg">Please Give Access To know your weather</p>
                    </div>
                ) : (
                    <div>
                        <h2 className="text-white text-5xl font-semibold mb-10">
                            Weather Info
                        </h2>
                        
                        <form>
                            <div className='flex justify-center'>
                                <div className='w-8/12'>
                                    <div className='flex rounded-md overflow-hidden'>
                                        <input type="text" className='focus:outline-none p-2 pl-5 w-full backdrop-blur-lg bg-white/40 shadow-lg text-lg text-white placeholder:text-gray-200' required onChange={handleInputChange} placeholder='Please Enter City Name to Check weather ......' />
                                        <button className='px-6 py-4 bg-teal-600 text-white font-semibold focus:outline-none focus:bg-teal-700' onClick={handleGetWeather} type='button'>Search</button>
                                    </div>
                                </div>
                            </div>
                        </form>

                        <div className="mt-5">
                            <div className="flex flex-col items-center">
                                {weatherData ? (
                                    <>
                                        {weatherData.icon && (
                                            <img src={weatherData.icon} alt="Weather Icon" className="w-20 h-20" />
                                        )}
                                        <h3 className="text-4xl text-white font-bold">{weatherData.location}</h3>
                                        <p className="text-6xl text-white font-light my-4">{weatherData.temperature}°C</p>
                                        <div className="text-white text-lg">
                                            <p>Humidity: {weatherData.humidity}%</p>
                                            <p>Wind Speed: {weatherData.windSpeed} m/s</p>
                                        </div>
                                    </>
                                ) : (
                                    <div>
                                        <h1 className='text-white text-5xl'>Loading.......</h1>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WeatherUi;
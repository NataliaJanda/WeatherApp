import React, { useState, useEffect } from "react";
import axios from 'axios';
import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography} from "@mui/material";
import { faCloud, faSun, faCloudRain, faSnowflake, faCloudSun, faWind } from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

function WeatherTable() {

    const [weatherData, setWeatherData] = useState(null);
    const [location, setLocation] = useState({ latitude: null, longitude: null });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getLocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const { latitude, longitude } = position.coords;
                        if (
                            latitude >= -90 && latitude <= 90 &&
                            longitude >= -180 && longitude <= 180
                        ) {
                            setLocation({ latitude, longitude });
                        } else {
                            console.warn("Nieprawidłowe współrzędne, ustawiam domyślne wartości.");
                            setLocation({ latitude: 50.0413, longitude: 21.999 });
                        }
                    },
                    (error) => {
                        console.error("Nie można pobrać lokalizacji:", error);
                        setLocation({ latitude: 50.0413, longitude: 21.999 });
                    }
                );
            } else {
                console.error("Geolokalizacja nie jest wspierana przez tę przeglądarkę.");
                setLocation({ latitude: 50.0413, longitude: 21.999 });
            }
        };

        getLocation();
    }, []);

    useEffect(() => {
        const fetchWeatherData = async () => {
            if (location.latitude && location.longitude) {
                setLoading(true);
                try {
                    const response = await axios.get(`http://localhost:8080/weather`, {
                        params: {
                            latitude: parseFloat(location.latitude.toFixed(6)),
                            longitude: parseFloat(location.longitude.toFixed(6))
                        },
                    });
                    setWeatherData(response.data);
                } catch (error) {
                    console.error("Błąd przy pobieraniu danych pogodowych:", error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchWeatherData();
    }, [location]);

    if (loading) {
        return <Typography variant="body1">Ładowanie danych pogodowych...</Typography>;
    }

    if (!weatherData || !weatherData.daily) {
        return <Typography variant="body1">Brak danych pogodowych do wyświetlenia.</Typography>;
    }

    const getWeatherIcon = (weatherCode) => {
        switch (weatherCode) {
            case 1:
                return faSun;
            case 2:
                return faCloudSun;
            case 3:
                return faCloud;
            case 51:
                return faCloudRain;
            case 53:
                return faCloudRain;
            case 71:
                return faSnowflake;
            case 73:
                return faSnowflake;
            case 5:
                return faWind;
            default:
                return faCloud;
        }
    };
    if (!weatherData || !weatherData.daily) {
        return <Typography variant="body1">Ładowanie danych pogodowych...</Typography>;
    }

return(
    <>
    <Typography textAlign="center" variant="body1" sx={{mb:5}}>Dane pogodowe:</Typography>
    <TableContainer component={Paper} sx={{}}>
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>Dzień</TableCell>
                    <TableCell>Ikona Pogody</TableCell>
                    <TableCell>Energia (kWh)</TableCell>
                    <TableCell>Temperatura Max (°C)</TableCell>
                    <TableCell>Temperatura Min (°C)</TableCell>
                    <TableCell>Czas nasłonecznienia (h)</TableCell>
                    <TableCell>Opady (mm)</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {weatherData.daily.time.map((date, index) => (
                    <TableRow key={index}>
                        <TableCell>{date}</TableCell>
                        <TableCell><FontAwesomeIcon icon={getWeatherIcon(weatherData.daily.weather_code[index])} />
                        </TableCell>
                        <TableCell>{weatherData.daily.estimationGeneratedEnergy[index]}</TableCell>
                        <TableCell>{weatherData.daily.temperature_2m_max[index]}</TableCell>
                        <TableCell>{weatherData.daily.temperature_2m_min[index]}</TableCell>
                        <TableCell>{parseFloat(((weatherData.daily.sunshine_duration[index])/60)/60).toFixed(2)}</TableCell>
                        <TableCell>{parseFloat(weatherData.daily.rain_sum[index])}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </TableContainer>
    </>
)
}
export default WeatherTable;
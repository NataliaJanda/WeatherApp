import React, {useEffect,useState} from "react";
import { Box, Container, Typography } from "@mui/material";
import { styled } from "@mui/system";
import axios from "axios";

const FooterContainer = styled(Box)(({ theme }) => ({
    padding: theme.spacing(4, 0),
    borderTop: "1px solid #e0e0e0",
    position: "relative",
    bottom: 0,
    width: "100%",
}));

const Footer = () => {
    const [weeklyData, setWeeklyData] = useState([]);
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
        const fetchWeeklyData = async () => {
            if (location.latitude && location.longitude) {
                setLoading(true);
            try {
                const response = await axios.get(`https://weatherapp-3-c1iu.onrender.com/WeeklySummary`, {
                    params: {
                        latitude: parseFloat(location.latitude.toFixed(6)),
                        longitude: parseFloat(location.longitude.toFixed(6))
                    },
                });
                setWeeklyData(response.data);
            } catch (error) {
                console.error("Błąd przy pobieraniu danych pogodowych:", error);
            } finally {
                setLoading(false);
            }
        };
        }
        fetchWeeklyData();
    }, [location]);
    if (loading) {
        return <Typography variant="body1">Ładowanie danych pogodowych...</Typography>;
    }

    if (!weeklyData) {
        return <Typography variant="body1">Brak danych pogodowych do wyświetlenia.</Typography>;
    }
    return (
        <FooterContainer component="footer">
            <Container maxWidth="lg" >
                <Box textAlign="center" mb={3}>
                    <Typography variant="h6" gutterBottom>
                        Podsumowania całego tygodnia
                    </Typography>
                </Box>
                    <Box textAlign="center">
                        <Typography variant="body1"> <strong>Średnie ciśnienie: </strong>{parseFloat(weeklyData.averagePressure).toFixed(2)}</Typography>
                        <Typography variant="body1"><strong>Średni czas ekspozycji na słońce: </strong>{parseFloat(((weeklyData.averageSunshineDuration)/60)).toFixed(2)} minut</Typography>
                        <Typography variant="body1"><strong>Najmniejsza temperatura w ciągu tygodnia: </strong>{parseFloat(weeklyData.minWeeklyTemp).toFixed(1)} °C</Typography>
                        <Typography variant="body1"><strong>Największa temperatura w ciągu tygodnia: </strong>{parseFloat((weeklyData.maxWeeklyTemp)).toFixed(1)} °C</Typography>
                        <Typography variant="body1"><strong>Jest to tydzień </strong>{(weeklyData.description)}</Typography>
                    </Box>
            </Container>
        </FooterContainer>
    );
};

export default Footer;
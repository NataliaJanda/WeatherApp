import WeatherTable from "./components/Table";
import React, { useState } from 'react';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { Button } from '@mui/material';
import Footer from "./components/Footer";

function App() {
    const [darkMode, setDarkMode] = useState(false);

    const theme = createTheme({
        palette: {
            mode: darkMode ? 'dark' : 'light',
        },
    });

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
                <Button onClick={() => setDarkMode(!darkMode)}>
                    Przełącz na {darkMode ? 'Jasny' : 'Ciemny'} Tryb
                </Button>
                <div>
                    <WeatherTable/>
                    <Footer/>
                </div>
        </ThemeProvider>
    );
}

export default App;

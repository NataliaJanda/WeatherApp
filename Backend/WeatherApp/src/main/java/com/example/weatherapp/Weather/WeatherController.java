package com.example.weatherapp.Weather;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class WeatherController {

    private final MeteoService meteoService;

    public WeatherController(MeteoService meteoService) {
        this.meteoService = meteoService;
    }

    @GetMapping("/weather")
    public WeatherResponse getWeather(@RequestParam double latitude, @RequestParam double longitude) {
        return meteoService.getWeatherForecast(latitude, longitude);
    }

    @GetMapping("/WeeklySummary")
    public WeeklyResponse getSummary(@RequestParam double latitude, @RequestParam double longitude){
        return meteoService.getWeeklySummary(latitude, longitude);
    }
}

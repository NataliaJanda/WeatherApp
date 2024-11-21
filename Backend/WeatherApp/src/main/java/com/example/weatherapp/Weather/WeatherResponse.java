package com.example.weatherapp.Weather;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class WeatherResponse {
    @JsonProperty("daily")
    private DailyData dailyData;

    @JsonProperty("hourly")
    private HourlyData hourlyData;
    @Getter
    @Setter
    public static class HourlyData{
        @JsonProperty("surface_pressure")
        private List<Double> pressure;
    }
    @Getter
    @Setter
    public static class DailyData{
        @JsonProperty("time")
        private List<String> time;
        @JsonProperty("weather_code")
        private List<Integer> weatherCode;
        @JsonProperty("temperature_2m_max")
        private List<Double> temperatureMax;
        @JsonProperty("temperature_2m_min")
        private List<Double> temperatureMin;
        @JsonProperty("sunshine_duration")
        private List<Double> sunshineDuration;
        @JsonProperty("rain_sum")
        private List<Double> rainSum;
        private List<Integer> estimationGeneratedEnergy= new ArrayList<>();;
    }
}

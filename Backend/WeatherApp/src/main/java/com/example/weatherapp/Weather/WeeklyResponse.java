package com.example.weatherapp.Weather;

import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class WeeklyResponse {

    private double AveragePressure;
    private double AverageSunshineDuration;
    private double MaxWeeklyTemp;
    private double MinWeeklyTemp;
    private String Description;
}

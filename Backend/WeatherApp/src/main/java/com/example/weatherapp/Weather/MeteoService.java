package com.example.weatherapp.Weather;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Locale;

@Service
public class MeteoService {
    private final String endpointUrl = "https://api.open-meteo.com/v1/forecast";

    public WeatherResponse getWeatherForecast(double latitude, double longitude){
        if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
            throw new IllegalArgumentException("Poza zakresem");
        }
        String url = String.format(
                Locale.US, //bez użyciu Locale wyrzuca błędy związane ze złym formatowaniem podawanych liczb (, zamiast .)
                "%s?latitude=%.6f&longitude=%.6f&daily=weather_code,temperature_2m_max,temperature_2m_min,sunshine_duration,rain_sum&timezone=Europe/Berlin",
                endpointUrl, latitude, longitude
        );
        System.out.println(url);
        RestTemplate restTemplate = new RestTemplate();
        WeatherResponse weatherResponse = restTemplate.getForObject(url, WeatherResponse.class);
        if(weatherResponse != null && weatherResponse.getDailyData() != null){
            List<Double> sunshineDuration = weatherResponse.getDailyData().getSunshineDuration();
            List<Integer> estimationGeneratedEnergy = weatherResponse.getDailyData().getEstimationGeneratedEnergy();

            double panelPower = 2.5;
            double panelEfficiency = 0.2;
            for(int i=0; i < sunshineDuration.size(); i++){
                double hoursOfSunshine = sunshineDuration.get(i);
                int generatedEnergy = (int)(panelPower * panelEfficiency * hoursOfSunshine);
                estimationGeneratedEnergy.add(generatedEnergy);
            }
        }
        return weatherResponse;
    }
    public WeeklyResponse getWeeklySummary(double latitude, double longitude) {
        if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
            throw new IllegalArgumentException("Poza zakresem");
        }
        String url = String.format(
                Locale.US,
                "%s?latitude=%.6f&longitude=%.6f&hourly=surface_pressure&daily=weather_code,temperature_2m_max,temperature_2m_min,sunshine_duration,rain_sum&timezone=Europe/Berlin",
                endpointUrl,latitude, longitude
        );
        RestTemplate restTemplate = new RestTemplate();
        WeeklyResponse weeklyResponse = restTemplate.getForObject(url, WeeklyResponse.class);
        WeatherResponse weatherResponse = restTemplate.getForObject(url, WeatherResponse.class);

        if(weatherResponse != null && weeklyResponse != null) {
            List<Double> sunshineDurationList = weatherResponse.getDailyData().getSunshineDuration();
            List<Double> MaxWeeklyTempList = weatherResponse.getDailyData().getTemperatureMax();
            List<Double> MinWeeklyTempList = weatherResponse.getDailyData().getTemperatureMin();
            List<Double> SumRain = weatherResponse.getDailyData().getRainSum();
            List<Double> pressureList = weatherResponse.getHourlyData().getPressure();

            double averagePressure=0;
            for(int k=0; k< pressureList.size();k++){
                averagePressure += pressureList.get(k);
            }

            weeklyResponse.setAveragePressure(averagePressure/pressureList.size());
            double SumDuration=0;
            double MaxTemp=0;
            double MinTemp=0;
            int countRainingDay=0;

            int size = sunshineDurationList.size();

            if (size != MaxWeeklyTempList.size() || size != MinWeeklyTempList.size() || size != SumRain.size()) {
                throw new IllegalStateException("Długości list są różne.");
            }
            for(int i=0; i < size; i++){
                SumDuration += sunshineDurationList.get(i).doubleValue();
                double MaxTempV = MaxWeeklyTempList.get(i).doubleValue();
                double MinTempV = MinWeeklyTempList.get(i).doubleValue();
                if(MaxTemp<MaxTempV) MaxTemp=MaxTempV;
                if(MinTemp>MinTempV) MinTemp=MinTempV;

                float DailySumRain = SumRain.get(i).floatValue();
                if (DailySumRain != 0.00) ++countRainingDay;

            }
            if(countRainingDay>=4){
                weeklyResponse.setDescription("z opadami");
            }
            else weeklyResponse.setDescription("bez opadów");

            double sunshineDuration =SumDuration/7;
            weeklyResponse.setMaxWeeklyTemp(MaxTemp);
            weeklyResponse.setMinWeeklyTemp(MinTemp);
            weeklyResponse.setAverageSunshineDuration(sunshineDuration);
        }

            return weeklyResponse;
    }
}
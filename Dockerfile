# Główny Dockerfile
FROM eclipse-temurin:17-jdk-jammy AS backend-build
WORKDIR /Backend
COPY Backend/WeatherApp .
RUN chmod +x ./gradlew
RUN ./gradlew build -x test

FROM node:18 AS frontend-build
WORKDIR /Frontend
COPY Frontend/weather-app/package*.json ./
RUN npm install
COPY Frontend/weather-app .
RUN npm run build

FROM eclipse-temurin:17-jre-jammy AS final
WORKDIR /app
# Kopiowanie aplikacji backendu
COPY --from=backend-build /Backend/WeatherApp/target/*.jar app.jar
# Kopiowanie aplikacji frontendowej jako statycznych plików
COPY --from=frontend-build /Frontend/weather-app/build /app/public
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]


FROM eclipse-temurin:17-jdk-jammy AS backend-build
WORKDIR /app/backend
COPY Backend/WeatherApp .
RUN chmod +x ./gradlew
RUN ./gradlew build -x test

FROM node:18 AS frontend-build
WORKDIR /app/frontend
COPY Frontend/weather-app/package*.json ./
RUN npm install
COPY Frontend/weather-app .
RUN npm run build

FROM eclipse-temurin:17-jre-jammy AS final
WORKDIR /app
COPY --from=backend-build /app/backend/build/libs/*.jar app.jar
COPY --from=frontend-build /app/frontend/build ./public
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]

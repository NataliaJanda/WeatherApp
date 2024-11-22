# Główny Dockerfile
FROM eclipse-temurin:17-jdk-jammy AS backend-build
WORKDIR /backend
COPY backend ./
RUN ./mvnw package -DskipTests

FROM node:18 AS frontend-build
WORKDIR /frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend ./
RUN npm run build

FROM eclipse-temurin:17-jre-jammy AS final
WORKDIR /app
# Kopiowanie aplikacji backendu
COPY --from=backend-build /backend/target/*.jar app.jar
# Kopiowanie aplikacji frontendowej jako statycznych plików
COPY --from=frontend-build /frontend/build /app/public
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]


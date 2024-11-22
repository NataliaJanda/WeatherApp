# Główny Dockerfile
FROM eclipse-temurin:17-jdk-jammy AS backend-build
WORKDIR /Backend
COPY Backend ./
RUN ./mvnw package -DskipTests

FROM node:18 AS frontend-build
WORKDIR /Frontend
COPY Frontend/package*.json ./
RUN npm install
COPY Frontend ./
RUN npm run build

FROM eclipse-temurin:17-jre-jammy AS final
WORKDIR /app
# Kopiowanie aplikacji backendu
COPY --from=backend-build /Backend/target/*.jar app.jar
# Kopiowanie aplikacji frontendowej jako statycznych plików
COPY --from=frontend-build /Frontend/build /app/public
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]


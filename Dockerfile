# ---- Build Stage ----
FROM maven:3.9.4-eclipse-temurin-17 AS build

WORKDIR /app

# Copy only backend code to the container
COPY backend /app

# Build the Spring Boot app
RUN mvn clean package -DskipTests

# ---- Runtime Stage ----
FROM eclipse-temurin:17-jre

WORKDIR /app

# Copy the built jar from the build stage
COPY --from=build /app/target/*.jar app.jar

# Expose the port (Spring Boot default)
EXPOSE 8080

# Run the jar
CMD ["java", "-jar", "app.jar"]

FROM eclipse-temurin:21-jdk-alpine AS builder
WORKDIR /app

COPY gradlew .
COPY gradle gradle
COPY build.gradle .
COPY settings.gradle .
RUN chmod +x gradlew

COPY server/gateway/build.gradle server/gateway/
RUN ./gradlew :server:gateway:dependencies --no-daemon
COPY server/gateway/src server/gateway/src
RUN ./gradlew :server:gateway:clean :server:gateway:build -x test --no-daemon

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=builder /app/server/gateway/build/libs/*.jar app.jar
EXPOSE 8000

ENTRYPOINT ["java","-jar","app.jar"]

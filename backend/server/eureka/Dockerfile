FROM eclipse-temurin:21-jdk-jammy AS builder
WORKDIR /app

COPY gradlew .
COPY gradle gradle
COPY build.gradle .
COPY settings.gradle .
RUN chmod +x gradlew

COPY server/eureka/build.gradle server/eureka/
RUN ./gradlew :server:eureka:dependencies --no-daemon
COPY server/eureka/src server/eureka/src
RUN ./gradlew :server:eureka:clean :server:eureka:build -x test --no-daemon

FROM eclipse-temurin:21-jre-jammy
WORKDIR /app
RUN apt-get update && \
    apt-get install -y curl && \
    rm -rf /var/lib/apt/lists/*
COPY --from=builder /app/server/eureka/build/libs/*.jar app.jar
EXPOSE 8761

ENTRYPOINT ["java","-jar","app.jar"]

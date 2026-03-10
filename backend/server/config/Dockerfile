FROM eclipse-temurin:21-jdk-jammy AS builder
WORKDIR /app

COPY gradlew .
COPY gradle gradle
COPY build.gradle .
COPY settings.gradle .
RUN chmod +x gradlew

COPY server/config/build.gradle server/config/
RUN ./gradlew :server:config:dependencies --no-daemon
COPY server/config/src server/config/src
RUN ./gradlew :server:config:clean :server:config:build -x test --no-daemon

FROM eclipse-temurin:21-jre-jammy
WORKDIR /app

RUN apt-get update && \
    apt-get install -y curl && \
    rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/server/config/build/libs/*.jar app.jar
EXPOSE 8888

ENTRYPOINT ["java","-jar","app.jar"]

# 1. 빌드 스테이지
FROM eclipse-temurin:21-jdk-jammy AS builder
WORKDIR /app

# 루트 설정 파일 복사
COPY gradlew .
COPY gradle gradle
COPY build.gradle .
COPY settings.gradle .
RUN chmod +x gradlew

# 모듈 build.gradle 복사
COPY common/build.gradle common/
COPY service/studyGroup/build.gradle service/studyGroup/

# 의존성 캐싱
RUN ./gradlew :service:studyGroup:dependencies --no-daemon

# 소스 복사
COPY common/src common/src
COPY service/studyGroup/src service/studyGroup/src

# 빌드 수행
RUN ./gradlew :service:studyGroup:clean :service:studyGroup:build -x test --no-daemon

# 2. 실행 스테이지
FROM eclipse-temurin:21-jre-jammy
RUN apt-get update && \
    apt-get install -y curl && \
    rm -rf /var/lib/apt/lists/*
WORKDIR /app

COPY --from=builder /app/service/studyGroup/build/libs/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
# 1. 빌드 스테이지
FROM eclipse-temurin:21-jdk-jammy AS builder
WORKDIR /app

# 루트 설정 파일 복사
COPY gradlew .
COPY gradle gradle
COPY build.gradle .
COPY settings.gradle .
RUN chmod +x gradlew

# 각 모듈의 build.gradle 복사 (계층 구조 유지)
COPY common/snowFlake/build.gradle common/snowFlake/
COPY service/board/build.gradle service/board/

# 의존성 다운로드 (캐싱 활용)
RUN ./gradlew :service:board:dependencies --no-daemon

# [핵심 수정] 실제 존재하는 소스 폴더만 정확히 복사
# common 바로 밑에는 src가 없으므로 snowFlake의 src만 가져옵니다.
COPY common/snowFlake/src common/snowFlake/src
COPY service/board/src service/board/src

# 빌드 수행
RUN ./gradlew :service:board:clean :service:board:build -x test --no-daemon

# 2. 실행 스테이지
FROM eclipse-temurin:21-jre-jammy
RUN apt-get update && \
    apt-get install -y curl && \
    rm -rf /var/lib/apt/lists/*
WORKDIR /app

# 실행 가능한 jar 파일만 복사
COPY --from=builder /app/service/board/build/libs/*.jar app.jar

EXPOSE 8081

ENTRYPOINT ["java", "-jar", "app.jar"]
# StudiOn

> 실시간 화상 스터디 플랫폼

**StudiOn**은 스터디 그룹을 만들고 함께 공부할 수 있는 실시간 협업 플랫폼입니다.  
WebRTC 기반 화상 통화, 실시간 채팅, 공부시간 기록 및 랭킹 등 다양한 기능을 제공합니다.


## 팀원

| 이름   | 역할     |
|  | -- |
| 지성현 | Backend  |
| 최용원 | Frontend |


## 주요 기능

### 스터디룸

- WebRTC 기반 실시간 화상 통화 (최대 4명)
- 실시간 그룹 채팅
- 공개/비공개 방 생성 및 초대코드 공유
- 브라우저 종료 시 자동 퇴장 처리
- 공부시간 자동 측정 및 기록

### 채팅

- 1대1 실시간 채팅 (WebSocket + STOMP)
- 그룹 실시간 채팅 (WebSocket + STOMP + Redis Pub/Sub)

### 게시판

- 게시글 CRUD / 카테고리 / 페이지네이션
- 조회수 / 좋아요 / 댓글 (무한 댓글 지원)
- 조회수 / 좋아요 기반 인기 게시글 랭킹

### 랭킹

- 공부시간 기반 유저 랭킹
- 날짜별 공부 잔디 (GitHub 잔디 형태)
- 게시글 조회수 / 좋아요 랭킹

### 알림

- SSE 기반 실시간 알림
- 댓글 알림 / 채팅 알림 / 스터디룸 초대 알림

### 회원

- JWT 기반 인증 (AccessToken + RefreshToken)
- 회원가입 / 로그인 / 정보 수정 / 회원 탈퇴

### 관리자

- 유저 강제 탈퇴
- 게시글 / 댓글 / 방 강제 삭제



## 기술 스택

### Backend

| 기술                     | 버전      | 용도                           |
|  |  |  |
| Java                     | 21        | 언어                           |
| Spring Boot              | 3.5.6     | 마이크로서비스 구현            |
| Spring Cloud             | 2025.0.0  | Cloud 공통                     |
| Spring Cloud Gateway     | -         | API Gateway                    |
| Spring Cloud Eureka      | -         | 서비스 디스커버리              |
| Spring Cloud Config      | -         | 중앙화 설정 관리               |
| Spring Cloud OpenFeign   | -         | 서비스 간 통신                 |
| Spring Data JPA          | -         | ORM / 데이터 접근              |
| Spring Security          | -         | 인증 / 인가                    |
| JWT (jjwt)               | 0.12.6    | 토큰 기반 인증                 |
| Spring WebSocket + STOMP | -         | 실시간 채팅                    |
| Spring SSE               | -         | 실시간 알림                    |
| Springdoc OpenAPI        | 2.8.8     | Swagger UI                     |
| MySQL                    | 8.0       | 영구 데이터 저장               |
| Redis                    | 7.2       | 캐싱 / 실시간 데이터 / Pub/Sub |
| Apache Kafka             | 7.5.0     | 비동기 이벤트 처리             |

### Frontend

| 기술               | 버전   | 용도                    |
|  |  | -- |
| React              | 19.2.0 | UI 구현                 |
| TypeScript         | -      | 타입 안정성             |
| Vite               | -      | 빌드 도구               |
| Tailwind CSS       | -      | 스타일링                |
| Zustand            | 5.0.8  | 전역 상태 관리          |
| Formik             | 2.4.9  | 폼 관리                 |
| Yup                | 1.7.1  | 유효성 검사             |
| STOMP.js           | 7.0.0  | WebSocket 채팅          |
| WebRTC             | -      | 화상 통화               |
| Axios              | 1.13.1 | HTTP 통신               |
| MSW                | -      | API Mocking (개발 환경) |
| Vitest             | 4.0.16 | 단위 테스트             |

### Infra

| 기술                    | 버전 | 용도          |
| -- | - | - |
| Docker + Docker Compose | -    | 컨테이너 환경 |
| nginx                   | -    | 리버스 프록시 |



## 시스템 아키텍처

```
[Browser]
    ↓ HTTP / WebSocket
[nginx :8167]  ← 리버스 프록시
    ↓
[Spring Cloud Gateway :8000]  ← 인증 / 라우팅
    ↓
[Spring Cloud Eureka :8761]  ← 서비스 디스커버리
    ↓
┌───────────────────────────────────────────────────────────────┐
│  user-service    │  board-service   │  comment-service        │
│  chat-service    │  groupChat-service  │  room-service        │
│  alarm-service                                                │
└───────────────────────────────────────────────────────────────┘
        ↓                  ↓                   ↓
     [MySQL]            [Redis]             [Kafka]
   영구 데이터 저장       캐싱 / Pub/Sub        비동기 이벤트
```



## 프로젝트 구조

```
StudiOn/
├── backend/
│   ├── server/
│   │   ├── eureka/          # 서비스 디스커버리
│   │   ├── config-server/   # 중앙화 설정 서버
│   │   └── gateway/         # API Gateway / 인증
│   ├── service/
│   │   ├── user/            # 회원 / 공부시간 랭킹
│   │   ├── board/           # 게시판 / 게시글 랭킹
│   │   ├── comment/         # 댓글
│   │   ├── chat/            # 1대1 채팅
│   │   ├── groupChat/       # 그룹 채팅
│   │   ├── room/            # 스터디룸 / WebRTC
│   │   └── alarm/           # 실시간 알림
│   └── common/              # 공통 모듈
└── frontend/
    └── src/
        ├── components/      # 재사용 컴포넌트
        ├── pages/           # 페이지 컴포넌트
        ├── hooks/           # 커스텀 훅
        ├── services/        # API 서비스
        ├── store/           # Zustand 전역 상태 관리
        ├── types/           # TypeScript 타입 정의
        ├── schemas/         # Yup 유효성 검사 스키마
        ├── router/          # 라우터 설정
        ├── mocks/           # MSW API Mocking
        ├── styles/          # 스타일
        ├── utils/           # 유틸리티
        └── test/            # 백엔드 API 테스트 페이지
```



## 실행 방법

### 사전 요구사항

- Docker Desktop 설치
- Docker Compose 설치

### 실행

**백엔드**

```bash
cd backend
docker compose up -d --build
```

**프론트엔드**

```bash
cd frontend
docker compose up -d --build
```

### 서비스 접속

| 서비스           | URL                                   |
| - | - |
| 프론트엔드       | http://localhost:8167                 |
| Swagger UI       | http://localhost:8000/swagger-ui.html |
| Eureka Dashboard | http://localhost:8761                 |

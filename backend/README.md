# Backend

---
## 서비스 구성

### 공통 모듈 (common)
- **Snowflake ID** 생성 (분산 환경 고유 ID)
- **KafkaProducer** (ObjectMapper로 String JSON 직렬화)
- **FeignRequestInterceptor** (X-User-ID, X-User-Role 헤더 자동 전달)
- **SecurityUtil** (HttpServletRequest 헤더에서 userId, nickName, role 추출)
- **GlobalExceptionHandler** + ErrorCode + CustomException
- **Kafka 이벤트**: AlarmEvent, StudyTimeEvent, BoardDeleteEvent, CommentCreatedEvent, CommentDeletedEvent

---

### user-service
**주요 기능**
- 회원가입 / 로그인 / 로그아웃 / 회원 정보 수정 / 회원 탈퇴
- JWT AccessToken + RefreshToken (Redis 저장)
- 토큰 재발급 (reissue)
- 공부시간 랭킹 (Redis Sorted Set)
- 날짜별 공부 잔디

**공부시간 처리 흐름**
```
room-service → Kafka "study.time" 발행
    ↓
user-service Consumer
    ↓
UserEntity.studyTime 업데이트 (DB)
Redis Sorted Set "ranking:study" 업데이트
Redis "study:daily:{userId}:{date}" 업데이트
```

**관리자 기능**
- 전체 유저 조회 (isDeleted=false만)
- 유저 강제 탈퇴 (isDeleted=true 처리)

**API**
| Method | URL | 설명 |
|--------|-----|------|
| POST | /api/users/create | 회원가입 |
| POST | /api/users/login | 로그인 |
| POST | /api/users/logout | 로그아웃 |
| POST | /api/users/reissue | 토큰 재발급 |
| GET | /api/users/my-info | 내 정보 조회 |
| GET | /api/users/{userId} | 유저 조회 |
| PUT | /api/users/update | 정보 수정 |
| DELETE | /api/users/delete | 회원 탈퇴 |
| GET | /api/users/all-users | 전체 유저 조회 |
| GET | /api/users/ranking/study | 공부시간 랭킹 |
| GET | /api/users/ranking/study/my | 내 공부시간 순위 |
| GET | /api/users/study/daily | 날짜별 공부시간 (잔디) |
| DELETE | /api/users/admin/force/{userId} | 유저 강제 탈퇴 |

---

### board-service
**주요 기능**
- 게시글 CRUD / 페이지네이션 / 카테고리 필터링
- 조회수 / 좋아요 Redis 캐싱
- 조회수/좋아요 기반 랭킹 (NOTICE 카테고리 제외)
- 댓글 수 Redis 캐싱 (Kafka 연동)

**Redis 구조**
```
board:view:{boardId}       → 조회수
board:like:{boardId}       → 좋아요 수
board:like:set:{boardId}   → 좋아요한 유저 Set (중복 방지)
board:comment:count:{boardId} → 댓글 수
ranking:board:view         → 조회수 Sorted Set
ranking:board:like         → 좋아요 Sorted Set
```

**성능 비교 (테스트 결과)**

*조회수 동시성 (100개 동시 요청)*
| | DB 직접 | Redis |
|---|---|---|
| 정확도 | 8% | 100% |
| 속도 | 117ms | 10ms |

*랭킹 조회 속도 (100회 반복)*
| | DB 정렬 | Redis Sorted Set |
|---|---|---|
| 평균 응답 | ~50ms | ~3ms |

**스케줄러**
- `BoardCountInitializer`: 서버 시작 시 DB → Redis 복구
- `BoardCountSyncScheduler`: 1분마다 Redis → DB 동기화

**API**
| Method | URL | 설명 |
|--------|-----|------|
| POST | /api/boards/create | 게시글 작성 |
| GET | /api/boards/{boardId} | 게시글 조회 |
| GET | /api/boards/list | 게시글 목록 |
| PUT | /api/boards/{boardId} | 게시글 수정 |
| DELETE | /api/boards/{boardId} | 게시글 삭제 |
| POST | /api/boards/{boardId}/like | 좋아요 |
| DELETE | /api/boards/{boardId}/like | 좋아요 취소 |
| GET | /api/boards/ranking/view | 조회수 랭킹 |
| GET | /api/boards/ranking/like | 좋아요 랭킹 |
| DELETE | /api/boards/admin/force/{boardId} | 게시글 강제 삭제 |

---

### comment-service
**주요 기능**
- 무한 댓글 (Path 기반 계층 구조)
- 댓글 좋아요 Redis 캐싱
- 게시글 작성자에게 댓글 알림 발행 (BoardClient Feign)

**API**
| Method | URL | 설명 |
|--------|-----|------|
| POST | /api/comments/create | 댓글 작성 |
| GET | /api/comments/{commentId} | 댓글 조회 |
| PUT | /api/comments/{commentId} | 댓글 수정 |
| DELETE | /api/comments/{commentId} | 댓글 삭제 |
| POST | /api/comments/{commentId}/like | 좋아요 |
| DELETE | /api/comments/{commentId}/like | 좋아요 취소 |
| GET | /api/comments/board/{boardId} | 게시글 댓글 조회 |
| DELETE | /api/comments/admin/force/{commentId} | 댓글 강제 삭제 |

---

### chat-service (1대1 채팅)
**주요 기능**
- WebSocket + STOMP 기반 실시간 채팅
- Redis Pub/Sub로 메시지 실시간 전달
- Kafka로 메시지 DB 비동기 저장
- roomId = "min(userId):max(userId)" 형태

**흐름**
```
클라이언트 → WebSocket(/ws/chat) → Redis Pub/Sub → 상대방
                                  → Kafka → DB 저장
```

---

### groupChat-service (그룹 채팅)
**주요 기능**
- WebSocket + STOMP 기반 그룹 채팅
- Redis Pub/Sub로 메시지 실시간 전달
- RoomClient Feign으로 방 존재 여부 확인
- Snowflake ID 정밀도 손실 방지 (roomId를 String으로 처리)

---

### room-service
**주요 기능**
- 방 생성 / 조회 / 초대 / 강제 삭제
- WebRTC 시그널링 서버
- WebSocket 연결 기반 입장/퇴장 자동 처리

**입장/퇴장 흐름**
```
WebSocket /ws/signal/ 연결
    ↓
join 메시지 → joinRoom() → Redis 업데이트 + currentPeople 증가
    ↓
WebSocket 연결 종료 (브라우저 종료 포함)
    ↓
afterConnectionClosed → leaveRoom() → Redis 정리 + currentPeople 감소
    ↓
currentPeople = 0 → 방 자동 삭제
```

**WebRTC 시그널링 메시지 타입**
```
join          → 방 입장 + 기존 참여자에게 알림
offer         → WebRTC offer 중계
answer        → WebRTC answer 중계
ice-candidate → ICE candidate 중계
leave         → 방 퇴장 + 나머지 참여자에게 알림
error         → 오류 (방 없음, 방 꽉 참, 이미 입장중)
```

**Redis 구조**
```
user:room:{userId}          → 현재 입장한 방 ID (1인 1방 제한)
room:participants:{roomId}  → 방 참여자 Set
study:start:{userId}        → 공부 시작 시간 (timestamp)
```

**공부시간 계산**
```
방 퇴장 시
→ study:start:{userId} 조회
→ (현재시간 - 시작시간) / 1000 / 60 = 공부시간(분)
→ Kafka "study.time" 발행
→ Redis 키 삭제
```

**동시성 제어 (테스트 결과)**

*방 인원 제한 동시성 (10명 동시 입장 시도, 최대 4명)*
| | DB 직접 | Redis Lua Script |
|---|---|---|
| 정확도 | 인원 유실 발생 | 정확히 4명 제한 |
| 속도 | ~100ms | ~15ms |

**API**
| Method | URL | 설명 |
|--------|-----|------|
| POST | /api/rooms/create | 방 생성 |
| GET | /api/rooms/{roomId} | 방 조회 |
| GET | /api/rooms/list | 전체 방 목록 |
| GET | /api/rooms/invite/{inviteCode} | 초대코드로 방 조회 |
| POST | /api/rooms/{roomId}/invite/{targetUserId} | 유저 초대 |
| DELETE | /api/rooms/admin/force/{roomId} | 방 강제 삭제 |

---

### alarm-service
**주요 기능**
- SSE(Server-Sent Events) 실시간 알림
- Kafka "alarm" 토픽 단일 사용

**알림 발행 시점**
| 알림 타입 | 발행 시점 |
|-----------|-----------|
| COMMENT | 내 게시글에 댓글 작성 시 |
| CHAT | 1대1 채팅 메시지 수신 시 |
| ROOM_INVITE | 스터디룸 초대 시 |

**API**
| Method | URL | 설명 |
|--------|-----|------|
| GET | /api/alarms/subscribe/{userId} | SSE 구독 |
| GET | /api/alarms/list | 전체 알림 조회 |
| GET | /api/alarms/unread | 미읽음 알림 조회 |
| PATCH | /api/alarms/{alarmId}/read | 알림 읽음 처리 |
| PATCH | /api/alarms/read-all | 전체 읽음 처리 |

---

## 실행 방법

### 서비스 접속
| 서비스 | URL |
|--------|-----|
| Eureka | http://localhost:8761 |
| Gateway | http://localhost:8000 |
| Swagger (Gateway) | http://localhost:8000/swagger-ui.html |

### 관리자 계정 설정
```bash
# 1. 테스트 페이지에서 회원가입
# 2. MySQL 접속
docker exec -it mysql mysql -u root -p

# 3. role 변경
USE user_db;
UPDATE users SET role = 'ADMIN' WHERE email = 'your@email.com';
```

---

## 테스트 코드

| 테스트 | 설명 |
|--------|------|
| BoardViewCountTest | DB vs Redis 조회수 동시성 비교 |
| BoardLikeCountTest | DB vs Redis 좋아요 동시성 비교 |
| BoardRankingTest | DB vs Redis 랭킹 조회 속도 비교 |
| RoomConcurrencyTest | DB vs Redis 방 인원 제한 동시성 비교 |
| KafkaTest | Kafka vs Redis Pub/Sub 메시지 유실률 비교 |

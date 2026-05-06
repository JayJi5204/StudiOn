# Backend

## 서비스 구성

### 공통 모듈 (common)
- **Snowflake ID** 생성 (분산 환경 고유 ID)
- **KafkaProducer** (ObjectMapper로 String JSON 직렬화)
- **FeignRequestInterceptor** (X-User-ID, X-User-Role 헤더 자동 전달)
- **SecurityUtil** (HttpServletRequest 헤더에서 userId, nickName, role 추출)
- **GlobalExceptionHandler** + ErrorCode + CustomException
- **StringListConverter** (List<String> ↔ DB String 변환)
- **Kafka 이벤트**: AlarmEvent, StudyTimeEvent, BoardDeleteEvent, CommentCreatedEvent, CommentDeletedEvent

### user-service
**주요 기능**
- 회원가입 / 로그인 / 로그아웃 / 회원 정보 수정 / 회원 탈퇴
- JWT AccessToken + RefreshToken (Redis 저장)
- 토큰 재발급 (reissue)
- 공부시간 랭킹 (Redis Sorted Set)
- 날짜별 공부 잔디
- 닉네임 검색 (서비스 간 Feign 호출용)
- 유저 검색 (닉네임 LIKE 쿼리, 본인 제외)
- 관리자 기능: 전체 유저 조회 / 유저 강제 탈퇴 (Redis refreshToken 삭제 포함)

**공부시간 처리 흐름**
```
room-service → Kafka "study.time" 발행
    ↓
user-service Consumer
    ↓
UserEntity.studyTime 업데이트 (DB, 초 단위)
Redis Sorted Set "ranking:study" 업데이트
Redis "study:daily:{userId}:{date}" 업데이트
```

**API**
| Method | URL | 설명 |
|--------|-----|------|
| POST | /api/users/create | 회원가입 |
| POST | /api/users/login | 로그인 |
| POST | /api/users/logout | 로그아웃 |
| POST | /api/users/reissue | 토큰 재발급 |
| GET | /api/users/my-info | 내 정보 조회 |
| GET | /api/users/{userId} | 유저 조회 |
| GET | /api/users/nickname/{userId} | 닉네임 조회 (내부 Feign용) |
| PUT | /api/users/update | 정보 수정 |
| DELETE | /api/users/delete | 회원 탈퇴 |
| GET | /api/users/all-users | 전체 유저 조회 (관리자) |
| GET | /api/users/search | 유저 검색 (닉네임, 로그인 필요) |
| GET | /api/users/ranking/study | 공부시간 랭킹 |
| GET | /api/users/ranking/study/my | 내 공부시간 순위 |
| GET | /api/users/study/daily | 날짜별 공부시간 (잔디) |
| DELETE | /api/users/admin/force/{userId} | 유저 강제 탈퇴 (관리자) |

---

### board-service
**주요 기능**
- 게시글 CRUD / 페이지네이션 / 카테고리 필터링 / 키워드 검색 (제목, 내용 LIKE)
- 조회수 / 좋아요 Redis 캐싱
- 조회수/좋아요 기반 랭킹 (NOTICE 카테고리 제외)
- 댓글 수 Redis 캐싱 (Kafka comment.created/comment.deleted 이벤트 연동)
- 게시글 강제 삭제 시 작성자 알람 발행 (BOARD_FORCE_DELETED)

**게시글 카테고리**
```
COMMUNITY  - 자유게시판
QUESTION   - 질문/답변
NOTICE     - 공지사항
```

**Redis 구조**
```
board:view:{boardId}          → 조회수
board:like:{boardId}          → 좋아요 수
board:like:set:{boardId}      → 좋아요한 유저 Set (중복 방지)
board:comment:count:{boardId} → 댓글 수
ranking:board:view            → 조회수 Sorted Set
ranking:board:like            → 좋아요 Sorted Set
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
| GET | /api/boards/get/{boardId} | 게시글 조회 (댓글 포함) |
| GET | /api/boards/list | 게시글 목록 (카테고리, 키워드 필터) |
| PUT | /api/boards/{boardId} | 게시글 수정 |
| DELETE | /api/boards/{boardId} | 게시글 삭제 |
| POST | /api/boards/{boardId}/like | 좋아요 |
| DELETE | /api/boards/{boardId}/like | 좋아요 취소 |
| GET | /api/boards/ranking/view | 조회수 랭킹 |
| GET | /api/boards/ranking/like | 좋아요 랭킹 |
| GET | /api/boards/users/{userId} | 유저 게시글 조회 |
| DELETE | /api/boards/admin/force/{boardId} | 게시글 강제 삭제 (관리자) |
| POST | /api/boards/comment/increment/{boardId} | 댓글 수 증가 (내부용) |
| POST | /api/boards/comment/decrement/{boardId} | 댓글 수 감소 (내부용) |

---

### comment-service
**주요 기능**
- 무한 댓글 (Path 기반 계층 구조)
- 댓글 좋아요 Redis 캐싱
- 게시글 작성자에게 댓글 알림 발행 (Kafka alarm 토픽)
- 댓글 생성 시 comment.created 이벤트 발행 (board-service 댓글 수 증가)
- 댓글 삭제 시 comment.deleted 이벤트 발행 (board-service 댓글 수 감소)
- 비로그인/Feign 호출 시 isLiked=false 처리 (try-catch 옵셔널)

**API**
| Method | URL | 설명 |
|--------|-----|------|
| POST | /api/comments/create | 댓글 작성 |
| GET | /api/comments/{commentId} | 댓글 조회 |
| PUT | /api/comments/{commentId} | 댓글 수정 |
| DELETE | /api/comments/{commentId} | 댓글 삭제 |
| POST | /api/comments/{commentId}/like | 좋아요 |
| DELETE | /api/comments/{commentId}/like | 좋아요 취소 |
| GET | /api/comments/getCommentWithBoardId/{boardId} | 게시글 댓글 조회 |
| GET | /api/comments/users/{userId} | 유저 댓글 조회 |
| DELETE | /api/comments/admin/force/{commentId} | 댓글 강제 삭제 (관리자) |

---

### chat-service (1대1 채팅)
**주요 기능**
- WebSocket + STOMP 기반 실시간 채팅
- Redis Pub/Sub로 메시지 실시간 전달
- Kafka로 메시지 DB 비동기 저장
- roomId = "{min(userId)}_{max(userId)}" 형태 (STOMP 이스케이프 문제로 _ 사용)
- 채팅 상대방에게 알람 발행 (Kafka alarm 토픽)
- 채팅방 목록 조회 (마지막 메시지 포함)

**흐름**
```
클라이언트 → WebSocket(/ws/chat) CONNECT (userId, nickName 헤더)
    ↓
/pub/chat/enter → Redis Pub/Sub 구독 시작
    ↓
/pub/chat/message → Redis Pub/Sub 발행 → 상대방 실시간 수신
                 → Kafka "chat.message" → DB 저장
                 → Kafka "alarm" → 상대방 알람
```

**STOMP 엔드포인트**
```
연결:    ws://{host}/ws/chat
구독:    /sub/chat/{roomId}
입장:    /pub/chat/enter
메시지:  /pub/chat/message
퇴장:    /pub/chat/leave
```

**API**
| Method | URL | 설명 |
|--------|-----|------|
| GET | /api/chats/messages/{roomId} | 채팅 메시지 조회 |
| GET | /api/chats/messages/{roomId}/before | 이전 메시지 조회 (무한 스크롤) |
| GET | /api/chats/room | 채팅방 ID 생성 |
| GET | /api/chats/rooms | 내 채팅방 목록 조회 |

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
- 방 이름 키워드 검색 (LIKE 쿼리)
- 강제 삭제 시 WebSocket 연결 강제 종료 + 참여자 알람 발행
- 동시 퇴장 동시성 제어 (PESSIMISTIC_WRITE 락)

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
status-change → 마이크/카메라 상태 변경 브로드캐스트
leave         → 방 퇴장 + 나머지 참여자에게 알림
force-close   → 관리자 강제 종료 (모든 참여자 연결 해제)
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
→ (현재시간 - 시작시간) / 1000 = 공부시간(초)
→ Kafka "study.time" 발행
→ Redis 키 삭제
```

**동시성 제어 (테스트 결과)**

*방 퇴장 동시성 (4명 동시 퇴장)*
| | 락 없는 경우 | PESSIMISTIC_WRITE 락 |
|---|---|---|
| 실제 남은 인원 | 3명 (동시성 문제 발생) | 0명 (정확히 처리) |
| 방 삭제 여부 | X (삭제 실패) | O (정상 삭제) |
| 소요 시간 | ~18ms | ~59ms |

**API**
| Method | URL | 설명 |
|--------|-----|------|
| POST | /api/rooms/create | 방 생성 |
| GET | /api/rooms/{roomId} | 방 조회 |
| GET | /api/rooms/list | 전체 방 목록 (키워드 검색) |
| GET | /api/rooms/invite/{inviteCode} | 초대코드로 방 조회 |
| POST | /api/rooms/{roomId}/invite/{targetUserId} | 유저 초대 |
| DELETE | /api/rooms/admin/force/{roomId} | 방 강제 삭제 (관리자) |

---

### studyGroup-service (신규)
**주요 기능**
- 스터디 그룹 CRUD
- 초대코드 기반 그룹 참여
- 그룹 멤버 관리 (가입 신청 / 수락 / 거절 / 추방 / 탈퇴)
- 회장 위임 기능
- 카테고리 필터링 / 키워드 검색 (그룹명 LIKE)
- 가입 신청/수락/추방 시 Kafka 알람 발행
- 최대 인원 4명 고정

**스터디 그룹 카테고리**
```
JOB         - 취업
CERTIFICATE - 자격증
LANGUAGE    - 어학
ETC         - 기타
```

**멤버 상태**
```
PENDING   - 가입 신청 대기
ACCEPTED  - 가입 승인
REJECTED  - 가입 거절
```

**알람 발행 시점**
| 알람 타입 | 발행 시점 |
|-----------|-----------|
| STUDY_JOIN_REQUEST | 가입 신청 시 → 회장에게 |
| STUDY_JOIN_ACCEPTED | 가입 수락 시 → 신청자에게 |
| STUDY_KICKED | 추방 시 → 추방된 멤버에게 |

**API**
| Method | URL | 설명 |
|--------|-----|------|
| POST | /api/study-groups/create | 그룹 생성 |
| GET | /api/study-groups/list | 전체 그룹 목록 (키워드 검색) |
| GET | /api/study-groups/list/category | 카테고리별 그룹 목록 (키워드 검색) |
| GET | /api/study-groups/my | 내 그룹 목록 |
| GET | /api/study-groups/{groupId} | 그룹 상세 조회 |
| GET | /api/study-groups/invite/{inviteCode} | 초대코드로 그룹 조회 |
| PUT | /api/study-groups/update/{groupId} | 그룹 수정 |
| DELETE | /api/study-groups/delete/{groupId} | 그룹 삭제 |
| POST | /api/study-members/{groupId}/join | 가입 신청 |
| GET | /api/study-members/{groupId}/members | 멤버 목록 |
| GET | /api/study-members/{groupId}/members/pending | 신청 대기 목록 |
| POST | /api/study-members/{groupId}/members/{userId}/accept | 가입 수락 |
| POST | /api/study-members/{groupId}/members/{userId}/reject | 가입 거절 |
| DELETE | /api/study-members/{groupId}/members/{userId}/kick | 멤버 추방 |
| DELETE | /api/study-members/{groupId}/leave | 그룹 탈퇴 |
| POST | /api/study-members/{groupId}/leader/{newLeaderId} | 회장 위임 |

---

### alarm-service
**주요 기능**
- SSE(Server-Sent Events) 실시간 알림
- Kafka "alarm" 토픽 단일 사용
- 읽음 처리 / 전체 읽음 처리
- 미읽음 알림 개수 조회

**알림 타입**
| 알림 타입 | 발행 시점 |
|-----------|-----------|
| COMMENT | 내 게시글에 댓글 작성 시 |
| CHAT | 1대1 채팅 메시지 수신 시 |
| ROOM_INVITE | 스터디룸 초대 시 |
| ROOM_FORCE_DELETED | 스터디룸 강제 종료 시 (참여자들에게) |
| STUDY_JOIN_REQUEST | 스터디 그룹 가입 신청 시 (회장에게) |
| STUDY_JOIN_ACCEPTED | 스터디 그룹 가입 승인 시 (신청자에게) |
| STUDY_KICKED | 스터디 그룹 추방 시 (추방된 멤버에게) |
| BOARD_FORCE_DELETED | 게시글 강제 삭제 시 (작성자에게) |

**API**
| Method | URL | 설명 |
|--------|-----|------|
| GET | /api/alarms/subscribe/{userId} | SSE 구독 |
| GET | /api/alarms/list | 전체 알림 조회 |
| GET | /api/alarms/unread | 미읽음 알림 조회 |
| GET | /api/alarms/unread-count | 미읽음 알림 개수 조회 |
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
| Frontend | http://localhost:8167 |

### 관리자 계정 설정
```bash
# 1. 회원가입
# 2. MySQL 접속
docker exec -it mysql mysql -u root -p

# 3. role 변경
USE user_db;
UPDATE users SET role = 'ADMIN' WHERE email = 'your@email.com';
```

### Docker 실행
```bash
# 전체 빌드 (메모리 부족 시 그룹별 빌드 권장)
COMPOSE_PARALLEL_LIMIT=2 docker compose build --no-cache

# 서비스별 빌드
docker compose build eureka-server config-server gateway-server
docker compose build user-service board-service comment-service
docker compose build room-service chat-service group-chat-service
docker compose build alarm-service study-group-service

# 실행
docker compose up -d
```

---

## 테스트 코드

| 테스트 | 설명 |
|--------|------|
| BoardViewCountTest | DB vs Redis 조회수 동시성 비교 |
| BoardLikeCountTest | DB vs Redis 좋아요 동시성 비교 |
| BoardRankingTest | DB vs Redis 랭킹 조회 속도 비교 |
| RoomConcurrencyTest | DB vs Redis 방 인원 제한 동시성 비교 |
| RoomConcurrentLeaveTest | 락 없는 경우 vs PESSIMISTIC_WRITE 락 동시 퇴장 비교 |
| ChatKafkaCompareTest | Kafka vs Redis Pub/Sub 메시지 유실률 비교 |
| ChatPerformanceCompareTest | 채팅 성능 비교 |
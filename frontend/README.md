# Frontend

## 기술 스택

| 분류            | 기술                         |
| --------------- | ---------------------------- |
| 프레임워크      | React 19 + TypeScript        |
| 빌드 도구       | Vite                         |
| 스타일링        | Tailwind CSS v4              |
| 상태 관리       | Zustand                      |
| HTTP 클라이언트 | Axios                        |
| 라우팅          | React Router v7              |
| WebSocket       | @stomp/stompjs               |
| 폼 관리         | Formik + Yup                 |
| 날짜 처리       | date-fns                     |
| 테스트          | Jest + Testing Library + MSW |
| 서버            | nginx (Docker, 8167포트)     |

---

## 프로젝트 구조

```
Frontend/src/
├── api/                  # API 호출 모듈
│   ├── axios.ts          # Axios 인스턴스 (baseURL, 인터셉터)
│   ├── alarmApi.ts
│   ├── boardApi.ts
│   ├── chatApi.ts
│   ├── commentApi.ts
│   ├── roomApi.ts
│   ├── studyGroupApi.ts
│   └── userApi.ts
│
├── components/           # 재사용 컴포넌트
│   ├── admin/
│   ├── board/
│   ├── chat/
│   ├── common/
│   ├── layout/
│   ├── profile/
│   └── studyroom/
│
├── hooks/
│   ├── useChatStomp.ts       # 1대1 채팅 STOMP 훅
│   ├── useGroupChatStomp.tsx # 그룹 채팅 STOMP 훅
│   └── useWebRTC.tsx         # WebRTC 훅
│
├── pages/
│   ├── AdminPage.tsx
│   ├── Layout.tsx
│   ├── MainPage.tsx
│   ├── RankingPage.tsx
│   ├── Board/
│   ├── StudyGroup/
│   ├── StudyRoom/
│   └── User/
│
├── router/
│   └── Router.tsx
│
├── stores/
│   └── authStore.ts      # Zustand 인증 상태
│
└── types/                # TypeScript 타입 정의
```

---

## 페이지 구성

| 경로                         | 페이지               | 설명                   |
| ---------------------------- | -------------------- | ---------------------- |
| `/`                          | MainPage             | 메인 페이지            |
| `/signin`                    | SignInPage           | 로그인                 |
| `/signup`                    | SignUpPage           | 회원가입               |
| `/profile`                   | ProfilePage          | 내 프로필              |
| `/ranking`                   | RankingPage          | 공부시간 랭킹          |
| `/board`                     | BoardListPage        | 게시글 목록            |
| `/board/:boardId`            | BoardDetailPage      | 게시글 상세            |
| `/write-post`                | BoardCreatePage      | 게시글 작성            |
| `/board/:boardId/edit`       | BoardUpdatePage      | 게시글 수정            |
| `/study`                     | StudyRoomListPage    | 스터디룸 목록          |
| `/study/:roomId/room`        | StudyRoomPage        | 스터디룸 (WebRTC)      |
| `/study-group`               | StudyGroupListPage   | 스터디 그룹 목록       |
| `/study-group/:groupId`      | StudyGroupDetailPage | 스터디 그룹 상세       |
| `/study-group/create`        | StudyGroupCreatePage | 스터디 그룹 생성       |
| `/study-group/:groupId/edit` | StudyGroupUpdatePage | 스터디 그룹 수정       |
| `/admin`                     | AdminPage            | 관리자 콘솔 (관리자만) |

---

## 주요 기능

### 인증 상태 관리 (Zustand)

`authStore.ts`에서 로그인 상태를 전역으로 관리해요. `persist` 미들웨어로 localStorage에 저장해서 새로고침 후에도 유지돼요.

```
User 타입: { userId, nickName, email, role, ... }

setUser(user) → user, isLoggedIn=true 저장
logout()      → user=null, isLoggedIn=false
```

```
로그인 성공
    ↓
authStore.setUser(user)
    ↓
localStorage "auth-storage"에 persist
    ↓
Header, ChatFloat 등 전역에서 user, isLoggedIn 참조
```

---

### 게시글

- 카테고리 필터링 (전체 / 자유게시판 / 질문·답변 / 공지사항)
- 제목·내용 키워드 검색 (검색 버튼 클릭 또는 Enter)
- 페이지네이션
- 공지사항 상단 고정 (별도 분리 렌더링)
- 댓글 / 좋아요 기능
- 카테고리 변경 시 키워드 초기화

```
검색 흐름:
searchInput (입력값) → 검색 버튼 클릭 → keyword state 업데이트
    ↓
useEffect [page, boardCategory, keyword] → API 호출
```

---

### 스터디룸

- 방 생성 / 입장 / 퇴장
- 비공개 방 비밀번호 입력 모달
- 초대코드로 입장
- WebRTC 화상 통화
- 그룹 채팅 (ChatPanel)
- 공부시간 타이머 (입장 시점부터 경과 시간)
- 키워드 검색 (5초마다 목록 갱신)
- 관리자 강제 종료 시 `force-close` 메시지 수신 → 자동 페이지 이동

---

### WebRTC 연결 흐름 (useWebRTC)

```
1. 방 입장
   navigator.mediaDevices.getUserMedia() → 로컬 스트림 획득
       ↓
   WebSocket(/ws/signal/) 연결
       ↓
   "join" 시그널 전송

2. 다른 참여자 입장 감지
   "join" 수신 → createPeerConnection() → RTCPeerConnection 생성
       ↓
   createOffer() → setLocalDescription() → "offer" 전송

3. offer 수신
   createPeerConnection() → setRemoteDescription()
       ↓
   createAnswer() → setLocalDescription() → "answer" 전송

4. answer 수신
   setRemoteDescription()

5. ICE Candidate 교환
   onicecandidate → "ice-candidate" 전송
   "ice-candidate" 수신 → addIceCandidate()

6. 원격 스트림 수신
   ontrack → participants 상태 업데이트 → VideoGrid 렌더링

7. 퇴장
   "leave" 전송 → RTCPeerConnection 종료 → 로컬 스트림 정리

8. 강제 종료
   "force-close" 수신 → 리소스 정리 → /study 이동
```

**시그널링 메시지 타입**

```
join          → 방 입장
offer         → WebRTC offer
answer        → WebRTC answer
ice-candidate → ICE candidate
status-change → 마이크/카메라 상태 변경
leave         → 방 퇴장
force-close   → 관리자 강제 종료
error         → 오류
```

---

### 1대1 채팅 (ChatFloat + useChatStomp)

화면 우측 하단 플로팅 UI로 구성돼 있어요.

**뷰 구성**

```
list   → 채팅방 목록
search → 유저 검색 (닉네임)
chat   → 채팅 뷰
```

**STOMP 연결 흐름 (useChatStomp)**

```
1. connect(roomId, userId, nickName)
   Client 생성 (connectHeaders: { userId, nickName })
       ↓
   WebSocket(/ws/chat) 연결
       ↓
   onConnect → /sub/chat/{roomId} 구독
            → /pub/chat/enter 발행

2. sendMessage(roomId, message)
   /pub/chat/message 발행

3. 메시지 수신
   /sub/chat/{roomId} → messages 상태 업데이트

4. disconnect()
   STOMP 연결 해제
```

**채팅 시작 흐름**

```
유저 검색 → 닉네임으로 유저 조회
    ↓
유저 선택 → chatApi.getRoomId(myId, targetId) → roomId 생성
    ↓
handleRoomSelect(room) → 메시지 조회 + STOMP 연결
    ↓
채팅 뷰 전환
```

---

### 그룹 채팅 (useGroupChatStomp)

스터디룸 내 ChatPanel에서 사용해요. 1대1 채팅과 별도 훅으로 분리돼 있어요.

---

### 스터디 그룹

- 카테고리 필터링 (전체 / 취업 / 자격증 / 어학 / 기타)
- 키워드 검색 (그룹명)
- 카테고리 변경 시 키워드 초기화
- 그룹 생성 / 수정 / 삭제
- 초대코드로 입장
- 가입 신청 / 수락 / 거절 / 추방 / 탈퇴
- 회장 위임
- 태그 기능
- 공개 / 비공개 설정

---

### 알람

- SSE 기반 실시간 알람 수신
- 헤더 알람 드롭다운
- 읽음 / 전체 읽음 처리
- 미읽음 알람 개수 표시

**알람 타입**

```
COMMENT             → 내 게시글에 댓글
CHAT                → 1대1 채팅 메시지
ROOM_INVITE         → 스터디룸 초대
ROOM_FORCE_DELETED  → 스터디룸 강제 종료
STUDY_JOIN_REQUEST  → 스터디 그룹 가입 신청 (회장에게)
STUDY_JOIN_ACCEPTED → 스터디 그룹 가입 승인
STUDY_KICKED        → 스터디 그룹 추방
BOARD_FORCE_DELETED → 게시글 강제 삭제
```

---

### 관리자 콘솔

관리자 role을 가진 유저만 접근 가능해요.

**탭 구성**

```
사용자 관리 → 닉네임 검색 / 강제 탈퇴
콘텐츠 제어 → 게시글 목록 / 강제 삭제
룸 모니터링 → 스터디룸 목록 / 강제 폐쇄
```

---

### 프로필

- 내 게시글 / 댓글 목록
- 공부 잔디 (날짜별 공부시간 시각화, GitHub 잔디 형태)
- 프로필 수정 (닉네임, 이메일, 전화번호, 소개글)
- 회원 탈퇴

---

## nginx 프록시 설정

| nginx 경로                         | 백엔드 서비스      | 비고                     |
| ---------------------------------- | ------------------ | ------------------------ |
| `/api/users/`                      | user-service       |                          |
| `/api/boards/`                     | board-service      |                          |
| `/api/comments/`                   | comment-service    |                          |
| `/api/chats/`                      | chat-service       |                          |
| `/api/rooms/`                      | room-service       |                          |
| `/api/alarms/subscribe/`           | alarm-service      | SSE (롱폴링, 버퍼링 off) |
| `/api/alarms/`                     | alarm-service      |                          |
| `/api/study-groups/`               | studyGroup-service |                          |
| `/api/study-members/`              | studyGroup-service |                          |
| `/ws/`                             | chat-service       | WebSocket                |
| `/ws/signal/`                      | room-service       | WebRTC 시그널링          |
| `/groupChat-service/ws/group-chat` | groupChat-service  | 그룹 채팅 WebSocket      |

---

## 실행 방법

### 개발 환경

```bash
cd Frontend
npm install
npm run dev
```

### Docker 빌드

```bash
docker compose build frontend
docker compose up -d frontend
```

### 접속

```
http://localhost:8167
```

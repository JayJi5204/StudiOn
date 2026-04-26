import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ChevronLeft, Users, Calendar, Star, Tag,
  Crown, Clock, CheckCircle, BookOpen, Lock
} from 'lucide-react';

/* ── 타입 ── */
interface Member {
  id: number;
  name: string;
  avatar: string;
  role: 'leader' | 'member';
}

interface StudyDetail {
  id: number;
  title: string;
  category: string;
  description: string;
  members: Member[];
  maxMembers: number;
  rating: number;
  schedule: string;
  scheduleTime: string;
  tags: string[];
  leader: string;
  leaderAvatar: string;
  isPublic: boolean;
}

/* ── Mock 데이터 (API 연결 전) ── */
const MOCK_STUDY: StudyDetail = {
  id: 1,
  title: 'React 마스터하기',
  category: '개발',
  description:
    'React의 기초부터 고급 패턴까지 함께 공부하는 스터디입니다.\n' +
    '매주 정해진 챕터를 공부하고 서로 발표하며 피드백을 나눕니다.\n' +
    '꾸준히 참여 가능한 분을 환영해요 🙌',
  members: [
    { id: 1, name: '김개발', avatar: '👨‍💻', role: 'leader' },
    { id: 2, name: '이리액트', avatar: '👩‍💻', role: 'member' },
    { id: 3, name: '박프론트', avatar: '🧑‍💻', role: 'member' },
    { id: 4, name: '최타입', avatar: '👨‍🎓', role: 'member' },
  ],
  maxMembers: 8,
  rating: 4.8,
  schedule: '매주 화, 목',
  scheduleTime: '20:00',
  tags: ['React', 'TypeScript', '프론트엔드', 'Hook'],
  leader: '김개발',
  leaderAvatar: '👨‍💻',
  isPublic: true,
};

/* ── 참여 상태 타입 ── */
type JoinStatus = 'none' | 'pending' | 'approved';

/* ════════════════════════════════════════
   메인 컴포넌트
════════════════════════════════════════ */
const StudyDetailPage = () => {
  const { id } = useParams();
  console.log(id)
  const navigate = useNavigate();

  // TODO: API 연결 시 id로 데이터 fetch
  const study = MOCK_STUDY;

  const [joinStatus, setJoinStatus] = useState<JoinStatus>('none');
  const [isRequesting, setIsRequesting] = useState(false);

  const isFull = study.members.length >= study.maxMembers;

  const handleJoinRequest = async () => {
    setIsRequesting(true);
    // TODO: API 연결 시 study.service.ts 호출로 교체
    await new Promise(res => setTimeout(res, 1000)); // mock delay
    setJoinStatus('pending');
    setIsRequesting(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* 뒤로가기 */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-500 hover:text-indigo-600 transition-colors"
        >
          <ChevronLeft size={20} className="mr-1" />
          뒤로가기
        </button>

        {/* ── 헤더 카드 ── */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-indigo-100 text-indigo-600 text-sm font-medium rounded-full">
                {study.category}
              </span>
              {!study.isPublic && (
                <span className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-500 text-sm rounded-full">
                  <Lock size={12} /> 비공개
                </span>
              )}
            </div>
            <div className="flex items-center text-yellow-400">
              <Star size={16} className="fill-yellow-400 mr-1" />
              <span className="text-gray-700 font-medium">{study.rating}</span>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-6">{study.title}</h1>

          {/* 스터디 정보 그리드 */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <InfoItem icon={<Users size={16} />} label="인원">
              <span className={study.members.length >= study.maxMembers ? 'text-red-500 font-semibold' : 'text-gray-800'}>
                {study.members.length}
              </span>
              <span className="text-gray-400">/{study.maxMembers}명</span>
              {isFull && <span className="ml-2 text-xs bg-red-100 text-red-500 px-2 py-0.5 rounded-full">마감</span>}
            </InfoItem>
            <InfoItem icon={<Calendar size={16} />} label="일정">
              <span className="text-gray-800">{study.schedule}</span>
            </InfoItem>
            <InfoItem icon={<Clock size={16} />} label="시작 시간">
              <span className="text-gray-800">{study.scheduleTime}</span>
            </InfoItem>
            <InfoItem icon={<Crown size={16} />} label="스터디장">
              <span className="text-gray-800">{study.leaderAvatar} {study.leader}</span>
            </InfoItem>
          </div>

          {/* 태그 */}
          <div className="flex flex-wrap gap-2 mb-8">
            {study.tags.map(tag => (
              <span key={tag} className="flex items-center gap-1 px-3 py-1 bg-indigo-50 text-indigo-600 text-sm rounded-full">
                <Tag size={12} />
                {tag}
              </span>
            ))}
          </div>

          {/* 참여 버튼 */}
          <JoinButton
            status={joinStatus}
            isFull={isFull}
            isRequesting={isRequesting}
            onRequest={handleJoinRequest}
          />
        </div>

        {/* ── 소개글 ── */}
        <Section title="스터디 소개" icon={<BookOpen size={18} />}>
          <p className="text-gray-600 leading-relaxed whitespace-pre-line">
            {study.description}
          </p>
        </Section>

        {/* ── 멤버 목록 ── */}
        <Section title={`멤버 ${study.members.length}/${study.maxMembers}`} icon={<Users size={18} />}>
          <div className="grid grid-cols-2 gap-3">
            {study.members.map(member => (
              <div key={member.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-xl">
                  {member.avatar}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-medium text-gray-800">{member.name}</span>
                    {member.role === 'leader' && (
                      <Crown size={13} className="text-yellow-500" />
                    )}
                  </div>
                  <span className="text-xs text-gray-400">
                    {member.role === 'leader' ? '스터디장' : '멤버'}
                  </span>
                </div>
              </div>
            ))}

            {/* 빈 슬롯 */}
            {Array.from({ length: study.maxMembers - study.members.length }).map((_, i) => (
              <div key={`empty-${i}`} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-300">
                  <Users size={18} />
                </div>
                <span className="text-sm text-gray-300">대기 중</span>
              </div>
            ))}
          </div>
        </Section>

      </div>
    </div>
  );
};

/* ════════════════════════════════════════
   참여 버튼 컴포넌트
════════════════════════════════════════ */
const JoinButton = ({
  status,
  isFull,
  isRequesting,
  onRequest,
}: {
  status: JoinStatus;
  isFull: boolean;
  isRequesting: boolean;
  onRequest: () => void;
}) => {
  if (status === 'pending') {
    return (
      <div className="w-full py-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 font-medium text-center flex items-center justify-center gap-2">
        <Clock size={18} />
        참여 신청 완료 · 스터디장 승인 대기 중
      </div>
    );
  }

  if (status === 'approved') {
    return (
      <div className="w-full py-4 rounded-xl bg-green-50 border border-green-200 text-green-600 font-medium text-center flex items-center justify-center gap-2">
        <CheckCircle size={18} />
        승인됨 · 스터디룸 입장하기
      </div>
    );
  }

  if (isFull) {
    return (
      <button disabled className="w-full py-4 rounded-xl bg-gray-100 text-gray-400 font-medium cursor-not-allowed">
        인원 마감
      </button>
    );
  }

  return (
    <button
      onClick={onRequest}
      disabled={isRequesting}
      className="w-full py-4 rounded-xl bg-indigo-600 text-white font-semibold text-lg hover:bg-indigo-700 transition-all transform hover:scale-[1.01] shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {isRequesting ? '신청 중...' : '참여 신청하기'}
    </button>
  );
};

/* ── 공통 컴포넌트 ── */
const Section = ({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) => (
  <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
    <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
      <span className="text-indigo-600">{icon}</span>
      <h2 className="font-bold text-gray-800">{title}</h2>
    </div>
    {children}
  </div>
);

const InfoItem = ({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) => (
  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl">
    <span className="text-indigo-400">{icon}</span>
    <div>
      <p className="text-xs text-gray-400 mb-0.5">{label}</p>
      <div className="flex items-center text-sm">{children}</div>
    </div>
  </div>
);

export default StudyDetailPage;
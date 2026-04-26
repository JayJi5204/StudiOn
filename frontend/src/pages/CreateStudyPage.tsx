import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen, Users, Calendar, Clock, Tag,
  ChevronLeft, ChevronRight, Plus, X, Check
} from 'lucide-react';

const categories = ['개발', '언어', '자격증', '취업준비', '독서', '기타'];

const scheduleOptions = ['월', '화', '수', '목', '금', '토', '일'];

const timeOptions = [
  '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00', '18:00',
  '19:00', '20:00', '21:00', '22:00', '23:00',
];

interface StudyForm {
  name: string;
  category: string;
  maxMembers: number;
  scheduleDays: string[];
  scheduleTime: string;
  tagInput: string;
  tags: string[];
}

const CreateStudyPage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState<StudyForm>({
    name: '',
    category: '',
    maxMembers: 4,
    scheduleDays: [],
    scheduleTime: '20:00',
    tagInput: '',
    tags: [],
  });

  const [submitted, setSubmitted] = useState(false);

  /* ── 핸들러 ── */
  const handleChange = (field: keyof StudyForm, value: unknown) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const toggleDay = (day: string) => {
    setForm(prev => ({
      ...prev,
      scheduleDays: prev.scheduleDays.includes(day)
        ? prev.scheduleDays.filter(d => d !== day)
        : [...prev.scheduleDays, day],
    }));
  };

  const addTag = () => {
    const tag = form.tagInput.trim();
    if (tag && !form.tags.includes(tag) && form.tags.length < 5) {
      setForm(prev => ({ ...prev, tags: [...prev.tags, tag], tagInput: '' }));
    }
  };

  const removeTag = (tag: string) => {
    setForm(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
  };

  const isValid =
    form.name.trim() !== '' &&
    form.category !== '' &&
    form.scheduleDays.length > 0;

  const handleSubmit = () => {
    if (!isValid) return;
    // TODO: API 연결 시 여기서 study.service.ts 호출
    console.log('스터디 생성:', form);
    setSubmitted(true);
    setTimeout(() => navigate('/'), 1800);
  };

  /* ── 완료 화면 ── */
  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-12 text-center max-w-md mx-auto">
          <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="text-indigo-600 w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">스터디가 생성됐어요!</h2>
          <p className="text-gray-500">잠시 후 홈으로 이동합니다...</p>
        </div>
      </div>
    );
  }

  /* ── 메인 ── */
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">

        {/* 상단 헤더 */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-500 hover:text-indigo-600 transition-colors mb-4"
          >
            <ChevronLeft size={20} className="mr-1" />
            뒤로가기
          </button>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
              <BookOpen className="text-white w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">스터디 만들기</h1>
              <p className="text-sm text-gray-500">함께 성장할 스터디를 만들어보세요</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">

          {/* ── 섹션 1: 기본 정보 ── */}
          <Section title="기본 정보" icon={<BookOpen size={18} />}>

            {/* 스터디 이름 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                스터디 이름 <span className="text-indigo-500">*</span>
              </label>
              <input
                type="text"
                placeholder="예) React 마스터하기"
                value={form.name}
                onChange={e => handleChange('name', e.target.value)}
                maxLength={30}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
              <p className="text-xs text-gray-400 mt-1 text-right">{form.name.length}/30</p>
            </div>

            {/* 카테고리 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                카테고리 <span className="text-indigo-500">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => handleChange('category', cat)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      form.category === cat
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'bg-white text-gray-600 border border-gray-300 hover:border-indigo-400 hover:text-indigo-600'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* 태그 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Tag size={14} className="inline mr-1" />
                태그 <span className="text-gray-400 font-normal">(최대 5개)</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="태그 입력 후 추가"
                  value={form.tagInput}
                  onChange={e => handleChange('tagInput', e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addTag()}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                />
                <button
                  onClick={addTag}
                  disabled={form.tags.length >= 5}
                  className="px-4 py-3 bg-indigo-100 text-indigo-600 rounded-xl hover:bg-indigo-200 transition-colors disabled:opacity-40"
                >
                  <Plus size={18} />
                </button>
              </div>
              {form.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {form.tags.map(tag => (
                    <span
                      key={tag}
                      className="flex items-center gap-1 px-3 py-1 bg-indigo-100 text-indigo-600 text-sm rounded-full"
                    >
                      {tag}
                      <button onClick={() => removeTag(tag)}>
                        <X size={13} className="hover:text-indigo-900" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </Section>

          {/* ── 섹션 2: 인원 ── */}
          <Section title="인원 설정" icon={<Users size={18} />}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                최대 인원: <span className="text-indigo-600 font-bold">{form.maxMembers}명</span>
              </label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleChange('maxMembers', Math.max(2, form.maxMembers - 1))}
                  className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:border-indigo-400 hover:text-indigo-600 transition-colors"
                >
                  <ChevronLeft size={18} />
                </button>
                <div className="flex-1">
                  <input
                    type="range"
                    min={2}
                    max={30}
                    value={form.maxMembers}
                    onChange={e => handleChange('maxMembers', Number(e.target.value))}
                    className="w-full accent-indigo-600"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>2명</span>
                    <span>30명</span>
                  </div>
                </div>
                <button
                  onClick={() => handleChange('maxMembers', Math.min(30, form.maxMembers + 1))}
                  className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:border-indigo-400 hover:text-indigo-600 transition-colors"
                >
                  <ChevronRight size={18} />
                </button>
              </div>

              {/* 인원 프리셋 */}
              <div className="flex gap-2 mt-4">
                {[4, 6, 8, 10].map(n => (
                  <button
                    key={n}
                    onClick={() => handleChange('maxMembers', n)}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all border ${
                      form.maxMembers === n
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-white text-gray-600 border-gray-300 hover:border-indigo-400'
                    }`}
                  >
                    {n}명
                  </button>
                ))}
              </div>
            </div>
          </Section>

          {/* ── 섹션 3: 일정 ── */}
          <Section title="스터디 일정" icon={<Calendar size={18} />}>

            {/* 요일 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                요일 <span className="text-indigo-500">*</span>
              </label>
              <div className="flex gap-2">
                {scheduleOptions.map(day => (
                  <button
                    key={day}
                    onClick={() => toggleDay(day)}
                    className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all ${
                      form.scheduleDays.includes(day)
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'bg-white text-gray-600 border border-gray-300 hover:border-indigo-400'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            {/* 시간 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock size={14} className="inline mr-1" />
                시작 시간
              </label>
              <select
                value={form.scheduleTime}
                onChange={e => handleChange('scheduleTime', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all bg-white"
              >
                {timeOptions.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            {/* 선택된 일정 미리보기 */}
            {form.scheduleDays.length > 0 && (
              <div className="bg-indigo-50 rounded-xl px-4 py-3 flex items-center gap-2 text-sm text-indigo-700">
                <Calendar size={16} />
                <span>
                  매주 <strong>{form.scheduleDays.join(', ')}</strong> {form.scheduleTime}
                </span>
              </div>
            )}
          </Section>

          {/* ── 제출 버튼 ── */}
          <button
            onClick={handleSubmit}
            disabled={!isValid}
            className={`w-full py-4 rounded-xl font-semibold text-lg transition-all transform ${
              isValid
                ? 'bg-indigo-600 text-white hover:bg-indigo-700 hover:scale-[1.01] shadow-lg'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            스터디 만들기
          </button>

          {!isValid && (
            <p className="text-center text-sm text-gray-400">
              이름, 카테고리, 요일을 선택해야 만들 수 있어요
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

/* ── 섹션 래퍼 컴포넌트 ── */
const Section = ({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) => (
  <div className="bg-white rounded-2xl shadow-lg p-6 space-y-5">
    <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
      <span className="text-indigo-600">{icon}</span>
      <h2 className="font-bold text-gray-800">{title}</h2>
    </div>
    {children}
  </div>
);

export default CreateStudyPage;
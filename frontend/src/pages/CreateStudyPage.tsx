import { useState } from 'react';
import { Formik, Form, useFormikContext } from 'formik';
import { useNavigate } from 'react-router-dom';
import {
  studyForminitialValues,
  validationSchema, 
  type StudyFormValues 
} from '../schemas/study.schema';
import { 
  BookOpen, 
  Users, 
  Calendar, 
  Clock, 
  Tag, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  X, 
  Check 
} from 'lucide-react';

import InputForm from '../components/form/InputForm';
import SubmitButton from '../components/button/SubmitButton';
import DaysSelectButton from '../components/button/DaysSelectButton';

/* ── 상수 ── */
const CATEGORIES = ['개발', '언어', '자격증', '취업준비', '독서', '기타'];
const TIME_OPTIONS = [
  '07:00','08:00','09:00','10:00','11:00','12:00',
  '13:00','14:00','15:00','16:00','17:00','18:00',
  '19:00','20:00','21:00','22:00','23:00',
];
const MEMBER_PRESETS: number[] = [4, 6, 8, 10];
const StudyFormInner = () => {
  const { values, setFieldValue, errors, touched } = useFormikContext<StudyFormValues>();
  const [tagInput, setTagInput] = useState('');

  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !values.tags.includes(tag) && values.tags.length < 5) {
      setFieldValue('tags', [...values.tags, tag]);
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setFieldValue('tags', values.tags.filter(t => t !== tag));
  };

  return (
    <div className="space-y-6">

      <Section title="기본 정보" icon={<BookOpen size={18} />}>

        <InputForm
          name="name"
          label="스터디 이름"
          placeholder="예) React 마스터하기"
          icon={<BookOpen size={18} />}
          type="text"
        />

        {/* 카테고리 - 버튼형이라 커스텀 유지 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            카테고리 <span className="text-indigo-500">*</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setFieldValue('category', cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  values.category === cat
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-white text-gray-600 border border-gray-300 hover:border-indigo-400 hover:text-indigo-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          {touched.category && errors.category && (
            <p className="mt-2 text-sm text-red-600">{errors.category}</p>
          )}
        </div>

        {/* 태그 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Tag size={14} className="inline mr-1" />
            태그 <span className="text-gray-400 font-normal">(최대 5개)</span>
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5">
                <Tag size={18} />
              </div>
              <input
                type="text"
                placeholder="태그 입력 후 추가"
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors hover:border-gray-400"
              />
            </div>
            <button
              type="button"
              onClick={addTag}
              disabled={values.tags.length >= 5}
              className="px-4 py-3 bg-indigo-100 text-indigo-600 rounded-xl hover:bg-indigo-200 transition-colors disabled:opacity-40"
            >
              <Plus size={18} />
            </button>
          </div>
          {values.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {values.tags.map(tag => (
                <span key={tag} className="flex items-center gap-1 px-3 py-1 bg-indigo-100 text-indigo-600 text-sm rounded-full">
                  {tag}
                  <button type="button" onClick={() => removeTag(tag)}>
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
            최대 인원: <span className="text-indigo-600 font-bold">{values.maxMembers}명</span>
          </label>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setFieldValue('maxMembers', Math.max(2, values.maxMembers - 1))}
              className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:border-indigo-400 hover:text-indigo-600 transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <div className="flex-1">
              <input
                type="range"
                min={2}
                max={30}
                value={values.maxMembers}
                onChange={e => setFieldValue('maxMembers', Number(e.target.value))}
                className="w-full accent-indigo-600"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>2명</span>
                <span>30명</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setFieldValue('maxMembers', Math.min(30, values.maxMembers + 1))}
              className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:border-indigo-400 hover:text-indigo-600 transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
          <div className="flex gap-2 mt-4">
            {MEMBER_PRESETS.map(n => (
              <button
                key={n}
                type="button"
                onClick={() => setFieldValue('maxMembers', n)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all border ${
                  values.maxMembers === n
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

        {/* 요일 - 기존 CheckboxForm 활용 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            요일 <span className="text-indigo-500">*</span>
          </label>
          <DaysSelectButton name="scheduleDays" />
        </div>

        {/* 시작 시간 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Clock size={14} className="inline mr-1" />
            시작 시간
          </label>
          <select
            value={values.scheduleTime}
            onChange={e => setFieldValue('scheduleTime', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors hover:border-gray-400 bg-white"
          >
            {TIME_OPTIONS.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        {/* 일정 미리보기 */}
        {values.scheduleDays.length > 0 && (
          <div className="bg-indigo-50 rounded-xl px-4 py-3 flex items-center gap-2 text-sm text-indigo-700">
            <Calendar size={16} />
            <span>
              매주 <strong>{values.scheduleDays.join(', ')}</strong> {values.scheduleTime}
            </span>
          </div>
        )}
      </Section>

      {/* ── 제출 버튼 - 기존 SubmitButton 활용 ── */}
      <SubmitButton
        label="스터디 만들기"
        loadingText="생성 중..."
      />
    </div>
  );
};

/* ════════════════════════════════════════
   메인 페이지
════════════════════════════════════════ */
const CreateStudyPage = () => {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (values: StudyFormValues) => {
    // TODO: API 연결 시 study.service.ts 호출로 교체
    console.log('스터디 생성:', values);
    await new Promise(res => setTimeout(res, 1000)); // mock delay
    setSubmitted(true);
    setTimeout(() => navigate('/'), 1800);
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">

        {/* 헤더 */}
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

        {/* Formik 폼 */}
        <Formik
          initialValues={studyForminitialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Form>
            <StudyFormInner />
          </Form>
        </Formik>

      </div>
    </div>
  );
};

/* ── 섹션 래퍼 ── */
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
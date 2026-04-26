import * as Yup from 'yup';

export const validationSchema = Yup.object({
  name: Yup.string().max(30, '30자 이하로 입력해주세요').required('스터디 이름을 입력해주세요'),
  category: Yup.string().required('카테고리를 선택해주세요'),
  scheduleDays: Yup.array().min(1, '요일을 하나 이상 선택해주세요'),
});

export const studyForminitialValues = {
  name: '',
  category: '',
  maxMembers: 4,
  scheduleDays: [] as string[],
  scheduleTime: '20:00',
  tags: [] as string[],
};

export type StudyFormValues = typeof studyForminitialValues;
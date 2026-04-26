import * as Yup from 'yup';

export const signinSchema = Yup.object().shape({
  email: Yup.string()
    .email("유효한 이메일 주소가 아닙니다.")
    .required("이메일을 입력하세요"),
  password: Yup.string()
    .min(8, '비밀번호는 최소 8자 이상입니다.')
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@!%*#?&])[A-Za-z\d@!%*#?&]{8,}$/,
      '영문, 숫자, 특수문자를 포함하여 8자 이상 입력하세요.'
    )
    .required('비밀번호를 입력하세요'),
  rememberMe: Yup.boolean(),
});

export const signupSchema = Yup.object().shape({
  nickName: Yup.string()
    .min(2, '사용자명은 2자 이상이어야 합니다.')
    .required('사용자명을 입력하세요.'),
  email: Yup.string()
      .email("유효한 이메일 주소가 아닙니다.")
      .required("이메일을 입력하세요"),
  password: Yup.string()
    .min(8, '영문, 숫자, 특수문자를 포함하여 8자 이상 입력하세요.')
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@!%*#?&])[A-Za-z\d@!%*#?&]{8,}$/,
      '영문, 숫자, 특수문자를 포함하여 8자 이상 입력하세요.'
    )
    .required('비밀번호를 입력하세요 (8자 이상).'),
  phoneNumber: Yup.string()
    .min(11,'최소 11자리를 입력해주세요')
    .matches(/^010\d{7,8}$/,'-을 제외한 휴대폰 번호를 입력해주세요.')
    .required('휴대폰 번호를 입력하세요'),
  confirmPassword: Yup.string()
    .min(8, '비밀번호는 최소 8자 이상입니다.')
    .required('비밀번호를 다시 입력하세요'),
  agreeTerms: Yup.boolean()
    .oneOf([true],'[필수] 이용약관에 동의해주세요.')
    .required('[필수] 이용약관에 동의해주세요.'),
  agreePrivacy: Yup.boolean()
    .oneOf([true],'[필수] 개인정보 수집 및 이용에 동의해주세요.')
    .required('[필수] 개인정보 수집 및 이용에 동의해주세요.'),
  rememberMe: Yup.boolean(),
});

export const signinInitialValues = {
  email: '',
  password: '',
  rememberMe: false,
};

export const signupInitialValues = {
  nickName: '',
  password: '',
  confirmPassword: '',
  email:'',
  phoneNumber:'',
  agreeTerms: false,
  agreePrivacy: false,
  rememberMe:false,
};

export type SigninFormValues = typeof signinInitialValues;
export type SignupFormValues = typeof signupInitialValues;
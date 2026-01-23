import React from 'react';
import { useFormikContext } from 'formik'; // 1. Formik 컨텍스트 가져오기
import { Check, X, Lock } from 'lucide-react'; // X 아이콘도 추가하면 좋겠죠?
import InputForm from '../form/InputForm';

const SignupConfirmPasswordField: React.FC = () => {

  const { values } = useFormikContext<any>();

  const ConfirmPasswordMessage = () => {
    if (!values.confirmPassword) return null;
    
    const isMatch = values.password === values.confirmPassword;
    if (isMatch) {
      return (
        <div className="mt-2 text-sm text-green-600 flex items-center">
          <Check className="w-4 h-4 mr-1" />
          비밀번호가 일치합니다
        </div>
      );
    } else {
      return (
        <div className="mt-2 text-sm text-red-600 flex items-center">
          <X className="w-4 h-4 mr-1" />
          비밀번호가 일치하지 않습니다
        </div>
      );
    }
  };

  return (
    <InputForm
      name="confirmPassword"
      label="비밀번호 확인"
      type="password"
      placeholder="비밀번호를 다시 입력하세요"
      icon={<Lock />}
      apply={[<ConfirmPasswordMessage />]}
    />
  );
};

export default SignupConfirmPasswordField;
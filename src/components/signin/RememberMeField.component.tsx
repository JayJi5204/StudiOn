import React from 'react';
import CheckboxForm from '../form/CheckboxForm';
import { Link } from 'react-router';

const RememberMe: React.FC = () => {
  return (
    <div className="flex items-center justify-between py-1">
      <CheckboxForm 
        name="rememberMe" 
        label="로그인 상태 유지" 
      />

      <Link
        to="/forgot-password"
        className="text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors focus:outline-none focus:underline"
      >
        비밀번호를 잊으셨나요?
      </Link>
    </div>
  );
};

export default RememberMe;
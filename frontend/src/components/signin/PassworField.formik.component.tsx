import React, { useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react'; 
import InputForm from '../form/InputForm';

const PasswordField: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);

  const passwordToggleButton = (
    <button
      type="button"
      className="flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
      onClick={() => setShowPassword(prev => !prev)}
      aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
    >
      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
    </button>
  );

  return (
    <InputForm
      name="password"
      label="비밀번호"
      type={showPassword ? "text" : "password"}
      placeholder="비밀번호를 입력하세요"
      icon={<Lock />}
      rightElement={passwordToggleButton}
    />
  );
};

export default PasswordField;
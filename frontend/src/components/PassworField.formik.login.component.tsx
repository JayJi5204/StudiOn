import React, { useState } from 'react';
import { Field, ErrorMessage } from 'formik';
import { Lock, Eye, EyeOff } from 'lucide-react'; 

const PasswordField: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div>
      <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
        비밀번호
      </label>
      <div className="relative">
        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Field name="password">
          {({ field, meta }: any) => (
            <input
              {...field}
              // showPassword 상태에 따라 입력 유형을 변경합니다.
              type={showPassword ? "text" : "password"} 
              placeholder="비밀번호를 입력하세요"
              className={`w-full pl-12 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${
                meta.error && meta.touched ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
              }`}
            />
          )}
        </Field>
        {/* 비밀번호 표시/숨기기 버튼 */}
        <button
          type="button"
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          onClick={() => setShowPassword(prev => !prev)}
        >
          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>
      <ErrorMessage name="password" component="div" className="mt-2 text-sm text-red-600" />
    </div>
  );
};

export default PasswordField;
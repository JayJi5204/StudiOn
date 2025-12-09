import React, { use, useState } from 'react';
import { Formik, Form, Field,useFormik} from 'formik';
import { Loader2, ArrowRight } from 'lucide-react'; 
import UserField from './UserField.formik.login.component'; 
import PasswordField from './PassworField.formik.login.component'; 
import { LoginSchema, initialValues} from '../common/validationSchema'; 
import { useNavigate } from 'react-router';

const LoginForm: React.FC = () => {
  let navigate = useNavigate();

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: LoginSchema,
    onSubmit: (values) => {
      handleLogin(values);
    },
  });
  
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [message,setMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleLogin = (formValue:{username:string,password:string}) => {
        const {username,password} = formValue;

        setMessage('');
        setLoading(true);
        
        {/* 실제 API 호출
        login(username,password).then(
            () => {
                navigate("/profile");
                window.location.reload();
            },
            (error) => {
                const resMessage =
                    (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                    error.message ||
                    error.toString();

                setLoading(false);
                setMessage(resMessage);
            }
        )
        */}
        
        // 임시 로그인 처리
        setTimeout(() => {
            if (username === 'testuser' && password === 'password123') {
                sessionStorage.setItem("user", JSON.stringify({id: 1, username: 'testuser', accessToken: 'dummy-token'}));
                navigate('/');
                window.location.reload();
            } else {
                setLoading(false);
                setMessage('사용자명 또는 비밀번호가 올바르지 않습니다.');
            }
        }, 1000);
    };

  return (
    <div className="max-w-md mx-auto mt-10 p-8 border rounded-xl shadow-lg bg-white">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">로그인</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={LoginSchema}
        onSubmit={handleLogin}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-6">
            
            {/* Username Field (컴포넌트 분리) */}
            <UserField />

            {/* Password Field (컴포넌트 분리) */}
            <PasswordField />

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {/* Formik의 Field 컴포넌트를 사용하여 체크박스 상태 관리 */}
                <Field
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  로그인 상태 유지
                </label>
              </div>
              <a href="#" className="text-sm text-indigo-600 hover:text-indigo-500 transition-colors">
                비밀번호를 잊으셨나요?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit" // Formik에서 이 버튼의 type은 "submit"이어야 합니다.
              disabled={isSubmitting} // Formik의 isSubmitting 상태 사용
              className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>로그인 중...</span>
                </>
              ) : (
                <>
                  <span>로그인</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            {/* Error Message (Formik 외부의 일반적인 서버 오류 메시지) */}
            {errorMessage && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-800">{errorMessage}</p>
                  </div>
                </div>
              </div>
            )}
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default LoginForm;
import React, { useState } from 'react';
import { Formik, Form} from 'formik';
import { Loader2, ArrowRight } from 'lucide-react'; 
import UserField from './UserField.formik.component'; 
import PasswordField from './PassworField.formik.component'; 
import RememberMe from './RememberMeField.component';
import { signinSchema, signinInitialValues} from '../../schemas/authSchema'; 
import { useNavigate } from 'react-router';
import { signin } from '../../services/auth.service'

const SigninForm: React.FC = () => {
    let navigate = useNavigate();

    const [message,setMessage] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const handleSignin = (formValue:{username:string,password:string}) => {
        const {username,password} = formValue;
        setMessage('');
        setLoading(true);

        signin(username,password).then(
            () => {
                navigate("/");
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
        console.log(message)
    };

    const LoginLodingSpinner = () => {
      return <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>로그인 중...</span>
            </>
    }

    const LoginLodingComplete = () => {
      return <>
              <span>로그인</span>
              <ArrowRight className="w-5 h-5" />
            </>
    }

    const SubmitButton = () => {
      return <button
                  type="submit" // Formik에서 이 버튼의 type은 "submit"이어야 합니다.
                  disabled={loading} // Formik의 isSubmitting 상태 사용
                  className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  {loading ? <LoginLodingSpinner/> : <LoginLodingComplete/>}
              </button>
    }

    return (
      <div className="max-w-md mx-auto mt-10 p-8 border rounded-xl shadow-lg bg-white">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          로그인
        </h2>
        
        <Formik
          initialValues={signinInitialValues}
          validationSchema={signinSchema}
          onSubmit={handleSignin}
        >
            <Form className="space-y-6">
                <UserField />

                <PasswordField />

                <RememberMe />
                
                {/* Submit Button */}
                <SubmitButton/>
            </Form>
        </Formik>
      </div>
    );
};

export default SigninForm;
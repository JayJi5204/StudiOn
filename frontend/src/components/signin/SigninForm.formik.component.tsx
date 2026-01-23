import React, { useState } from 'react';
import { Formik, Form} from 'formik';
import SigninUserField from './SigninUserField.formik.component'; 
import SigninPasswordField from './SigninPassworField.formik.component'; 
import SigninRememberMe from './SigninRememberMeField.component';
import SigninSubmitButton from '../button/SubmitButton';
import GoogleLoginButton from '../button/GoogleLoginButton';
import { signinSchema, signinInitialValues} from '../../schemas/authSchema'; 
import { useNavigate } from 'react-router';
import { signin } from '../../services/auth.service';

const SigninForm: React.FC = () => {
    let navigate = useNavigate();

    const [message,setMessage] = useState<string>('');

    const handleSignin = (formValue:{username:string,password:string}) => {
        const {username,password} = formValue;
        setMessage('');

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

                setMessage(resMessage);
            }
        )
        console.log(message)
    };

    return (
        <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">로그인</h2>
                <p className="text-gray-600">로그인하여 스터디를 시작하세요</p>
            </div>
            
            <div className="space-y-6 mb-2">
                <Formik
                initialValues={signinInitialValues}
                validationSchema={signinSchema}
                onSubmit={handleSignin}
                >
                    <Form>
                        <SigninUserField />
                        <SigninPasswordField />
                        <SigninRememberMe />
                        <SigninSubmitButton
                            label='로그인'
                            loadingText='로그인 중 ...'
                        />
                    </Form>
                </Formik>
                
                {/* <Divder> */}
                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">또는</span>
                    </div>
                </div>
                
                <GoogleLoginButton/>
            </div>
        </div>
    );
};

export default SigninForm;
import { Formik,Form } from 'formik';
import { authService } from '../../services/auth.service';
import { Link, useNavigate } from 'react-router';
import SignupUserField from './SignupUserField.formik.component';
import SignupEmailField from './SignupEmailField.formik.component';
import SignupPasswordField from './SignupPasswordField.formik.component';
import SignupConfirmPasswordField from './SignupConfirmPasswordField';
import SignupTermsAgreementField from './SignupTermsAgreementField';
import SignupPrivacyAgreementField from './SignupPrivacyAgreementField';
import SignupPhoneNumberField from './SignupPhoneNumberField';
import SubmitButton from '../button/SubmitButton';
import Consent from '../footer/Consent.component';
import { signupInitialValues, signupSchema } from '../../schemas/authSchema';

const SignupForm = () => {

    let navigate = useNavigate();
    
    const handleSignUp = (formValue:{username:string,password:string,email:string}) => {
        const {username,email,password} = formValue;

        authService
            .creatUser(username,email,password).then(response => {
            console.log('회원가입 성공:', response.data);
            navigate('/signin');
            })
            .catch(error => {
                if (error.response && error.response.data && error.response.data.message) {
                    console.log('회원가입 실패 메시지:', error.response.data.message);
                    alert(`회원가입 실패: ${error.response.data.message}`);
                    navigate('/');
            }
        });
    };

    return (
        <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">회원가입</h2>
                <p className="text-gray-600">새로운 계정을 만들어 스터디를 시작하세요</p>
            </div>

            <div className="space-y-6 mb-2">
                <Formik
                    initialValues={signupInitialValues}
                    validationSchema={signupSchema}
                    onSubmit={handleSignUp}
                >
                    <Form>
                        <SignupUserField/>
                        <SignupEmailField/>
                        <SignupPhoneNumberField/>
                        <SignupPasswordField/>
                        <SignupConfirmPasswordField/>
                        <SignupTermsAgreementField/>
                        <SignupPrivacyAgreementField/>
                        <SubmitButton
                            label="계정 생성하기" 
                            loadingText="생성 중 ..."
                    />
                    </Form>

                </Formik>

                <Consent/>
            </div>

            {/* signin Link */}
            <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="text-center">
                <p className="text-sm text-gray-600">
                    이미 계정이 있으신가요?{' '}
                    <Link to="/signin" className="text-indigo-600 hover:text-indigo-500 font-medium transition-colors">
                    로그인하기
                    </Link>
                </p>
                </div>
            </div>
        </div>
    );
};

export default SignupForm
import { Formik, Form} from 'formik';
import { useNavigate } from 'react-router';
import { signinSchema, signinInitialValues} from '../../schemas/authSchema'; 
import { authService } from '../../services/auth.service';
import useUserInfoStore from '../../store/userInfoStore';
import SigninEmailField from './SigninEmailField.formik.component'; 
import SigninPasswordField from './SigninPassworField.formik.component'; 
import SigninRememberMe from './SigninRememberMeField.formik.component';
import SigninSubmitButton from '../button/SubmitButton';
import GoogleLoginButton from '../button/GoogleLoginButton';

const SigninForm = () => {
    const navigate = useNavigate();

    const { setUserInfo } = useUserInfoStore();

    const handleSignin = async (
        formValue:{
            email:string,
            password:string
        }) => {
        const {email,password} = formValue;
        try {
            const userData = await authService.login(email,password);
            setUserInfo(userData);
            console.log('로그인 성공:', userData);
            alert('로그인 되었습니다.');
            navigate('/');

        } catch (error) {
            console.log(error);
            alert('이메일 또는 비밀번호가 틀렸습니다.');
            navigate('/');
        };
        
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
                        <SigninEmailField />
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
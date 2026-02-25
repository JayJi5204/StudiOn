import SignUpHeader from '../components/header/Signup.component';
import SignUpForm from '../components/signup/SignupForm.formik.component';

const SignUpPage = () => {

    return (
        <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="w-full max-w-xl">
                <SignUpHeader/>
                <SignUpForm/>
                <div className="text-center mt-8 text-sm text-gray-500">
                    <p>
                        회원가입 시{' '}
                        <a href="#" className="text-indigo-600 hover:text-indigo-500">이용약관</a>
                        {' '}및{' '}
                        <a href="#" className="text-indigo-600 hover:text-indigo-500">개인정보처리방침</a>
                        에 동의하게 됩니다.
                    </p>
                </div>
            </div>
        </main>
    );
};

export default SignUpPage;
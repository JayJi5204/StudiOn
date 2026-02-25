import SignInHeader from '../components/header/Signin.component';
import SignInForm from '../components/signin/SigninForm.formik.component';
import { Link } from 'react-router';

const SigninPage = () => {
    
    return (
        <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="w-full max-w-xl">
                <SignInHeader/>
                <SignInForm/>
                <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                    <p className="text-sm text-gray-600">
                    계정이 없으신가요?{' '}
                        <Link to="/register" className="text-indigo-600 hover:text-indigo-500 font-medium transition-colors">
                            회원가입하기
                        </Link>
                    </p>
                </div>

            </div>
        </main>
  );
};

export default SigninPage;
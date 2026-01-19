import SigninForm from '../signin/SigninForm.formik.component';
import SocialLoginSection from '../signin/SocialLoginSection.OAuth.component';
import { Link } from 'react-router';

const SigninSection = () => {
    return (
        <section className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">로그인</h2>
                <p className="text-gray-600">계정에 로그인하여 스터디를 시작하세요</p>
            </div>

            <SigninForm />

            <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                <p className="text-sm text-gray-600">
                계정이 없으신가요?{' '}
                    <Link to="/register" className="text-indigo-600 hover:text-indigo-500 font-medium transition-colors">
                        회원가입하기
                    </Link>
                </p>
            </div>

            <SocialLoginSection />
        </section>
    )
}

export default SigninSection
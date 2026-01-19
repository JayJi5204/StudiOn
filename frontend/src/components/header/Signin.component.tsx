import { BookOpen} from 'lucide-react';

const SigninHeader = () => {
    
    return (
        <header className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
                <div className="bg-indigo-600 p-3 rounded-full">
                <BookOpen className="w-8 h-8 text-white" />
                </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">StudyTogether</h1>
            <p className="text-gray-600">함께 성장하는 스터디 플랫폼에 로그인하세요</p>
        </header>
    )
}

export default SigninHeader
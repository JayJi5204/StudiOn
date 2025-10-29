import React, { useState } from 'react';
import { Eye, EyeOff, User, Lock, BookOpen, ArrowRight, Loader2 } from 'lucide-react';

const LoginPage = () => {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({ username: '', password: '' });

    const validateForm = () => {
        const newErrors = { username: '', password: '' };
        
        if (!username.trim()) {
        newErrors.username = '사용자명을 입력해주세요';
        }
        if (!password.trim()) {
        newErrors.password = '비밀번호를 입력해주세요';
        }
        
        setErrors(newErrors);
        return !newErrors.username && !newErrors.password;
    };

    const handleLogin = (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
        return;
        }

        setMessage('');
        setLoading(true);

        // 데모용 로그인 (실제로는 API 호출)
        setTimeout(() => {
        if (username === 'demo' && password === 'password') {
            setMessage('');
            alert('로그인 성공!');
        } else {
            setMessage('사용자명 또는 비밀번호가 올바르지 않습니다.');
        }
        setLoading(false);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
            {/* Header */}
            <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
                <div className="bg-indigo-600 p-3 rounded-full">
                <BookOpen className="w-8 h-8 text-white" />
                </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">StudyTogether</h1>
            <p className="text-gray-600">함께 성장하는 스터디 플랫폼에 로그인하세요</p>
            </div>

            {/* Login Card */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">로그인</h2>
                <p className="text-gray-600">계정에 로그인하여 스터디를 시작하세요</p>
            </div>

            <div className="space-y-6">
                {/* Username Field */}
                <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                    사용자명
                </label>
                <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                    name="username"
                    type="text"
                    placeholder="사용자명을 입력하세요"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${
                        errors.username ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                    }`}
                    />
                </div>
                {errors.username && (
                    <div className="mt-2 text-sm text-red-600">{errors.username}</div>
                )}
                </div>

                {/* Password Field */}
                <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    비밀번호
                </label>
                <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="비밀번호를 입력하세요"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full pl-12 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${
                        errors.password ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                    }`}
                    />
                    <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                    >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                </div>
                {errors.password && (
                    <div className="mt-2 text-sm text-red-600">{errors.password}</div>
                )}
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <input
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
                type="button"
                onClick={handleLogin}
                disabled={loading}
                className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
                >
                {loading ? (
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

                {/* Error Message */}
                {message && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex">
                    <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <p className="text-sm text-red-800">{message}</p>
                    </div>
                    </div>
                </div>
                )}
            </div>

            {/* Divider */}
            <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="text-center">
                <p className="text-sm text-gray-600">
                    계정이 없으신가요?{' '}
                    <a href="#" className="text-indigo-600 hover:text-indigo-500 font-medium transition-colors">
                    회원가입하기
                    </a>
                </p>
                </div>
            </div>

            {/* Social Login */}
            <div className="mt-6">
                <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">또는</span>
                </div>
                </div>
                <div className="mt-6">
                <button className="w-full bg-white border border-gray-300 rounded-lg py-3 px-4 hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2">
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span className="text-gray-700">Google로 로그인</span>
                </button>
                </div>
            </div>
            </div>

            {/* Footer */}
            <div className="text-center mt-8 text-sm text-gray-500">
            <p>
                로그인하면{' '}
                <a href="#" className="text-indigo-600 hover:text-indigo-500">이용약관</a>
                {' '}및{' '}
                <a href="#" className="text-indigo-600 hover:text-indigo-500">개인정보처리방침</a>
                에 동의하는 것으로 간주됩니다.
            </p>
            </div>
        </div>
        </div>
    );
};

export default LoginPage;
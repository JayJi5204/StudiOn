import React, { useState } from 'react';
import { User, Lock, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router';

const LoginForm: React.FC<{}> = () => {
    let navigate = useNavigate();
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [errors, setErrors] = useState<{ username?: string; password?: string }>({});
    const [message,setMessage] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    
    const validationForm = () => {
        const newErrors: { username: string; password: string } = { username: '', password: '' };

        if (!username) {
            newErrors.username = '사용자명을 입력해주세요';
        }

        if (!password) {
            newErrors.password = '비밀번호를 입력해주세요';
        }

        setErrors(newErrors);

        return !newErrors.username && !newErrors.password;
    }

    const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!validationForm()) {
            return;
        }

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
)
};
export default LoginForm;
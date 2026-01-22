import React, { useState } from 'react';
import { Eye, EyeOff, User, Lock, Mail, ArrowRight, Loader2, Check, X } from 'lucide-react';
import { signup } from '../services/auth.service';
import SignUpHeader from '../components/header/Signup.component'

const SignUpPage:React.FC = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<string>('');
    const [IsSuccessful,setIsSuccessful] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
    
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        agreeTerms: false,
        agreePrivacy: false
    });

    const [errors, setErrors] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        terms: ''
    });

    const [passwordStrength, setPasswordStrength] = useState({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        special: false
    });

    const handleSignUp = (formValue:{username:string,email:string,password:string}) => {
        const {username,email,password} = formValue;

        signup(username,email,password).then(
            (response) => {
                setMessage(response.data.message);
                setIsSuccessful(true);
            },
            (error) => {
                const resMessage = (
                    error.response && 
                    error.response.data &&
                    error.response.data.message
                ) ||
                error.message ||
                error.toString();

                setMessage(resMessage);
                setIsSuccessful(false);
            }
        )
    }

    const handleInputChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : value;
        
        setFormData(prev => ({
        ...prev,
        [name]: newValue
        }));

        if (name === 'password') {
            checkPasswordStrength(value);
        }
    };

    const checkPasswordStrength = (password:string) => {
        setPasswordStrength({
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
        special: /[!@#$%^&*]/.test(password)
        });
    };

    const getPasswordStrengthColor = () => {
        const score = Object.values(passwordStrength).filter(Boolean).length;
        if (score <= 2) return 'bg-red-500';
        if (score <= 4) return 'bg-yellow-500';
        return 'bg-green-500';
    };

    const getPasswordStrengthText = () => {
        const score = Object.values(passwordStrength).filter(Boolean).length;
        if (score <= 2) return '약함';
        if (score <= 4) return '보통';
        return '강함';
    };

    return (
        <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="w-full max-w-xl">
                {/* Header */}
                <SignUpHeader/>

                {/* signin Card */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">회원가입</h2>
                    <p className="text-gray-600">새로운 계정을 만들어 스터디를 시작하세요</p>
                </div>

                <div className="space-y-6">
                    {/* Username Field */}
                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        사용자명
                    </label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                        name="username"
                        type="text"
                        placeholder="사용자명을 입력하세요"
                        value={formData.username}
                        onChange={handleInputChange}
                        className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${
                            errors.username ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                        }`}
                        />
                    </div>
                    {errors.username && (
                        <div className="mt-2 text-sm text-red-600">{errors.username}</div>
                    )}
                    </div>

                    {/* Email Field */}
                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        이메일
                    </label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                        name="email"
                        type="email"
                        placeholder="example@email.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${
                            errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                        }`}
                        />
                    </div>
                    {errors.email && (
                        <div className="mt-2 text-sm text-red-600">{errors.email}</div>
                    )}
                    </div>

                    {/* Password Field */}
                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        비밀번호
                    </label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            name="password"
                            type="password"
                            placeholder="비밀번호를 입력하세요 (8자 이상)"
                            value={formData.password}
                            onChange={handleInputChange}
                            className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${
                                errors.password ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                            }`}
                        />
                    </div>
                    {errors.password && (
                        <div className="mt-2 text-sm text-red-600">{errors.password}</div>
                    )}
                    
                    {/* Password Strength Indicator */}
                    {formData.password && (
                        <div className="mt-3">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-600">비밀번호 강도</span>
                            <span className="text-sm font-medium text-gray-900">{getPasswordStrengthText()}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className={`h-2 rounded-full transition-all ${getPasswordStrengthColor()}`} 
                                style={{width: `${(Object.values(passwordStrength).filter(Boolean).length / 5) * 100}%`}}>
                            </div>
                        </div>
                            <div className="mt-2 space-y-1">
                                <div className={`text-xs flex items-center ${passwordStrength.length ? 'text-green-600' : 'text-gray-400'}`}>
                                {passwordStrength.length ? <Check className="w-3 h-3 mr-1" /> : <X className="w-3 h-3 mr-1" />}
                                8자 이상
                                </div>
                                <div className={`text-xs flex items-center ${passwordStrength.uppercase ? 'text-green-600' : 'text-gray-400'}`}>
                                {passwordStrength.uppercase ? <Check className="w-3 h-3 mr-1" /> : <X className="w-3 h-3 mr-1" />}
                                대문자 포함
                                </div>
                                <div className={`text-xs flex items-center ${passwordStrength.number ? 'text-green-600' : 'text-gray-400'}`}>
                                {passwordStrength.number ? <Check className="w-3 h-3 mr-1" /> : <X className="w-3 h-3 mr-1" />}
                                숫자 포함
                                </div>
                                <div className={`text-xs flex items-center ${passwordStrength.special ? 'text-green-600' : 'text-gray-400'}`}>
                                {passwordStrength.special ? <Check className="w-3 h-3 mr-1" /> : <X className="w-3 h-3 mr-1" />}
                                특수문자 포함
                                </div>
                            </div>
                        </div>
                    )}
                    </div>

                    {/* Confirm Password Field */}
                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        비밀번호 확인
                    </label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                        name="confirmPassword"
                        type="password"
                        placeholder="비밀번호를 다시 입력하세요"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${
                            errors.confirmPassword ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                        }`}
                        />
                    </div>
                    {errors.confirmPassword && (
                        <div className="mt-2 text-sm text-red-600">{errors.confirmPassword}</div>
                    )}
                    {!errors.confirmPassword && formData.confirmPassword && formData.password === formData.confirmPassword && (
                        <div className="mt-2 text-sm text-green-600 flex items-center">
                        <Check className="w-4 h-4 mr-1" />
                            비밀번호가 일치합니다
                        </div>
                    )}
                    </div>

                    {/* Terms Agreement */}
                    <div className="space-y-3">
                    <div className="flex items-start">
                        <input
                        id="agreeTerms"
                        name="agreeTerms"
                        type="checkbox"
                        checked={formData.agreeTerms}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded mt-1"
                        />
                        <label htmlFor="agreeTerms" className="ml-2 block text-sm text-gray-700">
                        <span className="font-medium">[필수]</span> 이용약관에 동의합니다
                        <a href="#" className="text-indigo-600 hover:text-indigo-500 ml-1">자세히 보기</a>
                        </label>
                    </div>
                    <div className="flex items-start">
                        <input
                        id="agreePrivacy"
                        name="agreePrivacy"
                        type="checkbox"
                        checked={formData.agreePrivacy}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded mt-1"
                        />
                        <label htmlFor="agreePrivacy" className="ml-2 block text-sm text-gray-700">
                        <span className="font-medium">[필수]</span> 개인정보 수집 및 이용에 동의합니다
                        <a href="#" className="text-indigo-600 hover:text-indigo-500 ml-1">자세히 보기</a>
                        </label>
                    </div>
                    {errors.terms && (
                        <div className="text-sm text-red-600">{errors.terms}</div>
                    )}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="button"
                        onClick={handleSignUp}
                        disabled={loading}
                        className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
                    >
                    {loading ? (
                        <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>가입 중...</span>
                        </>
                    ) : (
                        <>
                        <span>회원가입</span>
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

                {/* signin Link */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                    <div className="text-center">
                    <p className="text-sm text-gray-600">
                        이미 계정이 있으신가요?{' '}
                        <a href="#" className="text-indigo-600 hover:text-indigo-500 font-medium transition-colors">
                        로그인하기
                        </a>
                    </p>
                    </div>
                </div>
                </div>

                {/* Footer */}
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
import InputForm from "../form/InputForm";
import { Lock } from "lucide-react";
import { Check,X } from "lucide-react";

import { useFormikContext } from "formik";

const SignupPasswordField = () => {
    const { values } = useFormikContext<any>();
    
    let passwordStrength = ({
        length: values.password.length >= 8,
        uppercase: /[A-Z]/.test(values.password),
        lowercase: /[a-z]/.test(values.password),
        number: /[0-9]/.test(values.password),
        special: /[!@#$%^&*]/.test(values.password)
    });

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

    const PassowrdStrengthMessage = () => {
        return (values.password && (
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
            )
        )
    }

    return (
        <InputForm
            name="password"
            label='비밀번호'
            type='password'
            placeholder="비밀번호를 입력하세요 (8자 이상)"
            icon={<Lock />}
            apply={[<PassowrdStrengthMessage/>]}
        />
    );
}

export default SignupPasswordField;
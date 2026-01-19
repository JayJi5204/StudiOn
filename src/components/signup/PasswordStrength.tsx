import { Check } from "lucide-react";

const PasswordStrength = ({ strength, text, colorClass }) => {
  const criteria = [
    { key: 'length', label: '8자 이상' },
    { key: 'uppercase', label: '대문자 포함' },
    { key: 'number', label: '숫자 포함' },
    { key: 'special', label: '특수문자 포함' },
  ];

  return (
    <div className="mt-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-600">비밀번호 강도</span>
        <span className="text-sm font-medium text-gray-900">{text}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className={`h-2 rounded-full transition-all ${colorClass}`} 
          style={{ width: `${(Object.values(strength).filter(Boolean).length / 5) * 100}%` }}
        />
      </div>
      <div className="mt-2 space-y-1">
        {criteria.map((c) => (
          <div key={c.key} className={`text-xs flex items-center ${strength[c.key] ? 'text-green-600' : 'text-gray-400'}`}>
            {strength[c.key] ? <Check className="w-3 h-3 mr-1" /> : <X className="w-3 h-3 mr-1" />}
            {c.label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PasswordStrength
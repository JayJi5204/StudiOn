import React from 'react';
import { User } from 'lucide-react'; 

interface UserFieldProps {
  username: string;
  setUsername: (value: string) => void;
  errors: {
    username?: string;
  };
}

const UserField: React.FC<UserFieldProps> = ({ username, setUsername, errors }) => {
  return (
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
  );
};

export default UserField;
import React from 'react';
import { User } from 'lucide-react'; 
import InputForm from '../form/InputForm';

const UserField: React.FC = () => {
  return (
      <InputForm
        name='username'
        label='사용자명'
        placeholder='사용자명을 입력하세요'
        icon={<User />}
      />
  );
};

export default UserField;
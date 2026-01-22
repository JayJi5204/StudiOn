import { Lock } from 'lucide-react'; 
import InputForm from '../form/InputForm';

const PasswordField: React.FC = () => {

  return (
    <InputForm
      name="password"
      label="비밀번호"
      type="password"
      placeholder="비밀번호를 입력하세요"
      icon={<Lock />}
    />
  );
};

export default PasswordField;
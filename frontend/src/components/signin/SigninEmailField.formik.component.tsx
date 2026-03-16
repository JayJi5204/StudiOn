
import { Mail } from 'lucide-react'; 
import InputForm from '../form/InputForm';

const EmailField = () => {
  return (
      <InputForm
        name="email"
        label="이메일"
        type='email'
        placeholder="example@email.com"
        icon={<Mail/>}
      >
      </InputForm>
  );
};

export default EmailField;
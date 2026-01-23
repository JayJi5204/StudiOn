import InputForm from "../form/InputForm";
import { Mail } from "lucide-react";

const SignupEmailField:React.FC = () => {
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
}

export default SignupEmailField
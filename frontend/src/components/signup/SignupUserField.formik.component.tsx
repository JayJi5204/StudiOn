import { User } from "lucide-react";
import InputForm from "../form/InputForm";

const SignupUserField  = () => {
    return (
        <InputForm
            name="nickname"
            label="사용자명"
            type="text"
            placeholder="사용자명을 입력하세요"
            icon={<User/>}
        />
    );
}

export default SignupUserField
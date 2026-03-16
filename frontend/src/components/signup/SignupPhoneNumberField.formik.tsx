import InputForm from "../form/InputForm";
import { BookUser } from "lucide-react";

const SignupPhoneNumberField = () => {
    return (
        <InputForm
            name="phoneNumber"
            label="휴대폰 번호"
            type='text'
            placeholder="01012345678"
            icon={<BookUser />}
        >
        </InputForm>
    );
}

export default SignupPhoneNumberField
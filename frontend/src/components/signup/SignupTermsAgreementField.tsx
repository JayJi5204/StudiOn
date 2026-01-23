import CheckboxForm from "../form/CheckboxForm";

const SignupTermsAgreementField:React.FC = () => {

    return (
        <CheckboxForm
            name="agreeTerms"
            label="[필수] 이용약관에 동의합니다."
        />
    );
}

export default SignupTermsAgreementField
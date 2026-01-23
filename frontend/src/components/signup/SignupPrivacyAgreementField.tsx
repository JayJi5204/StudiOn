import CheckboxForm from "../form/CheckboxForm"

const SignupPrivacyAgreementField:React.FC = () => {
    return (
        <CheckboxForm
            name="agreePrivacy"
            label="[필수] 개인정보 수집에 동의합니다."
        />
    )
}

export default SignupPrivacyAgreementField
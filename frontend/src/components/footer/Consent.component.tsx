const Consent = () => {

    const TERMS_URL = "/terms";
    const PRIVACY_URL = "/privacy";

    return (
        <footer className="text-center mt-8 text-sm text-gray-500">
            <p>
                회원가입 시{' '}
                <a href={TERMS_URL} className="text-indigo-600 hover:text-indigo-500">이용약관</a>
                {' 및 '}
                <a href={PRIVACY_URL} className="text-indigo-600 hover:text-indigo-500">개인정보처리방침</a>
                에 동의하는 것으로 간주됩니다.
            </p>
        </footer>
    );
}

export default Consent
import React,{ useEffect} from "react";
import { useNavigate } from "react-router";

const GoogleCallback:React.FC = () => {
    const redirectUrl = import.meta.env.VITE_REACT_APP_URL
    const navigate = useNavigate();
    // 전역 상태 업데이트 함수
    // const {signin} = useUserStore();

    useEffect(() => {
        //URL에서 code 파라미터 추출
        const code = new URLSearchParams(window.location.search).get("code");
        if (code) {
            // 1. 백엔드로 인가 코드를 보냅니다.
            // axios.post('/api/auth/google/callback', { code })
            //   .then((response) => {
            
            // --- 백엔드 처리 성공 가정 (예시) ---
            console.log("인증 코드 전송 성공:", code);
            
            // 2. 성공했으므로 리다이렉션을 수행합니다.
            handleNavigation(true); 
            
            //   })
            //   .catch((err) => {
            //     console.error("로그인 실패", err);
            //     navigate("/signin"); // 실패 시 로그인 페이지로 반려
            //   });
        }
    }, [navigate]); // navigate를 의존성 배열에 추가

    // 리다이렉션 로직을 담당하는 함수
    const handleNavigation = (isSuccess: boolean) => {
        if (isSuccess) {
            // 3. 페이지 이동
            navigate(redirectUrl);
            
            // 참고: SPA(React)에서는 window.location.reload()를 가급적 피하는 것이 좋습니다.
            // 상태 관리가 초기화되기 때문입니다. 만약 반드시 새로고침이 필요하다면 사용하세요.
            // window.location.reload(); 
        }
    };

    return (
        <>
        </>
    )
}

export default GoogleCallback;
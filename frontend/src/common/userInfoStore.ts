import { create } from 'zustand';


const initialUserInfo = {
    id: 1,
    username: '스터디마스터',
    email: 'study@example.com',
    bio: '함께 성장하는 것을 좋아하는 개발자입니다. 꾸준한 학습과 공유를 통해 더 나은 개발자가 되고자 노력하고 있습니다.',
    location: '서울, 대한민국',
    joinDate: '2024년 1월',
    role: '일반',
    avatar: '👨‍💻' // Emoji placeholder for avatar
};

// create 함수를 사용하여 스토어의 상태와 액션을 정의합니다.
// set 함수를 사용하여 상태를 업데이트합니다.
const useUserInfoStore = create((set) => ({
    // 상태 (State)
    userInfo: initialUserInfo,

    // 액션 (Actions)

    /**
     * 전체 사용자 정보를 새로운 객체로 대체하여 업데이트합니다.
     * @param {Object} newUserInfo - 새로운 사용자 정보 객체
     */
    setUserInfo: (newUserInfo) => set({ userInfo: newUserInfo }),

    /**
     * 사용자 정보 객체의 특정 필드(key)만 업데이트합니다.
     * @param {string} key - 업데이트할 필드 이름 ('username', 'email', 'bio' 등)
     * @param {*} value - 해당 필드의 새로운 값
     */
    
    updateUserInfo: (key, value) => set((state) => ({
        userInfo: {
            ...state.userInfo, // 기존 userInfo 상태 복사
            [key]: value,       // 특정 필드만 새로운 값으로 덮어쓰기
        }
    })),

    /**
     * (예시) 아바타만 빠르게 변경하는 함수
     * @param {string} newAvatar - 새로운 아바타 문자열 (이모지 등)
     */
    updateAvatar: (newAvatar) => set((state) => ({
        userInfo: {
            ...state.userInfo,
            avatar: newAvatar,
        }
    })),
}));

export default useUserInfoStore;
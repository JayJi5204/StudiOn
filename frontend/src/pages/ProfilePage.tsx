import React,{ useState} from 'react';
import { useNavigate } from 'react-router';
import { authService } from '../services/auth.service';
import { usePosts } from '../hooks/usePosts';
import useUserInfoStore from '../store/userInfoStore';
import MyPostsContent from '../components/profile/MyPostsContent';
import { TabButton } from '../components/button/TabButton';
import { QuickActionButton } from '../components/button/QuickActionButton';
import {
    User,
    Mail,
    Calendar,
    MapPin,
    Edit2,
    Settings,
    Bell,
    LogOut,
    Camera,
    Save,
    X,
    TrendingUp,
    Bookmark,
    Award,
    Clock,
    Users,
} from 'lucide-react';
import type { IUser } from '../types/user.type';

interface StudyProgressBarProps {
    progress:number,
}

// 스터디 진행도 바 컴포넌트
const StudyProgressBar = ({ 
    progress 
}: StudyProgressBarProps ) => {
    const getColor = (p:number) => {
        if (p === 100) return 'bg-green-500';
        if (p > 70) return 'bg-blue-500';
        if (p > 40) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    return (
        <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
                className={`h-2.5 rounded-full ${getColor(progress)} transition-all duration-500`}
                style={{ width: `${progress}%` }}
            ></div>
        </div>
    );
};


// 메인 컴포넌트
const ProfilePage = () => {
    let navigate = useNavigate();

    const {userInfo,setUserInfo} = useUserInfoStore();
    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState<string>('overview');
    const [editForm,setEditForm] = useState<IUser>(userInfo);
    const { posts } = usePosts(
            { page: 1, limit: 10 },
            Boolean(userInfo.loggedin)
        );
    
    // 사용자 정보
    // 통계 정보
    const stats = {
        studiesJoined: 12,
        studiesCompleted: 8,
        totalPosts: 45,
        totalLikes: 234
    };

    // 업적 목록
    const achievements = [
        { id: 1, icon: '🏆', title: '첫 스터디 완주', date: '2024-02-15', color: 'bg-yellow-100 text-yellow-600' },
        { id: 2, icon: '🎯', title: '10개 스터디 참여', date: '2024-05-20', color: 'bg-blue-100 text-blue-600' },
        { id: 3, icon: '⭐', title: '인기 게시글 작성자', date: '2024-08-10', color: 'bg-purple-100 text-purple-600' },
        { id: 4, icon: '💪', title: '100일 연속 출석', date: '2024-09-01', color: 'bg-green-100 text-green-600' }
    ];

    // 내 스터디 목록
    const myStudies = [
        {
            id: 1,
            title: 'React 마스터하기',
            category: '개발',
            status: '진행 중',
            progress: 75,
            members: 12,
            NextSession: '2024-10-20 20:00',
            image: '🚀'
        },
        {
            id: 2,
            title: 'TOEIC 900점 도전',
            category: '어학',
            status: '진행 중',
            progress: 60,
            members: 8,
            NextSession: '2024-10-19 07:00',
            image: '📚',
        },
        {
            id: 3,
            title: '알고리즘 스터디',
            category: '개발',
            status: '완료',
            progress: 100,
            members: 15,
            NextSession: null,
            image: '💻'
        }
    ];
    
    // 입력 필드 변경 핸들러
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setEditForm(prev => ({ ...prev, [name]: value }));
    };

    // 저장 핸들러
    const handleSave = () => {
        setUserInfo(editForm);
        setIsEditing(false);
    };

    // 취소 핸들러
    const handleCancel = () => {
        setEditForm(userInfo);
        setIsEditing(false);
    };

    // 개요 탭 컨텐츠: 최근 활동 Placeholder
    const OverviewContent = () => (
        <div className='space-y-6'>
            <div className='bg-white rounded-2xl shadow-lg p-6'>
                <h3 className='flex items-center text-xl font-bold text-gray-900 mb-4'>
                    <TrendingUp className='w-5 h-5 mr-2 text-indigo-600' />
                    최근 활동
                </h3>
                <div className='space-y-4 text-gray-700'>
                    <div className='p-3 bg-indigo-50 rounded-xl border border-indigo-100'>
                        <span className='font-semibold text-indigo-600'>2024-10-18</span>: 'React 마스터하기' 스터디에서 새로운 게시글 작성.
                    </div>
                    <div className='p-3 bg-green-50 rounded-xl border border-green-100'>
                        <span className='font-semibold text-green-600'>2024-10-15</span>: '알고리즘 스터디'의 마지막 과제를 제출하고 스터디 완료.
                    </div>
                    <div className='p-3 bg-gray-50 rounded-xl border border-gray-100'>
                        <span className='font-semibold text-gray-600'>2024-10-12</span>: 게시글 '알고리즘 문제 풀이 팁 공유합니다'에 5개 이상의 좋아요 획득.
                    </div>
                </div>
                <button className='mt-4 text-indigo-600 font-medium hover:text-indigo-800 transition-colors text-sm'>
                    전체 활동 내역 보기 &rarr;
                </button>
            </div>
        </div>
    );

    // 내 스터디 탭 컨텐츠
    const StudiesContent = () => (
        <div className='space-y-4'>
            {myStudies.map((study) => (
                <div key={study.id} className='bg-white rounded-2xl shadow-lg p-5 flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-5 transition-transform duration-300 hover:shadow-xl hover:scale-[1.01]'>
                    <div className='text-3xl p-3 bg-gray-100 rounded-lg'>{study.image}</div>
                    <div className='flex-1 min-w-0'>
                        <h4 className='text-lg font-semibold text-gray-900 truncate'>{study.title}</h4>
                        <div className='flex items-center space-x-3 text-sm text-gray-500 mt-1'>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                study.status === '완료' ? 'bg-green-100 text-green-700' : 'bg-indigo-100 text-indigo-700'
                            }`}>
                                {study.status}
                            </span>
                            <span className='flex items-center'><Users className='w-3 h-3 mr-1'/> {study.members}명</span>
                            <span className='flex items-center'><Bookmark className='w-3 h-3 mr-1'/> {study.category}</span>
                        </div>
                    </div>
                    
                    <div className='w-full sm:w-48 space-y-2'>
                        <div className='flex justify-between text-sm font-medium text-gray-600'>
                            <span>진행도</span>
                            <span className='text-indigo-600'>{study.progress}%</span>
                        </div>
                        <StudyProgressBar progress={study.progress} />
                        {study.NextSession && (
                            <div className='flex items-center text-xs text-gray-500'>
                                <Clock className='w-3 h-3 mr-1'/>
                                다음 세션: {study.NextSession.split(' ')[0]}
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );

    

    // 업적 탭 컨텐츠
    const AchievementsContent = () => (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4'>
            {achievements.map((achievement) => (
                <div key={achievement.id} className={`p-5 rounded-2xl shadow-lg ${achievement.color} flex items-center space-x-4 transition-transform duration-300 hover:scale-[1.03]`}>
                    <div className='text-3xl'>{achievement.icon}</div>
                    <div>
                        <h4 className='font-bold text-gray-900'>{achievement.title}</h4>
                        <p className='text-sm text-gray-600'>획득일: {achievement.date}</p>
                    </div>
                    <Award className='w-5 h-5 ml-auto opacity-50'/>
                </div>
            ))}
        </div>
    );
    
    const renderTabContent = () => {
        switch (activeTab) {
            case 'overview':
                return <OverviewContent />;
            case 'studies':
                return <StudiesContent />;
            case 'posts':
                return <MyPostsContent
                            myPosts={posts}  // 위에서 선언한 posts 변수
                            userId={Number(userInfo.id)}  // 현재 컨텍스트의 userId 변수
                        />
            case 'achievements':
                return <AchievementsContent />;
            default:
                return null;
        }
    };

    return (
        <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 font-sans'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
                <h1 className='text-3xl font-extrabold text-gray-900 mb-8 sm:mb-10 text-center lg:text-left'>
                    {userInfo.username} 님의 프로필
                </h1>
                <div className='grid lg:grid-cols-3 gap-8'>
                    {/* Left Sidebar - Profile Card */}
                    <div className='lg:col-span-1'>
                        <div className='bg-white rounded-3xl shadow-2xl shadow-indigo-200/50 p-6 sticky top-8'>
                            {/* Profile Picture & Edit Form */}
                            <div className='text-center mb-6'>
                                <div className='relative inline-block'>
                                    <div className='w-32 h-32 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-6xl mb-4 shadow-lg ring-4 ring-indigo-300/50'>
                                        {userInfo.avatar}
                                    </div>
                                    <button className='absolute bottom-4 right-0 bg-white p-2 rounded-full shadow-xl hover:bg-gray-50 transition-colors border border-gray-100'>
                                        <Camera className='w-5 h-5 text-gray-600' />
                                    </button>
                                </div>

                                {!isEditing ? (
                                    <>
                                        <h2 className='text-2xl font-bold text-gray-900 mt-2 mb-1'>{userInfo.username}</h2>
                                        <p className='text-gray-600 mb-4 px-2 italic text-sm'>{userInfo.bio}</p>
                                        {/* User Information */}
                                        <div className='space-y-4 border-t border-gray-200 pt-6 pb-6'>
                                            <div className="flex items-center text-gray-700">
                                                <Mail className='w-5 h-5 mr-3 text-indigo-500' />
                                                <span className='text-sm font-medium'>{userInfo.email}</span>
                                            </div>
                                            <div className='flex items-center text-gray-700'>
                                                <MapPin className='w-5 h-5 mr-3 text-indigo-500' />
                                                <span className='text-sm font-medium'>{userInfo.location}</span>
                                            </div>
                                            <div className='flex items-center text-gray-700'>
                                                <Calendar className='w-5 h-5 mr-3 text-indigo-500' />
                                                <span className='text-sm font-medium'>가입일: {userInfo.joinDate}</span>
                                            </div>
                                            <div className='flex items-center text-gray-700'>
                                                <User className='w-5 h-5 mr-3 text-indigo-500' />
                                                <span className='text-sm font-medium'>권한: {userInfo.role}</span>
                                            </div>
                                        
                                        </div>
                                    </>
                                ) : (
                                    <div className="space-y-4 mb-4">
                                        <input
                                            type="text"
                                            name='username'
                                            value={editForm.username}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-100 text-lg font-medium"
                                            placeholder="사용자명"
                                        />
                                        <textarea
                                            name="bio"
                                            value={editForm.bio}
                                            // @ts-ignore
                                            onChange={handleInputChange} 
                                            rows={3}
                                            className='w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-100 text-sm'
                                            placeholder="소개"
                                        />
                                        <input
                                            name="email"
                                            value={editForm.email}
                                            onChange={handleInputChange}
                                            className='w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-100 text-sm'
                                            placeholder="이메일"
                                            >
                                        </input>
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className='space-y-4 border-t border-gray-200 pt-6'>
                                    {!isEditing ? (
                                        <button onClick={() => setIsEditing(true)}
                                            className='w-full bg-indigo-600 text-white py-3 px-4 rounded-xl hover:bg-indigo-700 transition-colors flex items-center justify-center space-x-2 font-semibold shadow-md hover:shadow-lg'
                                        >
                                            <Edit2 className='w-5 h-5' />
                                            <span>프로필 수정</span>
                                        </button>
                                    ) : (
                                        <div className='flex space-x-3'>
                                            <button
                                                onClick={handleSave}
                                                className='flex-1 bg-green-500 text-white py-3 px-4 rounded-xl hover:bg-green-600 transition-colors flex items-center justify-center space-x-2 font-semibold shadow-md'
                                            >
                                                <Save className='w-5 h-5' />
                                                <span>저장</span>
                                            </button>
                                            <button
                                                onClick={handleCancel}
                                                className='flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-xl hover:bg-gray-300 transition-colors flex items-center justify-center space-x-2 font-semibold shadow-md'
                                            >
                                                <X className="w-5 h-5" />
                                                <span>취소</span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            

                            {/* Stats */}
                            <div className='grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-200'>
                                <StatItem value={stats.studiesJoined} label='참여 스터디' color='text-indigo-600' />
                                <StatItem value={stats.studiesCompleted} label='완료 스터디' color='text-green-600' />
                                <StatItem value={stats.totalPosts} label='작성 글' color='text-purple-600' />
                                <StatItem value={stats.totalLikes} label='받은 좋아요' color='text-pink-600' />
                            </div>

                            {/* Quick Actions */}
                            <div className='space-y-2 mt-6 pt-6 border-t border-gray-200'>
                                <QuickActionButton icon={<Settings/>} label='설정' />
                                <QuickActionButton icon={<Bell/>} label='알림' />
                                <button
                                    onClick={() => {
                                        authService.logout(userInfo).then(() => {
                                            setUserInfo({
                                                ...userInfo,
                                                loggedin: false,
                                            });
                                            navigate('/');
                                            });
                                        navigate('/');
                                    }}
                                    className='w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors font-medium'
                                >
                                    <LogOut className="w-5 h-5" />
                                    <span>로그아웃</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className='lg:col-span-2 space-y-6'>
                        {/* Tabs */}
                        <div className='bg-white rounded-3xl shadow-lg p-3 sm:p-6'>
                            <div className='flex space-x-2 sm:space-x-4 border-b border-gray-200 overflow-x-auto whitespace-nowrap'>
                                {['overview', 'studies', 'posts', 'achievements'].map((tab) => (
                                    <TabButton
                                        key={tab}
                                        tabKey={tab}
                                        activeTab={activeTab}
                                        setActiveTab={setActiveTab}
                                        label={
                                            tab === 'overview' ? '개요' : 
                                            tab === 'studies' ? '내 스터디' :
                                            tab === 'posts' ? '작성글' : '업적'
                                        }
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Tab Contents */}
                        <div className='min-h-[50vh]'>
                            {renderTabContent()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


interface StatsItemProps {
    value:number, 
    label:string, 
    color:string,
};
// 보조 컴포넌트: 통계 항목
const StatItem = ({ 
    value, 
    label, 
    color 
}:StatsItemProps) => (
    <div className='text-center p-2 bg-gray-50 rounded-xl shadow-inner'>
        <div className={`text-2xl font-extrabold ${color}`}>{value}</div>
        <div className='text-sm text-gray-600 font-medium'>{label}</div>
    </div>
);

export default ProfilePage;
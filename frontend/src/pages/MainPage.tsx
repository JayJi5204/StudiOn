import { useState } from 'react';
import { Search, Users, Calendar, Star,ChevronRight, Heart, MessageCircle } from 'lucide-react';

const MainPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('전체');
  
  const categories = ['전체', '개발', '언어', '자격증', '취업준비', '독서', '기타'];
  
  const popularStudies = [
    {
      id: 1,
      title: 'React 마스터하기',
      category: '개발',
      members: 12,
      maxMembers: 15,
      rating: 4.8,
      schedule: '매주 화/목 20:00',
      leader: '김개발',
      image: '🚀',
      tags: ['React', 'JavaScript', '프론트엔드']
    },
    {
      id: 2,
      title: 'TOEIC 900점 도전',
      category: '언어',
      members: 8,
      maxMembers: 10,
      rating: 4.9,
      schedule: '매일 오전 7:00',
      leader: '박영어',
      image: '📚',
      tags: ['TOEIC', '영어', '자격증']
    },
    {
      id: 3,
      title: '정보처리기사 합격반',
      category: '자격증',
      members: 20,
      maxMembers: 25,
      rating: 4.7,
      schedule: '매주 월/수/금 19:00',
      leader: '이자격',
      image: '💻',
      tags: ['정보처리기사', 'IT', '자격증']
    },
    {
      id: 4,
      title: '독서 토론 클럽',
      category: '독서',
      members: 6,
      maxMembers: 8,
      rating: 4.6,
      schedule: '매주 일 14:00',
      leader: '최독서',
      image: '📖',
      tags: ['독서', '토론', '인문학']
    }
  ];

  const stats = {
    totalStudies: 1247,
    totalMembers: 8934,
    completedStudies: 432,
    avgRating: 4.7
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            함께 성장하는 
            <span className="text-indigo-600 block">온라인 스터디</span>
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            목표를 공유하고, 동기부여를 받으며, 함께 성취해나가는 스터디 플랫폼입니다.
            전국의 스터디 메이트들과 온라인으로 만나보세요.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="관심있는 스터디를 검색해보세요..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-lg"
              />
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <button className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition-all transform hover:scale-105 flex items-center">
              <Search className="mr-2" size={20} />
              스터디 찾기
            </button>
            <button className="bg-white text-indigo-600 border-2 border-indigo-600 px-8 py-3 rounded-lg hover:bg-indigo-50 transition-all transform hover:scale-105 flex items-center">
              <Users className="mr-2" size={20} />
              스터디 만들기
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-3xl font-bold text-indigo-600">{stats.totalStudies.toLocaleString()}</div>
              <div className="text-gray-600">활성 스터디</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-indigo-600">{stats.totalMembers.toLocaleString()}</div>
              <div className="text-gray-600">참여 멤버</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-indigo-600">{stats.completedStudies}</div>
              <div className="text-gray-600">완주한 스터디</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-indigo-600">{stats.avgRating}</div>
              <div className="text-gray-600">평균 평점</div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">카테고리별 스터디</h2>
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-3 rounded-full transition-all ${
                selectedCategory === category
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-300'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      {/* Popular Studies */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">인기 스터디</h2>
          <button className="text-indigo-600 hover:text-indigo-700 flex items-center">
            더보기 <ChevronRight className="ml-1" size={20} />
          </button>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
          {popularStudies.map((study) => (
            <div key={study.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="text-4xl">{study.image}</div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{study.title}</h3>
                    <div className="flex items-center text-sm text-gray-500">
                      <Users size={16} className="mr-1" />
                        {study.members}/{study.maxMembers}명
                      <Star size={16} className="ml-3 mr-1 fill-yellow-400 text-yellow-400" />
                        {study.rating}
                    </div>
                  </div>
                </div>
                <Heart className="text-gray-300 hover:text-red-500 cursor-pointer" size={24} />
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center text-gray-600">
                  <Calendar size={16} className="mr-2" />
                  {study.schedule}
                </div>
                <div className="flex items-center text-gray-600">
                  <Users size={16} className="mr-2" />
                  스터디장: {study.leader}
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {study.tags.map((tag, index) => (
                    <span key={index} className="px-3 py-1 bg-indigo-100 text-indigo-600 text-sm rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="flex space-x-3 pt-4">
                  <button className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors">
                    참여하기
                  </button>
                  <button className="flex-1 border border-gray-300 text-gray-600 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center">
                    <MessageCircle size={16} className="mr-1" />
                    문의하기
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            지금 바로 스터디를 시작하세요!
          </h2>
          <p className="text-xl text-indigo-100 mb-8">
            혼자서는 어려웠던 목표도 함께라면 달성할 수 있습니다.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-indigo-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
              내 스터디 만들기
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-indigo-600 transition-colors">
              스터디 둘러보기
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MainPage;
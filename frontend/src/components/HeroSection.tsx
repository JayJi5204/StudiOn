import { useState } from "react";
import { Search,Users } from "lucide-react";

export default function HeroSection() {
    const [searchTerm, setSearchTerm] = useState('');
    return (
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
    );
  }
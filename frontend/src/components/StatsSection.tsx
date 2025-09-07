import React,{useState} from "react";

type State = {
    totalStudies: number,
    totalMembers: number,
    completedStudies: number,
    avgRating: number,
};

export default function StatsSection() {
    
    const [stats, setStats] = useState<State>({
        totalStudies: 1247,
        totalMembers: 8934,
        completedStudies: 432,
        avgRating: 4.7,
    });
    
    return (
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
    )
}
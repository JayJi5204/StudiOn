import React,{useState} from "react";

export default function CategorySection () {
    const categories = ['전체', '개발', '언어', '자격증', '취업준비', '독서', '기타'];
    const [selectedCategory, setSelectedCategory] = useState('전체');

    return (
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
    )
}
export default function Call2ActionSection(){
  
  return(
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
  )
}
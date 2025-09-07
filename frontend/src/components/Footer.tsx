import { BookOpen } from "lucide-react"

export default function Footer() {

    return (
        <footer className="bg-gray-800 text-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-4 gap-8">
                <div>
                <div className="text-2xl font-bold mb-4 flex items-center">
                    <BookOpen className="mr-2" />
                    StudyTogether
                </div>
                <p className="text-gray-300">함께 성장하는 온라인 스터디 플랫폼</p>
                </div>
                <div>
                <h4 className="font-semibold mb-4">서비스</h4>
                <ul className="space-y-2 text-gray-300">
                    <li><a href="#" className="hover:text-white">스터디 찾기</a></li>
                    <li><a href="#" className="hover:text-white">스터디 만들기</a></li>
                    <li><a href="#" className="hover:text-white">커뮤니티</a></li>
                </ul>
                </div>
                <div>
                <h4 className="font-semibold mb-4">지원</h4>
                <ul className="space-y-2 text-gray-300">
                    <li><a href="#" className="hover:text-white">고객센터</a></li>
                    <li><a href="#" className="hover:text-white">이용가이드</a></li>
                    <li><a href="#" className="hover:text-white">FAQ</a></li>
                </ul>
                </div>
                <div>
                <h4 className="font-semibold mb-4">회사</h4>
                <ul className="space-y-2 text-gray-300">
                    <li><a href="#" className="hover:text-white">회사소개</a></li>
                    <li><a href="#" className="hover:text-white">개인정보처리방침</a></li>
                    <li><a href="#" className="hover:text-white">이용약관</a></li>
                </ul>
                </div>
            </div>
            <div className="border-t border-gray-600 mt-8 pt-8 text-center text-gray-300">
                <p>&copy; 2024 StudyTogether. All rights reserved.</p>
            </div>
            </div>
        </footer>
    )
}
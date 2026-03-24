import {useState } from 'react';
import { Link} from 'react-router';
import { 
    Search, 
    Plus, 
    MessageCircle, 
    ThumbsUp, 
    TrendingUp,
    Filter, 
    ChevronDown 
} from 'lucide-react';
import useUserInfoStore from '../store/userInfoStore';
import { usePosts } from '../hooks/usePosts';
import PostSection from '../components/communityboard/PostSection';

const CommunityBoard= () => {
    const isLoggedin = useUserInfoStore((state) => state.userInfo.isLoggedin);
    const { posts,setPosts } = usePosts(
            { page: 1, limit: 10 },
            Boolean(isLoggedin)
        );
    
    
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('전체');
    const [sortBy, setSortBy] = useState('latest');
    const [showSortMenu, setShowSortMenu] = useState(false);

    //activeMembers 추후 수정 
    const activeMembers = 8934;
    const writePostPageUrl = import.meta.env.VITE_REACT_APP_URL_WRITE_POST;
    const categories = ['전체', '자유토론', '스터디 후기', '질문답변', '정보공유', '취미생활'];
    
    const filteredPosts = posts.filter(post => {
        const matchesCategory = selectedCategory === '전체' || post.category === selectedCategory;
        const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
                              
        return matchesCategory && matchesSearch;
    });
    
    const sortedPosts = [...filteredPosts].sort((a, b) => {
        switch(sortBy) {
            case 'popular':
                return b.likes - a.likes;
            case 'views':
                return b.views - a.views;
            case 'comments':
                return b.comments.length - a.comments.length;
            default:
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
    });

    const popularPosts = sortedPosts.slice(0,3);

    const getSortLabel = () => {
        switch(sortBy) {
            case 'popular': return '인기순';
            case 'views': return '조회순';
            case 'comments': return '댓글순';
            default: return '최신순';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Header */}
        <header className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900">자유게시판</h1>
                    <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2">
                    <Plus size={20} />
                    <Link to={writePostPageUrl}>
                        <span>글쓰기</span>
                    </Link>
                    </button>
                </div>
            </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid lg:grid-cols-4 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-3 space-y-6">
                {/* Search and Filter */}
                <div className="bg-white rounded-xl shadow-md p-6">
                <div className="space-y-4">
                    {/* Search Bar */}
                    <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="게시글을 검색해보세요..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                    </div>

                    {/* Categories */}
                    <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                                selectedCategory === category
                                ? 'bg-indigo-600 text-white shadow-md'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            {category}
                        </button>
                    ))}
                    </div>

                    {/* Sort Options */}
                    <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-600">
                            총 <span className="font-semibold text-indigo-600">{filteredPosts.length}</span>개의 게시글
                        </p>
                    <div className="relative">
                        <button
                            onClick={() => setShowSortMenu(!showSortMenu)}
                            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                        <Filter size={16} />
                        <span className="text-sm">{getSortLabel()}</span>
                        <ChevronDown size={16} />
                        </button>
                        {showSortMenu && (
                        <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                            {[
                                { value: 'latest', label: '최신순' },
                                { value: 'popular', label: '인기순' },
                                { value: 'views', label: '조회순' },
                                { value: 'comments', label: '댓글순' }
                            ].map(option => (
                            <button
                                key={option.value}
                                onClick={() => {
                                    setSortBy(option.value);
                                    setShowSortMenu(false);
                                }}
                                className={`w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors ${
                                sortBy === option.value ? 'text-indigo-600 font-medium' : 'text-gray-700'
                                }`}
                            >
                                {option.label}
                            </button>
                            ))}
                        </div>
                        )}
                    </div>
                    </div>
                </div>
                </div>

                {/* Posts List */}
                <div className="space-y-4">
                    <PostSection
                        posts={sortedPosts}
                        setPosts={setPosts}
                    ></PostSection>
                </div>

                    {/* Pagination */}
                    <div className="flex justify-center space-x-2 pt-6">
                        {[1, 2, 3, 4, 5].map((page) => (
                            <button
                                key={page}
                                className={`w-10 h-10 rounded-lg transition-colors ${
                                    page === 1
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-white text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                            {page}
                        </button>
                    ))}
                </div>
            </div>

                {/* Sidebar */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Popular Posts */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                            <TrendingUp className="mr-2 text-orange-500" size={20} />
                            인기 게시글
                        </h3>
                        <div className="space-y-4">
                            {popularPosts.map((post, index) => (
                            <div key={post.id} className="pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                                <div className="flex items-start space-x-2">
                                <span className="flex-shrink-0 w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                    {index + 1}
                                </span>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-semibold text-gray-900 hover:text-indigo-600 cursor-pointer line-clamp-2">
                                    {post.title}
                                    </h4>
                                    <div className="flex items-center space-x-2 mt-2 text-xs text-gray-500">
                                    <span className="flex items-center">
                                        <ThumbsUp size={12} className="mr-1" />
                                        {post.likes}
                                    </span>
                                    <span className="flex items-center">
                                        <MessageCircle size={12} className="mr-1" />
                                        {post.comments.length}
                                    </span>
                                    </div>
                                </div>
                                </div>
                            </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">게시판 통계</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">전체 게시글</span>
                                <span className="text-lg font-bold text-indigo-600">{posts.length > 0 && posts.length}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">활성 회원</span>
                                <span className="text-lg font-bold text-blue-600">{activeMembers}</span>
                            </div>
                        </div>
                    </div>

                        {/* Board Rules */}
                        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">게시판 이용 규칙</h3>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li className="flex items-start">
                            <span className="text-indigo-600 mr-2">•</span>
                            서로 존중하는 댓글 문화
                            </li>
                            <li className="flex items-start">
                            <span className="text-indigo-600 mr-2">•</span>
                            욕설 및 비방 금지
                            </li>
                            <li className="flex items-start">
                            <span className="text-indigo-600 mr-2">•</span>
                            광고성 게시글 제한
                            </li>
                            <li className="flex items-start">
                            <span className="text-indigo-600 mr-2">•</span>
                            주제와 맞는 카테고리 선택
                            </li>
                        </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CommunityBoard;
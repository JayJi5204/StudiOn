import { useState } from 'react';
import { X,FileText, Save, Eye, ChevronDown } from 'lucide-react';
import { postService } from '../services/posts.service';
import { useLocation,useNavigate } from 'react-router';
import useUserInfoStore from '../store/userInfoStore';
import type { IPost } from '../types/posts.type';

const WritePostPage = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const editData = location.state as IPost;
    const isEditMode = !!editData;
    const {userInfo} = useUserInfoStore();

    const [title, setTitle] = useState(editData?.title || '');
    const [content, setContent] = useState(editData?.content || '');
    const [selectedCategory, setSelectedCategory] = useState(editData?.category || '');
    const [tags, setTags] = useState<string[]>(editData?.tags || []);

    const [tagInput, setTagInput] = useState('');
    const [showCategoryMenu, setShowCategoryMenu] = useState(false);
    const [isPreview, setIsPreview] = useState(false);

    const communityPageUrl = import.meta.env.VITE_REACT_APP_URL_BOARD;
    const categories = ['자유토론', '스터디 후기', '질문답변', '정보공유', '취미생활'];
    
    const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && tagInput.trim() !== '') {
            e.preventDefault();
            if (tags.length < 5 && !tags.includes(tagInput.trim())) {
                setTags([...tags, tagInput.trim()]);
                setTagInput('');
            }
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    const handleSubmit = async () => {
        if (!title.trim() || !content.trim() || !selectedCategory) {
            alert('제목, 내용, 카테고리를 모두 입력해주세요.');
            return;
        }

        try {

            if (isEditMode) {
                //게시글 수정 로직 추가
                const res = await postService.updatePost(
                    editData.id,
                    {
                        title,
                        content,
                        category: selectedCategory,
                        tags,
                    }, 
                )
                alert('게시글이 수정되었습니다!');
                navigate(communityPageUrl);
                console.log("수정 성공:", res);
            } else {
                
                // 게시글 저장 로직 추가
                const res = await postService.createPost(
                    userInfo.id,
                    {
                        title,
                        content,
                        category: selectedCategory,
                        tags,
                    }, 
                );
                console.log("작성 성공:", res);
                alert('게시글이 작성되었습니다!');
                navigate(communityPageUrl);
            }
        } catch (error) { 
            console.error("저장 실패:", error);
            alert('저장에 실패했습니다.');
        }

    };

    const handleCancel = () => {
        if (confirm('작성을 취소하시겠습니까? 작성 중인 내용은 저장되지 않습니다.')) {
            setTitle('');
            setContent('');
            setSelectedCategory('');
            setTags([]);
            setTagInput('');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            {/* Header */}
            <header className="bg-white shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold text-gray-900">글쓰기</h1>
                        <button 
                            onClick={handleCancel}
                            className="text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>
                </div>
            </header>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-xl shadow-md p-6 md:p-8 space-y-6">
                    {/* Category Selection */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            카테고리 <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <button
                                onClick={() => setShowCategoryMenu(!showCategoryMenu)}
                                className={`w-full md:w-64 flex items-center justify-between px-4 py-3 border rounded-lg transition-all ${
                                    selectedCategory 
                                        ? 'border-indigo-500 bg-indigo-50' 
                                        : 'border-gray-300 bg-white hover:border-gray-400'
                                }`}
                            >
                                <span className={selectedCategory ? 'text-gray-900 font-medium' : 'text-gray-500'}>
                                    {selectedCategory || '카테고리를 선택하세요'}
                                </span>
                                <ChevronDown size={20} className="text-gray-400" />
                            </button>
                            {showCategoryMenu && (
                                <div className="absolute top-full left-0 mt-2 w-full md:w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                                    {categories.map((category) => (
                                        <button
                                            key={category}
                                            onClick={() => {
                                                setSelectedCategory(category);
                                                setShowCategoryMenu(false);
                                            }}
                                            className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors ${
                                                selectedCategory === category 
                                                    ? 'text-indigo-600 font-medium bg-indigo-50' 
                                                    : 'text-gray-700'
                                            }`}
                                        >
                                            {category}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Title Input */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            제목 <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="제목을 입력하세요"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            maxLength={100}
                        />
                        <div className="flex justify-end mt-1">
                            <span className="text-xs text-gray-500">{title.length}/100</span>
                        </div>
                    </div>

                    {/* Content Input */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            내용 <span className="text-red-500">*</span>
                        </label>
                        {!isPreview ? (
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="내용을 입력하세요&#10;&#10;• 서로 존중하는 댓글 문화를 지켜주세요&#10;• 욕설 및 비방은 금지됩니다&#10;• 광고성 게시글은 제한됩니다"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                                rows={12}
                            />
                        ) : (
                            <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 min-h-[300px] whitespace-pre-wrap">
                                {content || <span className="text-gray-400">내용을 입력하세요</span>}
                            </div>
                        )}
                        <div className="flex justify-between items-center mt-2">
                            <button
                                onClick={() => setIsPreview(!isPreview)}
                                className="flex items-center space-x-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                            >
                                <Eye size={16} />
                                <span>{isPreview ? '편집 모드' : '미리보기'}</span>
                            </button>
                            <span className="text-xs text-gray-500">{content.length}자</span>
                        </div>
                    </div>

                    {/* Tags Input */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            태그 <span className="text-xs text-gray-500">(최대 5개)</span>
                        </label>
                        <div className="space-y-3">
                            <input
                                type="text"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={handleAddTag}
                                placeholder="태그를 입력하고 Enter를 누르세요"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                disabled={tags.length >= 5}
                            />
                            {tags.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {tags.map((tag, index) => (
                                        <span
                                            key={index}
                                            className="inline-flex items-center px-3 py-1 bg-indigo-100 text-indigo-600 rounded-full text-sm"
                                        >
                                            #{tag}
                                            <button
                                                onClick={() => handleRemoveTag(tag)}
                                                className="ml-2 hover:text-indigo-800"
                                            >
                                                <X size={14} />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-gray-200"></div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <FileText size={16} />
                            <span>작성 중인 내용은 자동 저장되지 않습니다</span>
                        </div>
                        <div className="flex space-x-3 w-full sm:w-auto">
                            <button
                                onClick={handleCancel}
                                className="flex-1 sm:flex-none px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                            >
                                취소
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="flex-1 sm:flex-none px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium flex items-center justify-center space-x-2"
                            >
                                <Save size={20} />
                                <span>작성 완료</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Writing Tips */}
                <div className="mt-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">글쓰기 팁</h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                        <li className="flex items-start">
                            <span className="text-indigo-600 mr-2">•</span>
                            제목은 핵심 내용을 잘 나타내도록 작성하세요
                        </li>
                        <li className="flex items-start">
                            <span className="text-indigo-600 mr-2">•</span>
                            적절한 카테고리를 선택하면 더 많은 분들이 볼 수 있어요
                        </li>
                        <li className="flex items-start">
                            <span className="text-indigo-600 mr-2">•</span>
                            태그를 활용하면 검색이 더 쉬워집니다
                        </li>
                        <li className="flex items-start">
                            <span className="text-indigo-600 mr-2">•</span>
                            서로 존중하는 커뮤니티 문화를 만들어가요
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default WritePostPage;
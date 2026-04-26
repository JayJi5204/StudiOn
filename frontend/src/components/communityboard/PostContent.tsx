interface PostContentProps {
  content: string;
  tags: string[];
}

const PostContent = ({ content, tags }: PostContentProps) => {
  return (
    <>
      {/* 본문 */}
      <div className="prose max-w-none mb-8">
        <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
          {content}
        </div>
      </div>

      {/* 태그 */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full hover:bg-gray-200 cursor-pointer transition-colors"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </>
  );
};

export default PostContent;
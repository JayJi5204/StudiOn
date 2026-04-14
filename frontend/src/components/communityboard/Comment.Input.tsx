import { useState } from 'react';

interface CommentInputProps {
    onSubmit: (content: string) => void;
    placeholder?: string;
    buttonLabel?: string;
}

const CommentInput = ({
    onSubmit,
    placeholder = '댓글을 입력하세요...',
    buttonLabel = '댓글 작성',
}: CommentInputProps) => {
    const [text, setText] = useState('');

    const handleSubmit = () => {
        if (!text.trim()) return;
        onSubmit(text);
        setText('');
    };

    return (
        <div className="mb-8">
            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={placeholder}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                rows={3}
            />
            <div className="flex justify-end mt-2">
                <button
                    onClick={handleSubmit}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                >
                    {buttonLabel}
                </button>
            </div>
        </div>
    );
};

export default CommentInput;
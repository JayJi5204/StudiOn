import {Edit,Trash2,Flag} from 'lucide-react';

interface EditButtonProps {
    handleEdit: () => void;
    handleDelete: () => void;
}

const EditButton = ({
    handleDelete,
    handleEdit
}:EditButtonProps) => {

    return (
        <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
            <button 
                className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors flex items-center space-x-2 text-gray-700"
                onClick={handleEdit}
            >
                <Edit size={16} />
                <span>수정</span>
            </button>
            <button 
                className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors flex items-center space-x-2 text-gray-700"
                onClick={handleDelete}  
            >
                <Trash2 size={16} />
                <span>삭제</span>
            </button>
            <button className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors flex items-center space-x-2 text-gray-700">
                <Flag size={16} />
                <span>신고</span>
            </button>
        </div>
    )
}

export default EditButton
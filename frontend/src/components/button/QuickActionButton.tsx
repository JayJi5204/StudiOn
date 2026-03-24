import React from "react";

interface QuickActionButtonProps {
    icon:React.ReactElement; 
    label:string; 
}

// 보조 컴포넌트: 빠른 실행 버튼
export const QuickActionButton = ({ 
    icon, 
    label 
}:QuickActionButtonProps) => (
    <button className='w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-indigo-50 rounded-xl transition-colors font-medium'>
        {/* <icon className="w-5 h-5 text-indigo-500" /> */}
        {React.cloneElement(icon)}
        <span>{label}</span>
    </button>
);
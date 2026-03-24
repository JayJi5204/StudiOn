interface TabButtonProps {
    tabKey:string;
    activeTab:string;
    setActiveTab:React.Dispatch<React.SetStateAction<string>>;
    label:string;
}

// 보조 컴포넌트: 탭 버튼
export const TabButton = ({ 
    tabKey, 
    activeTab, 
    setActiveTab, 
    label 
}:TabButtonProps) => (
    <button
        onClick={() => setActiveTab(tabKey)}
        className={`pb-3 px-3 sm:px-4 font-bold text-sm sm:text-base transition-colors duration-200 border-b-2 ${
            activeTab === tabKey
                ? 'text-indigo-600 border-indigo-600'
                : 'text-gray-600 border-transparent hover:border-gray-300 hover:text-gray-900'
        } whitespace-nowrap`}
    >
        {label}
    </button>
);
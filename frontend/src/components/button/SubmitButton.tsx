import React from 'react';
import { useFormikContext } from 'formik';
import { Loader2, ArrowRight } from 'lucide-react';

interface ButtonProps {
  label: string;      
  loadingText: string;
}

// 컴포넌트 내부에서 사용할 작은 UI 조각들
const LoadingSpinner = ({ text }: { text: string }) => (
  <>
    <Loader2 className="w-5 h-5 animate-spin" />
    <span>{text}</span>
  </>
);

const LoadingComplete = ({ text }: { text: string }) => (
  <>
    <span>{text}</span>
    <ArrowRight className="w-5 h-5" />
  </>
);

const SubmitButton: React.FC<ButtonProps> = ({ label, loadingText }) => {

  const { isSubmitting, isValid, dirty } = useFormikContext();

  const isDisabled = isSubmitting || !(isValid && dirty);

  return (
    <button
      type="submit"
      disabled={isDisabled}
      className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
    >
      {isSubmitting ? (
        <LoadingSpinner text={loadingText} />
      ) : (
        <LoadingComplete text={label} />
      )}
    </button>
  );
};

export default SubmitButton;
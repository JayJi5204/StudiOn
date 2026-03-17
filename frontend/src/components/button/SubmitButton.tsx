import { useFormikContext } from 'formik';
import { LoadingSpinner,LoadingComplete } from '../../common/Spinner';
import { Loader2, ArrowRight } from 'lucide-react';

interface ButtonProps {
  label: string;    
  loadingText: string;
}

const SubmitButton = ({ label, loadingText }:ButtonProps) => {

  const { isSubmitting, isValid, dirty } = useFormikContext();

  const isDisabled = isSubmitting || !(isValid && dirty);

  return (
    <button
      type="submit"
      disabled={isDisabled}
      className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
    >
      {isSubmitting ? (
        <LoadingSpinner 
          text={loadingText}
          icon={<Loader2/>}
        />
      ) : (
        <LoadingComplete 
          text={label}
          icon={<ArrowRight/>}
        />
      )}
    </button>
  );
};

export default SubmitButton;
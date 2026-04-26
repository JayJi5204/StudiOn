import { useFormikContext } from 'formik';

const DAYS = ['월', '화', '수', '목', '금', '토', '일'];

interface DaysSelectorProps {
  name: string;
}

const DaysSelectButton = ({ name }: DaysSelectorProps) => {
  const { values, setFieldValue, errors, touched } = useFormikContext<Record<string, string[]>>();

  const selectedDays: string[] = values[name] ?? [];
  const hasError = !!(touched[name] && errors[name]);

  const toggleDay = (day: string) => {
    const next = selectedDays.includes(day)
      ? selectedDays.filter(d => d !== day)
      : [...selectedDays, day];
    setFieldValue(name, next);
  };

  return (
    <div>
      <div className="flex gap-2">
        {DAYS.map(day => (
          <button
            key={day}
            type="button"
            onClick={() => toggleDay(day)}
            className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all ${
              selectedDays.includes(day)
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-white text-gray-600 border border-gray-300 hover:border-indigo-400 hover:text-indigo-600'
            }`}
          >
            {day}
          </button>
        ))}
      </div>
      {hasError && (
        <p className="mt-2 text-sm text-red-600">{errors[name] as string}</p>
      )}
    </div>
  );
};

export default DaysSelectButton;
export const InputFormStyles = {
  label: "block text-sm font-medium text-gray-700 mb-2",
  wrapper: "relative",
  icon: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5",
  input: (hasError: boolean) => `
    w-full pl-12 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors
    ${hasError ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'}
  `,
  rightElement:"absolute right-3 top-1/2 -translate-y-1/2",
  error: "mt-2 text-sm text-red-600"
};
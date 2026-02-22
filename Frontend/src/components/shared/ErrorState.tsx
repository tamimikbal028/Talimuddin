import { IoWarning } from "react-icons/io5";

interface ErrorStateProps {
  message?: string;
}

const ErrorState = ({ message = "Something went wrong" }: ErrorStateProps) => {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center shadow-sm">
      <IoWarning className="mx-auto mb-3 h-12 w-12 text-red-600" />
      <p className="font-semibold text-red-800">{message}</p>

      <button
        className="mt-4 cursor-pointer rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:ring-2 focus:ring-gray-300 focus:outline-none"
        onClick={() => window.location.reload()}
      >
        Try Again
      </button>
    </div>
  );
};

export default ErrorState;

import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import type { AxiosError } from "axios";
import type { ApiError } from "../../../types";

interface GroupNotFoundProps {
  error?: AxiosError<ApiError> | Error | null;
}

function GroupNotFound({ error }: GroupNotFoundProps) {
  const navigate = useNavigate();

  let errorMessage =
    "This group may have been deleted, or the link might be broken. Please try again.";

  if (error) {
    if ("response" in error && error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.message) {
      errorMessage = error.message;
    }
  }

  return (
    <div className="flex w-full flex-col items-center justify-center">
      <div className="w-full rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm">
        {/* টেক্সট কন্টেন্ট */}
        <h2 className="mb-8 text-2xl font-bold text-gray-800">
          {errorMessage}
        </h2>

        {/* অ্যাকশন বাটনসমূহ */}
        <div className="flex gap-10">
          <button
            onClick={() => navigate(-1)}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-blue-600 px-6 py-3 font-medium text-gray-600 transition-colors hover:bg-gray-50"
          >
            <FaArrowLeft className="text-sm" />
            Back to Previous Page
          </button>
          <button
            onClick={() => navigate("/")}
            className="w-full rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition-all hover:bg-blue-700 active:scale-95"
          >
            Go to News Feed
          </button>
        </div>
      </div>
    </div>
  );
}

export default GroupNotFound;

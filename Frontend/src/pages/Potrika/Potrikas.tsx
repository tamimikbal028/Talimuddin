import { potrikaHooks } from "../../hooks/usePotrika";
import PotrikaCard from "../../components/Potrika/PotrikaCard";
import type { AxiosError } from "axios";
import type { ApiError } from "../../types";

const Potrikas = () => {
  const { data, isLoading, error } = potrikaHooks.useAllPotrikas();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-36 animate-pulse rounded-lg border border-gray-200 bg-gray-100"
          />
        ))}
      </div>
    );
  }

  if (error) {
    const axiosError = error as AxiosError<ApiError>;
    const errorMessage =
      axiosError.response?.data?.message ||
      error.message ||
      "Could not load publications";

    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-8 text-center shadow-sm">
        <p className="font-medium text-red-600">{errorMessage}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-3 text-sm text-red-500 underline hover:text-red-700"
        >
          Try again
        </button>
      </div>
    );
  }

  if (!data) return null;

  const { potrikas } = data;

  if (potrikas.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-12 text-center shadow-sm">
        <p className="text-gray-500">No publications found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {potrikas.map((potrika) => (
        <PotrikaCard key={potrika._id} potrika={potrika} />
      ))}
    </div>
  );
};

export default Potrikas;

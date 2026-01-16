import React from "react";

interface TuitionRequestFormProps {
  onSubmit: (formData: FormData) => void;
}

const TuitionRequestForm: React.FC<TuitionRequestFormProps> = ({
  onSubmit,
}) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(new FormData(e.currentTarget));
  };

  return (
    <div className="mx-auto w-full max-w-xl rounded-lg bg-white p-6 shadow">
      <h3 className="mb-4 text-lg font-semibold text-gray-900">
        Post Tuition Request
      </h3>
      <form onSubmit={handleSubmit} className="w-full space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Subjects (comma separated)
          </label>
          <input
            type="text"
            name="subjects"
            placeholder="Physics, Math, Chemistry"
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Level
          </label>
          <select
            name="level"
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
            required
          >
            <option value="">Select Level</option>
            <option value="HSC 1st Year">HSC 1st Year</option>
            <option value="HSC 2nd Year">HSC 2nd Year</option>
            <option value="SSC">SSC</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Location
          </label>
          <input
            type="text"
            name="location"
            placeholder="Dhanmondi, Dhaka"
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Salary (per month)
          </label>
          <input
            type="number"
            name="salary"
            placeholder="5000"
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Mode
          </label>
          <select
            name="mode"
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
          >
            <option value="Offline">Offline</option>
            <option value="Online">Online</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Tutor Gender Preference
          </label>
          <select
            name="tutorGender"
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
          >
            <option value="Any">Any</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Preferred University (optional)
          </label>
          <input
            type="text"
            name="preferredUniversity"
            placeholder="BUET, DU, etc."
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            name="description"
            placeholder="Describe your requirements..."
            rows={3}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
            required
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
          >
            Post Request
          </button>
        </div>
      </form>
    </div>
  );
};

export default TuitionRequestForm;

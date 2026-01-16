import React, { useState } from "react";

interface TuitionRequest {
  id: string;
  subjects: string[];
  level: string;
  location: string;
  salary: number;
  description: string;
  mode: "Online" | "Offline";
  student: {
    id: string;
    name: string;
    avatar: string;
  };
  postedDate: string;
}

const BecomeTutor: React.FC = () => {
  const [interestedRequests, setInterestedRequests] = useState<string[]>([]);

  // Dummy data for available requests
  const availableRequests: TuitionRequest[] = [
    {
      id: "1",
      subjects: ["Physics", "Math"],
      level: "HSC 1st Year",
      location: "Dhanmondi",
      salary: 8000,
      description:
        "Need help with Physics and Math for HSC preparation. Looking for an experienced tutor from BUET.",
      mode: "Offline",
      student: {
        id: "s1",
        name: "Ahmed Hassan",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ahmed",
      },
      postedDate: "2025-09-18",
    },
    {
      id: "2",
      subjects: ["Chemistry", "Biology"],
      level: "HSC 2nd Year",
      location: "Online",
      salary: 6000,
      description:
        "Final year HSC student needs intensive help with Chemistry and Biology.",
      mode: "Online",
      student: {
        id: "s2",
        name: "Fatima Khatun",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=fatima",
      },
      postedDate: "2025-09-19",
    },
    {
      id: "3",
      subjects: ["English", "ICT"],
      level: "HSC 1st Year",
      location: "Uttara",
      salary: 5000,
      description:
        "Need tutor for English and ICT subjects. Flexible timing required.",
      mode: "Offline",
      student: {
        id: "s3",
        name: "Karim Rahman",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=karim",
      },
      postedDate: "2025-09-20",
    },
  ];

  const handleShowInterest = (requestId: string) => {
    setInterestedRequests((prev) =>
      prev.includes(requestId)
        ? prev.filter((id) => id !== requestId)
        : [...prev, requestId]
    );
  };

  const isInterested = (requestId: string) =>
    interestedRequests.includes(requestId);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Tuitions</h2>
        <div className="text-sm text-gray-500">
          {availableRequests.length} requests available
        </div>
      </div>

      {/* Available Tuition Requests */}
      <div className="space-y-4">
        {availableRequests.length === 0 ? (
          <div className="rounded-lg bg-white p-8 text-center shadow-sm">
            <p className="text-gray-500">
              No tuition requests available at the moment.
            </p>
          </div>
        ) : (
          availableRequests.map((request) => (
            <div key={request.id} className="rounded-lg bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {/* Student Info */}
                  <div className="mb-3 flex items-center gap-3">
                    <img
                      src={request.student.avatar}
                      alt={request.student.name}
                      className="h-10 w-10 rounded-full"
                    />
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {request.student.name}
                      </h4>
                      <p className="text-sm text-gray-500">
                        Posted on{" "}
                        {new Date(request.postedDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Subjects */}
                  <div className="mb-2 flex flex-wrap gap-2">
                    {request.subjects.map((subject, index) => (
                      <span
                        key={index}
                        className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800"
                      >
                        {subject}
                      </span>
                    ))}
                  </div>

                  {/* Request Details */}
                  <h3 className="text-lg font-semibold text-gray-900">
                    {request.level} - {request.location}
                  </h3>
                  <p className="mt-2 text-gray-600">{request.description}</p>

                  {/* Request Info */}
                  <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
                    <span className="font-medium text-green-600">
                      💰 ৳{request.salary}/month
                    </span>
                    <span>📍 {request.mode}</span>
                    <span>📚 {request.level}</span>
                  </div>
                </div>

                {/* Action Button */}
                <div className="ml-4">
                  <button
                    onClick={() => handleShowInterest(request.id)}
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                      isInterested(request.id)
                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    {isInterested(request.id)
                      ? "✓ Interested"
                      : "Show Interest"}
                  </button>
                </div>
              </div>

              {/* Show interest confirmation */}
              {isInterested(request.id) && (
                <div className="mt-4 rounded-lg bg-green-50 p-3">
                  <div className="flex items-center gap-2 text-sm text-green-700">
                    <span>✓</span>
                    <span>
                      You've shown interest in this tuition. The student will
                      contact you soon!
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* My Applications Summary */}
      {interestedRequests.length > 0 && (
        <div className="rounded-lg bg-blue-50 p-4">
          <h3 className="font-medium text-blue-900">Your Applications</h3>
          <p className="text-sm text-blue-700">
            You've shown interest in {interestedRequests.length} tuition request
            {interestedRequests.length > 1 ? "s" : ""}. Students will contact
            you if they're interested in your profile.
          </p>
        </div>
      )}
    </div>
  );
};

export default BecomeTutor;

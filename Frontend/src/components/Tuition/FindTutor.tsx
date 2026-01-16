import React, { useState } from "react";
import TuitionRequestForm from "./TuitionRequestForm";

interface TuitionRequest {
  id: string;
  subjects: string[];
  level: string;
  location: string;
  salary: number;
  description: string;
  mode: "Online" | "Offline";
  tutorGender: "Any" | "Male" | "Female";
  preferredUniversity: string;
}

const FindTutor: React.FC = () => {
  const [requests, setRequests] = useState<TuitionRequest[]>([]);

  const handlePostRequest = (formData: FormData) => {
    const newRequest: TuitionRequest = {
      id: Date.now().toString(),
      subjects: formData.get("subjects")?.toString().split(",") || [],
      level: formData.get("level")?.toString() || "",
      location: formData.get("location")?.toString() || "",
      salary: Number(formData.get("salary")) || 0,
      description: formData.get("description")?.toString() || "",
      mode: (formData.get("mode") as "Online" | "Offline") || "Offline",
      tutorGender:
        (formData.get("tutorGender") as "Any" | "Male" | "Female") || "Any",
      preferredUniversity:
        formData.get("preferredUniversity")?.toString() || "",
    };
    setRequests((prev) => [newRequest, ...prev]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Find a Tutor</h2>
      </div>

      {/* Tuition Request Form Card */}
      <TuitionRequestForm onSubmit={handlePostRequest} />

      {/* My Posted Requests */}
      <div className="space-y-4">
        {requests.length === 0 ? (
          <div className="rounded-lg bg-white p-8 text-center shadow-sm">
            <p className="text-gray-500">
              You haven't posted any tuition requests yet.
            </p>
          </div>
        ) : (
          requests.map((request) => (
            <div key={request.id} className="rounded-lg bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex-1">
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
                  <h3 className="text-lg font-semibold text-gray-900">
                    {request.level} - {request.location}
                  </h3>
                  <p className="mt-2 text-gray-600">{request.description}</p>
                  <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
                    <span>💰 ৳{request.salary}/month</span>
                    <span>📍 {request.mode}</span>
                    <span>👨‍🏫 {request.tutorGender} tutor preferred</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">Posted just now</div>
                  <div className="mt-2 text-sm font-medium text-green-600">
                    0 tutors interested
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FindTutor;

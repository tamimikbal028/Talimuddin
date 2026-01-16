import React, { useState } from "react";

interface AcademicArenaProps {
  onBackToMenu: () => void;
}

type Role = "creator" | "challenger" | null;
type CreatorScreen = "hub" | "create_question";
type ChallengerScreen = "zone" | "quiz";

const AcademicArena: React.FC<AcademicArenaProps> = ({ onBackToMenu }) => {
  const [selectedRole, setSelectedRole] = useState<Role>(null);
  const [creatorScreen, setCreatorScreen] = useState<CreatorScreen>("hub");
  const [challengerScreen, setChallengerScreen] =
    useState<ChallengerScreen>("zone");

  const roleCards = [
    {
      role: "creator" as const,
      icon: "🎓",
      title: "Creator",
      subtitle: "University Student",
      description:
        "Create challenging questions for college students to solve. Show your expertise and help others learn.",
      color: "bg-blue-500",
      hoverColor: "hover:bg-blue-600",
      textColor: "text-blue-600",
    },
    {
      role: "challenger" as const,
      icon: "⚡",
      title: "Challenger",
      subtitle: "College Student",
      description:
        "Take on questions created by university students. Test your knowledge and climb the rankings.",
      color: "bg-purple-500",
      hoverColor: "hover:bg-purple-600",
      textColor: "text-purple-600",
    },
  ];

  const myQuestions = [
    {
      id: 1,
      subject: "Physics",
      question: "What is the speed of light?",
      attempted: 45,
      correct: 38,
    },
    {
      id: 2,
      subject: "Math",
      question: "Solve: ∫x²dx",
      attempted: 32,
      correct: 28,
    },
    {
      id: 3,
      subject: "Chemistry",
      question: "What is the pH of pure water?",
      attempted: 67,
      correct: 52,
    },
  ];

  if (!selectedRole) {
    return (
      <div className="p-8">
        {/* Back Button - Top Left */}
        <button
          onClick={onBackToMenu}
          className="mb-6 rounded-lg bg-gray-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-700"
        >
          ← Back to Games
        </button>

        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900">Academic Arena</h2>
            <p className="mt-2 text-gray-600">
              Choose your role in this academic challenge platform
            </p>
          </div>

          {/* Role Selection */}
          <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-2">
            {roleCards.map((card) => (
              <div
                key={card.role}
                onClick={() => setSelectedRole(card.role)}
                className="group cursor-pointer rounded-xl border-2 border-gray-200 bg-white p-8 shadow-sm transition-all duration-200 hover:scale-105 hover:border-gray-300 hover:shadow-lg"
              >
                <div className="text-center">
                  <div className="mb-4 text-6xl">{card.icon}</div>
                  <h3
                    className={`mb-1 text-2xl font-bold ${card.textColor} transition-transform group-hover:scale-105`}
                  >
                    {card.title}
                  </h3>
                  <p className="mb-4 text-sm font-medium text-gray-500">
                    {card.subtitle}
                  </p>
                  <p className="leading-relaxed text-gray-600">
                    {card.description}
                  </p>

                  <div
                    className={`mt-6 inline-flex items-center rounded-lg ${card.color} px-6 py-3 font-medium text-white ${card.hoverColor} transition-colors`}
                  >
                    Choose Role
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (selectedRole === "creator") {
    return (
      <div className="p-8">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Creator Hub</h2>
              <p className="text-gray-600">
                Manage your questions and track performance
              </p>
            </div>
            <button
              onClick={() => setSelectedRole(null)}
              className="rounded-lg bg-gray-600 px-4 py-2 text-white transition-colors hover:bg-gray-700"
            >
              ← Back
            </button>
          </div>

          {creatorScreen === "hub" && (
            <>
              {/* Action Button */}
              <div className="mb-8">
                <button
                  onClick={() => setCreatorScreen("create_question")}
                  className="w-full rounded-lg bg-blue-600 px-6 py-4 text-lg font-medium text-white transition-colors hover:bg-blue-700"
                >
                  ➕ Submit New Question
                </button>
              </div>

              {/* Pro Tips */}
              <div className="mb-8 rounded-lg border border-yellow-200 bg-yellow-50 p-6">
                <h3 className="mb-3 text-lg font-semibold text-yellow-800">
                  💡 Pro Tips
                </h3>
                <ul className="space-y-2 text-sm text-yellow-700">
                  <li>• Make questions challenging but fair</li>
                  <li>• Provide clear and concise wording</li>
                  <li>• Include relevant context when needed</li>
                  <li>• Higher difficulty questions earn more points</li>
                </ul>
              </div>

              {/* My Questions Performance */}
              <div className="rounded-lg bg-white shadow-sm">
                <div className="border-b border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Your Questions Performance
                  </h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {myQuestions.map((question) => (
                      <div
                        key={question.id}
                        className="rounded-lg border border-gray-200 p-4"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="mb-2 flex items-center space-x-2">
                              <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                                {question.subject}
                              </span>
                            </div>
                            <p className="font-medium text-gray-900">
                              {question.question}
                            </p>
                          </div>
                          <div className="ml-4 text-right">
                            <div className="text-sm text-gray-600">
                              <div>Attempted: {question.attempted}</div>
                              <div className="text-green-600">
                                Correct: {question.correct} (
                                {Math.round(
                                  (question.correct / question.attempted) * 100
                                )}
                                %)
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {creatorScreen === "create_question" && (
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Create New Question
                </h3>
                <button
                  onClick={() => setCreatorScreen("hub")}
                  className="text-gray-600 hover:text-gray-800"
                >
                  ← Back to Hub
                </button>
              </div>

              <form className="space-y-6">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Subject
                  </label>
                  <select className="w-full rounded-lg border border-gray-300 px-3 py-2">
                    <option>Physics</option>
                    <option>Mathematics</option>
                    <option>Chemistry</option>
                    <option>Biology</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Question
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Enter your question here..."
                    className="w-full rounded-lg border border-gray-300 px-3 py-2"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Answer
                  </label>
                  <input
                    type="text"
                    placeholder="Correct answer"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2"
                  />
                </div>

                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setCreatorScreen("hub")}
                    className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                  >
                    Submit Question
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Challenger Role
  return (
    <div className="p-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Challenge Zone</h2>
            <p className="text-gray-600">
              Test your knowledge against university-level questions
            </p>
          </div>
          <button
            onClick={() => setSelectedRole(null)}
            className="rounded-lg bg-gray-600 px-4 py-2 text-white transition-colors hover:bg-gray-700"
          >
            ← Back
          </button>
        </div>

        {challengerScreen === "zone" && (
          <>
            {/* Start Challenge Button */}
            <div className="mb-8">
              <button
                onClick={() => setChallengerScreen("quiz")}
                className="w-full rounded-lg bg-purple-600 px-6 py-4 text-lg font-medium text-white transition-colors hover:bg-purple-700"
              >
                ⚡ Start Challenge
              </button>
            </div>

            {/* Stats */}
            <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="rounded-lg bg-white p-6 text-center shadow-sm">
                <div className="text-2xl font-bold text-purple-600">47</div>
                <div className="text-sm text-gray-600">Questions Answered</div>
              </div>
              <div className="rounded-lg bg-white p-6 text-center shadow-sm">
                <div className="text-2xl font-bold text-green-600">85%</div>
                <div className="text-sm text-gray-600">Accuracy Rate</div>
              </div>
              <div className="rounded-lg bg-white p-6 text-center shadow-sm">
                <div className="text-2xl font-bold text-blue-600">#23</div>
                <div className="text-sm text-gray-600">Current Rank</div>
              </div>
            </div>

            {/* Recent Performance */}
            <div className="rounded-lg bg-white shadow-sm">
              <div className="border-b border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Recent Performance
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {[
                    "Physics - Wave Motion",
                    "Math - Calculus",
                    "Chemistry - Organic",
                  ].map((subject, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-lg border border-gray-200 p-3"
                    >
                      <span className="text-gray-900">{subject}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">8/10</span>
                        <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-800">
                          80%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {challengerScreen === "quiz" && (
          <div className="rounded-lg bg-white p-8 shadow-sm">
            <div className="mb-6 text-center">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm text-gray-600">Question 1 of 10</span>
                <span className="text-sm text-gray-600">Time: 45s</span>
              </div>
              <div className="h-2 rounded-full bg-gray-200">
                <div
                  className="h-2 rounded-full bg-purple-600"
                  style={{ width: "75%" }}
                ></div>
              </div>
            </div>

            <div className="text-center">
              <h3 className="mb-8 text-xl font-bold text-gray-900">
                What is the fundamental frequency of a string with length L,
                tension T, and mass density μ?
              </h3>

              <div className="mx-auto grid max-w-2xl grid-cols-1 gap-4">
                {[
                  "f = (1/2L)√(T/μ)",
                  "f = (1/L)√(T/μ)",
                  "f = (2/L)√(T/μ)",
                  "f = (1/4L)√(T/μ)",
                ].map((option, index) => (
                  <button
                    key={index}
                    className="rounded-lg border-2 border-gray-200 bg-gray-50 p-4 text-left transition-colors hover:border-purple-500 hover:bg-purple-50"
                  >
                    {option}
                  </button>
                ))}
              </div>

              <div className="mt-8 flex justify-center space-x-4">
                <button
                  onClick={() => setChallengerScreen("zone")}
                  className="rounded-lg bg-gray-600 px-6 py-2 text-white hover:bg-gray-700"
                >
                  Exit Quiz
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AcademicArena;

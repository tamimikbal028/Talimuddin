import React from "react";
import {
  FaCalendarPlus,
  FaGraduationCap,
  FaClipboardList,
  FaBookOpen,
  FaPencilAlt,
  FaCheckCircle,
  FaHeart,
  FaClock,
} from "react-icons/fa";

interface TimelineEvent {
  id: string;
  date: string; // human-friendly date string
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  iconBg: string;
}

const AcademicTimeline: React.FC = () => {
  const timelineEvents: TimelineEvent[] = [
    {
      id: "1",
      date: "December 15, 2025",
      title: "Course Registration Begins",
      description:
        "Online course registration portal opens. Consult your advisor.",
      icon: FaCalendarPlus,
      iconColor: "text-blue-600",
      iconBg: "bg-blue-100",
    },
    {
      id: "2",
      date: "August 25, 2024",
      title: "Classes Start",
      description:
        "First day of classes for the Fall 2024 semester. Welcome back!",
      icon: FaGraduationCap,
      iconColor: "text-green-600",
      iconBg: "bg-green-100",
    },
    {
      id: "3",
      date: "November 5, 2025",
      title: "Last Day for Course Withdrawal",
      description: "Last day to add or drop courses without penalty.",
      icon: FaClipboardList,
      iconColor: "text-purple-600",
      iconBg: "bg-purple-100",
    },
    {
      id: "4",
      date: "October 10, 2024",
      title: "Midterm Exams Begin",
      description:
        "Midterm examination period starts. Good luck with your studies!",
      icon: FaPencilAlt,
      iconColor: "text-orange-600",
      iconBg: "bg-orange-100",
    },
    {
      id: "5",
      date: "November 15, 2024",
      title: "Registration for Spring 2025",
      description: "Early registration opens for Spring 2025 semester.",
      icon: FaBookOpen,
      iconColor: "text-indigo-600",
      iconBg: "bg-indigo-100",
    },
    {
      id: "6",
      date: "December 20, 2024",
      title: "Final Exams",
      description: "Final examination period. Prepare well and stay focused!",
      icon: FaCheckCircle,
      iconColor: "text-red-600",
      iconBg: "bg-red-100",
    },
  ];

  // sort events by date (oldest first)
  const sortedEvents = timelineEvents
    .slice()
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // treat events strictly before today as completed (date-only comparison)
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  // split into upcoming (today and future) and past (before today)
  const upcoming = sortedEvents.filter((e) => {
    const d = new Date(e.date);
    d.setHours(0, 0, 0, 0);
    return d.getTime() >= todayStart.getTime();
  });
  const past = sortedEvents.filter((e) => {
    const d = new Date(e.date);
    d.setHours(0, 0, 0, 0);
    return d.getTime() < todayStart.getTime();
  });

  const displayList = [...upcoming, ...past];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="text-center">
        <h1 className="mb-2.5 text-4xl font-bold text-gray-800">
          Academic Timeline
        </h1>
        <p className="text-lg text-gray-600">
          Key dates and deadlines for the Fall 2024 semester.
        </p>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical Line */}
        <div className="absolute top-0 bottom-0 left-8 w-0.5 bg-gradient-to-b from-blue-200 via-purple-200 to-pink-200" />

        {/* Timeline Items */}
        <div className="space-y-8">
          {displayList.map((event) => {
            const evDate = new Date(event.date);
            evDate.setHours(0, 0, 0, 0);
            const isPast = evDate.getTime() < todayStart.getTime();

            // compute original index for alternating layout if needed
            const index = sortedEvents.findIndex((s) => s.id === event.id);

            const iconBgClass = isPast ? "bg-gray-100" : event.iconBg;
            const iconColorClass = isPast ? "text-gray-600" : event.iconColor;
            const dateBadgeClass = isPast
              ? "mb-3 inline-flex items-center rounded-full bg-gray-300 px-3 py-1 text-sm font-medium text-gray-800"
              : "mb-3 inline-flex items-center rounded-full bg-gradient-to-r from-blue-500 to-purple-500 px-3 py-1 text-sm font-medium text-white";

            return (
              <div key={event.id} className="group relative flex items-start">
                {/* Icon Container */}
                <div
                  className={`relative z-10 flex h-16 w-16 items-center justify-center rounded-full ${iconBgClass} border-4 ${isPast ? "border-white" : "border-green-500"} shadow-lg transition-transform duration-300`}
                >
                  <event.icon className={`h-6 w-6 ${iconColorClass}`} />
                  {isPast && (
                    <div className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-green-500">
                      <FaCheckCircle className="h-3 w-3 text-white" />
                    </div>
                  )}
                </div>

                {/* Content Card */}
                <div
                  className={`ml-8 flex-1 ${index % 2 === 0 ? "md:mr-8" : "md:ml-16"}`}
                >
                  <div
                    className={`rounded-2xl border border-gray-100 bg-white p-6 shadow-lg transition-all duration-300 ${isPast ? "" : "hover:-translate-y-1 hover:shadow-xl"}`}
                  >
                    {/* Date Badge */}
                    <div className={dateBadgeClass}>
                      <FaClock className="mr-2 h-3 w-3" />
                      {event.date}
                    </div>

                    {/* Event Title */}
                    <h3 className="mb-2 text-xl font-bold text-gray-800">
                      {event.title}
                    </h3>

                    {/* Event Description */}
                    <p className="leading-relaxed text-gray-600">
                      {event.description}
                    </p>

                    {/* Status Indicator */}
                    {isPast && (
                      <div className="mt-4 inline-flex items-center text-sm font-medium text-gray-600">
                        <FaCheckCircle className="mr-2 h-4 w-4 text-gray-600" />
                        Completed
                      </div>
                    )}
                  </div>
                </div>

                {/* Connecting Line */}
                <div
                  className={`absolute top-8 left-16 h-0.5 w-8 ${
                    isPast
                      ? "bg-green-200"
                      : index % 2 === 0
                        ? "bg-gradient-to-r from-blue-200 to-transparent"
                        : "bg-gradient-to-r from-transparent to-purple-200"
                  } hidden md:block`}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-10 text-center">
        <div className="inline-flex items-center rounded-full border border-gray-100 bg-white px-6 py-3 shadow-lg">
          <FaHeart className="mr-2 h-5 w-5 text-red-500" />
          <span className="font-medium text-gray-700">
            Stay organized and achieve your academic goals!
          </span>
        </div>
      </div>
    </div>
  );
};

export default AcademicTimeline;

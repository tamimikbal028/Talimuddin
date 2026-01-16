import React, { useState } from "react";
import {
  FaBullhorn,
  FaExclamationCircle,
  FaInfoCircle,
  FaCheckCircle,
  FaSearch,
} from "react-icons/fa";

interface Notice {
  id: number;
  title: string;
  content: string;
  date: string;
  type: "important" | "general" | "urgent" | "success";
  category: string;
  department: string;
  postedBy: string;
}

const InstitutionNoticeBoard: React.FC = () => {
  const [selectedType, setSelectedType] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const types = ["All", "Urgent", "Important", "General", "Success"];

  const notices: Notice[] = [
    {
      id: 1,
      title: "Midterm Examination Schedule Published",
      content:
        "The midterm examination schedule for Fall 2025 has been published. Students are advised to check the schedule on the departmental website and prepare accordingly.",
      date: "Oct 1, 2025",
      type: "important",
      category: "Academics",
      department: "All Departments",
      postedBy: "Academic Office",
    },
    {
      id: 2,
      title: "Emergency - Campus Closed Tomorrow",
      content:
        "Due to severe weather conditions, the institution campus will remain closed tomorrow (Oct 3, 2025). All classes and examinations scheduled for that day are postponed.",
      date: "Oct 2, 2025",
      type: "urgent",
      category: "Emergency",
      department: "All Departments",
      postedBy: "Administration",
    },
    {
      id: 3,
      title: "New Library Books Available",
      content:
        "The central library has received a new collection of textbooks and reference materials. Students can now borrow these books using their library cards.",
      date: "Sep 28, 2025",
      type: "general",
      category: "Library",
      department: "All Departments",
      postedBy: "Central Library",
    },
    {
      id: 4,
      title: "Course Registration Deadline Extended",
      content:
        "Good news! The course registration deadline has been extended until Oct 10, 2025. Students who missed the earlier deadline can now register for their courses.",
      date: "Sep 25, 2025",
      type: "success",
      category: "Registration",
      department: "All Departments",
      postedBy: "Registrar Office",
    },
    {
      id: 5,
      title: "Campus Maintenance Notice",
      content:
        "Scheduled maintenance work will be carried out in the Engineering Building on Oct 5, 2025. Some areas will be temporarily inaccessible. Please plan accordingly.",
      date: "Sep 20, 2025",
      type: "general",
      category: "Maintenance",
      department: "Engineering",
      postedBy: "Facilities Management",
    },
    {
      id: 6,
      title: "Scholarship Applications Now Open",
      content:
        "Applications for merit-based scholarships for the Spring 2026 semester are now open. Eligible students should submit their applications by Oct 15, 2025.",
      date: "Sep 15, 2025",
      type: "important",
      category: "Financial Aid",
      department: "All Departments",
      postedBy: "Financial Aid Office",
    },
    {
      id: 7,
      title: "Student ID Card Renewal",
      content:
        "All final year students must renew their student ID cards before graduation. The renewal process is available at the Student Affairs Office.",
      date: "Sep 10, 2025",
      type: "general",
      category: "Administration",
      department: "All Departments",
      postedBy: "Student Affairs",
    },
    {
      id: 8,
      title: "Internet Service Restored",
      content:
        "The campus-wide internet connectivity issue has been resolved. All students and staff can now access the institution network without any problems.",
      date: "Sep 8, 2025",
      type: "success",
      category: "IT Services",
      department: "All Departments",
      postedBy: "IT Department",
    },
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "urgent":
        return <FaExclamationCircle className="h-5 w-5" />;
      case "important":
        return <FaInfoCircle className="h-5 w-5" />;
      case "success":
        return <FaCheckCircle className="h-5 w-5" />;
      default:
        return <FaBullhorn className="h-5 w-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "urgent":
        return "border-red-500 bg-red-50 text-red-700";
      case "important":
        return "border-blue-500 bg-blue-50 text-blue-700";
      case "success":
        return "border-green-500 bg-green-50 text-green-700";
      default:
        return "border-gray-500 bg-gray-50 text-gray-700";
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case "urgent":
        return "bg-red-500";
      case "important":
        return "bg-blue-500";
      case "success":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const filteredNotices = notices.filter((notice) => {
    const matchesType =
      selectedType === "All" || notice.type === selectedType.toLowerCase();
    const matchesSearch =
      notice.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notice.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Notice Board</h1>
          <p className="mt-2 text-lg text-gray-600">
            Stay updated with the latest announcements and notifications
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {/* Search */}
          <div className="relative max-w-md flex-1">
            <FaSearch className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search notices..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white py-3 pr-4 pl-12 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-2 overflow-x-auto rounded-xl border border-gray-200 bg-white p-2 shadow-sm">
            {types.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`rounded-lg px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedType === type
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Notices List */}
        <div className="space-y-4">
          {filteredNotices.map((notice) => (
            <div
              key={notice.id}
              className={`overflow-hidden rounded-xl border-l-4 shadow-sm transition-all hover:shadow-md ${getTypeColor(notice.type)}`}
            >
              <div className="bg-white p-6">
                <div className="flex items-start justify-between">
                  <div className="flex flex-1 items-start gap-4">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-full ${getTypeBadgeColor(notice.type)} text-white`}
                    >
                      {getTypeIcon(notice.type)}
                    </div>

                    <div className="flex-1">
                      <div className="mb-2 flex items-center gap-3">
                        <h3 className="text-xl font-bold text-gray-900">
                          {notice.title}
                        </h3>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold uppercase ${getTypeBadgeColor(notice.type)} text-white`}
                        >
                          {notice.type}
                        </span>
                      </div>

                      <p className="mb-3 leading-relaxed text-gray-700">
                        {notice.content}
                      </p>

                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-700">
                            Date:
                          </span>
                          <span>{notice.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-700">
                            Category:
                          </span>
                          <span>{notice.category}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-700">
                            Department:
                          </span>
                          <span>{notice.department}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-700">
                            Posted by:
                          </span>
                          <span>{notice.postedBy}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredNotices.length === 0 && (
          <div className="py-16 text-center">
            <FaBullhorn className="mx-auto mb-4 h-16 w-16 text-gray-400" />
            <h3 className="mb-2 text-xl font-semibold text-gray-900">
              No notices found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InstitutionNoticeBoard;

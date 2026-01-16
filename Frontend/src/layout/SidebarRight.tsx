import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUsers,
  FaCalendarAlt,
  FaBirthdayCake,
  FaGlobe,
  FaChevronRight,
  FaPoll,
  FaBullhorn,
} from "react-icons/fa";
import {
  mockSuggestedConnections,
  mockUpcomingEvents,
} from "./data/rightSidebarData";
import DailyXPClaimMini from "../components/Gaming/shared/DailyXPClaimMini";

const SidebarRight: React.FC = () => {
  const navigate = useNavigate();

  const suggestedConnections = mockSuggestedConnections;
  const upcomingEvents = mockUpcomingEvents;

  // CR Corner Quick Links Data
  const crCornerPolls = [
    {
      id: 1,
      question: "Do you support the new midterm exam schedule?",
      totalVotes: 80,
      date: "2 hours ago",
    },
  ];

  const crCornerAnnouncements = [
    {
      id: 1,
      title: "Class Representative Meeting",
      date: "Oct 5, 2025",
      postedBy: "Tamim Ahmed (CR)",
    },
    {
      id: 2,
      title: "Circuit Analysis Notes - Shared by Sir",
      date: "Oct 3, 2025",
      postedBy: "Sadia Rahman (CR)",
    },
    {
      id: 3,
      title: "Assignment Deadline Extended",
      date: "Oct 2, 2025",
      postedBy: "Tamim Ahmed (CR)",
    },
  ];

  const quickLinks = [
    { name: "Developer Tools", icon: FaGlobe },
    { name: "Community Guidelines", icon: FaUsers },
    { name: "Help Center", icon: FaGlobe },
    { name: "Privacy Policy", icon: FaGlobe },
  ];

  return (
    <div className="h-full space-y-3 overflow-y-auto bg-blue-50 p-3">
      {/* Daily XP Claim Mini - Show on all pages, auto-hide after claim */}
      <DailyXPClaimMini />

      {/* Active Polls */}
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <div className="border-b border-gray-100 p-4">
          <div className="flex items-center">
            <FaPoll className="mr-2 h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">
              Active Polls
            </h2>
          </div>
        </div>
        <div className="divide-y divide-gray-100">
          {crCornerPolls.map((poll) => (
            <div
              key={poll.id}
              className="cursor-pointer p-4 transition-colors hover:bg-gray-50"
              onClick={() => navigate("/cr-corner")}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {poll.question}
                  </p>
                  <div className="mt-2 flex items-center gap-3 text-xs text-gray-500">
                    <span>{poll.totalVotes} votes</span>
                    <span>•</span>
                    <span>{poll.date}</span>
                  </div>
                </div>
                <FaChevronRight className="ml-2 h-3 w-3 flex-shrink-0 text-gray-400" />
              </div>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-100 p-3">
          <button
            onClick={() => navigate("/cr-corner")}
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            View all polls
          </button>
        </div>
      </div>

      {/* Recent Announcements */}
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <div className="border-b border-gray-100 p-4">
          <div className="flex items-center">
            <FaBullhorn className="mr-2 h-5 w-5 text-orange-500" />
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Announcements
            </h2>
          </div>
        </div>
        <div className="divide-y divide-gray-100">
          {crCornerAnnouncements.map((announcement) => (
            <div
              key={announcement.id}
              className="cursor-pointer p-4 transition-colors hover:bg-gray-50"
              onClick={() => navigate("/cr-corner")}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {announcement.title}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    By {announcement.postedBy}
                  </p>
                  <p className="mt-1 text-xs text-gray-400">
                    {announcement.date}
                  </p>
                </div>
                <FaChevronRight className="ml-2 h-3 w-3 flex-shrink-0 text-gray-400" />
              </div>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-100 p-3">
          <button
            onClick={() => navigate("/cr-corner")}
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            View all announcements
          </button>
        </div>
      </div>

      {/* Suggested Connections */}
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <div className="border-b border-gray-100 p-4">
          <div className="flex items-center">
            <FaUsers className="mr-2 h-5 w-5 text-blue-500" />
            <h2 className="text-lg font-semibold text-gray-900">
              Who to follow
            </h2>
          </div>
        </div>
        <div className="divide-y divide-gray-100">
          {suggestedConnections.map((person, index) => (
            <div key={index} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <img
                    src={person.avatar}
                    alt={person.name}
                    className="h-10 w-10 rounded-full bg-gray-300"
                  />
                  <div className="ml-3">
                    <div className="flex items-center">
                      <p className="text-sm font-medium text-gray-900">
                        {person.name}
                      </p>
                      {person.isVerified && (
                        <div className="ml-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-500">
                          <span className="text-xs text-white">✓</span>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">@{person.username}</p>
                    <p className="text-xs text-gray-400">
                      {person.mutualConnections} mutual connections
                    </p>
                  </div>
                </div>
                <button className="rounded-full bg-blue-600 px-4 py-1 text-xs font-medium text-white transition-colors hover:bg-blue-700">
                  Follow
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-100 p-3">
          <button className="text-sm font-medium text-blue-600 hover:text-blue-700">
            Show more suggestions
          </button>
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <div className="border-b border-gray-100 p-4">
          <div className="flex items-center">
            <FaCalendarAlt className="mr-2 h-5 w-5 text-green-500" />
            <h2 className="text-lg font-semibold text-gray-900">
              Upcoming Events
            </h2>
          </div>
        </div>
        <div className="divide-y divide-gray-100">
          {upcomingEvents.map((event, index) => (
            <div
              key={index}
              className="cursor-pointer p-4 transition-colors hover:bg-gray-50"
            >
              <div className="flex items-center">
                <img
                  src={event.image}
                  alt={event.title}
                  className="h-12 w-12 rounded-lg bg-gray-300 object-cover"
                />
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {event.title}
                  </p>
                  <p className="text-xs text-gray-500">{event.date}</p>
                  <p className="text-xs text-gray-400">
                    {event.attendees} attendees
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-100 p-3">
          <button className="text-sm font-medium text-blue-600 hover:text-blue-700">
            Discover more events
          </button>
        </div>
      </div>

      {/* Birthdays */}
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <div className="border-b border-gray-100 p-4">
          <div className="flex items-center">
            <FaBirthdayCake className="mr-2 h-5 w-5 text-pink-500" />
            <h2 className="text-lg font-semibold text-gray-900">Birthdays</h2>
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-center">
            <img
              src="https://ui-avatars.com/api/?name=Alex+Johnson&background=3b82f6&color=fff&size=32"
              alt="Birthday person"
              className="h-8 w-8 rounded-full bg-gray-300"
            />
            <div className="ml-3">
              <p className="text-sm text-gray-700">
                <span className="font-medium">Alex Thompson</span> and{" "}
                <span className="font-medium">2 others</span> have birthdays
                today
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <div className="border-b border-gray-100 p-4">
          <h2 className="text-lg font-semibold text-gray-900">Quick Links</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {quickLinks.map((link, index) => (
            <a
              key={index}
              href="#"
              className="flex items-center px-4 py-3 transition-colors hover:bg-gray-50"
            >
              <link.icon className="mr-3 h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-700">{link.name}</span>
              <FaChevronRight className="ml-auto h-3 w-3 text-gray-400" />
            </a>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <div className="space-y-2 text-xs text-gray-500">
          <p>© 2025 Bidda. All rights reserved.</p>
          <div className="flex flex-wrap gap-x-3 gap-y-1">
            <a href="#" className="hover:text-gray-700">
              Privacy
            </a>
            <a href="#" className="hover:text-gray-700">
              Terms
            </a>
            <a href="#" className="hover:text-gray-700">
              Cookies
            </a>
            <a href="#" className="hover:text-gray-700">
              Help
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidebarRight;

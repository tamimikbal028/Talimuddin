import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaBriefcase,
  FaUsers,
  FaUniversity,
  FaNewspaper,
  FaGraduationCap,
  FaMapMarkedAlt,
} from "react-icons/fa";

interface UniversityResource {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  link: string;
  iconColor: string;
  iconBg: string;
}

const InstitutionMore: React.FC = () => {
  const universityResources: UniversityResource[] = [
    {
      id: "1",
      title: "Institution News",
      description: "Latest updates and official announcements",
      icon: FaNewspaper,
      link: "institution-news",
      iconColor: "text-violet-600",
      iconBg: "bg-violet-100",
    },
    {
      id: "2",
      title: "Library Portal",
      description: "Access digital resources and catalogs",
      icon: FaUniversity,
      link: "library-portal",
      iconColor: "text-orange-600",
      iconBg: "bg-orange-100",
    },
    {
      id: "3",
      title: "Clubs & Communities",
      description: "Join student organizations",
      icon: FaUsers,
      link: "clubs",
      iconColor: "text-green-600",
      iconBg: "bg-green-100",
    },
    {
      id: "4",
      title: "Faculty Directory",
      description: "Find contact info and office hours",
      icon: FaGraduationCap,
      link: "faculty-directory",
      iconColor: "text-teal-600",
      iconBg: "bg-teal-100",
    },
    {
      id: "5",
      title: "Career Services",
      description: "Internships and job opportunities",
      icon: FaBriefcase,
      link: "career-services",
      iconColor: "text-blue-600",
      iconBg: "bg-blue-100",
    },
    {
      id: "6",
      title: "Campus Map",
      description: "Navigate buildings and facilities",
      icon: FaMapMarkedAlt,
      link: "campus-map",
      iconColor: "text-indigo-600",
      iconBg: "bg-indigo-100",
    },
  ];

  return (
    <div className="mx-auto min-h-screen max-w-7xl space-y-5">
      {/* Header */}
      <div>
        <h1 className="mb-2 text-3xl font-bold text-gray-900">
          More Institution Resources
        </h1>
        <p className="text-gray-600">
          Explore additional services and resources available.
        </p>
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
        {universityResources.map((resource) => (
          <NavLink
            key={resource.id}
            to={resource.link}
            className="group flex flex-col items-center rounded-xl border border-gray-200 bg-white p-3 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg"
          >
            {/* Icon */}
            <div
              className={`inline-flex h-12 w-12 items-center justify-center rounded-lg ${resource.iconBg} mb-4 transition-transform duration-300 group-hover:scale-110`}
            >
              <resource.icon className={`h-6 w-6 ${resource.iconColor}`} />
            </div>

            {/* Content */}
            <div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900 transition-colors group-hover:text-blue-600">
                {resource.title}
              </h3>
              <p className="text-sm leading-relaxed text-gray-600">
                {resource.description}
              </p>
            </div>

            {/* Arrow indicator */}
            <div className="mt-4 opacity-100 transition-opacity duration-300 group-hover:opacity-100">
              <div className="inline-flex items-center text-sm font-medium text-blue-600">
                <span>Learn more</span>
                <svg
                  className="ml-1 h-4 w-4 transform transition-transform group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          </NavLink>
        ))}
      </div>

      {/* Footer Note */}
      <div className="text-center">
        <div className="inline-flex items-center rounded-lg border border-gray-200 bg-white px-6 py-3 shadow-sm">
          <FaUniversity className="mr-2 h-5 w-5 text-blue-600" />
          <span className="font-medium text-gray-700">
            Need help? Contact Institution Support
          </span>
        </div>
      </div>
    </div>
  );
};

export default InstitutionMore;

import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaHeartbeat,
  FaMapMarkedAlt,
  FaNewspaper,
  FaDollarSign,
} from "react-icons/fa";

interface MoreResource {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  link: string;
  iconColor: string;
  iconBg: string;
}

const More: React.FC = () => {
  const moreResources: MoreResource[] = [
    {
      id: "1",
      title: "Blood Donation",
      description: "Find donors & save lives",
      icon: FaHeartbeat,
      link: "/more/blood-donation",
      iconColor: "text-red-600",
      iconBg: "bg-red-100",
    },
    {
      id: "2",
      title: "Local Events",
      description: "Discover events near you",
      icon: FaMapMarkedAlt,
      link: "/more/local-events",
      iconColor: "text-blue-600",
      iconBg: "bg-blue-100",
    },
    {
      id: "3",
      title: "News Feed",
      description: "Latest news & updates",
      icon: FaNewspaper,
      link: "/more/news",
      iconColor: "text-indigo-600",
      iconBg: "bg-indigo-100",
    },
    {
      id: "4",
      title: "Marketplace",
      description: "Buy & sell locally",
      icon: FaDollarSign,
      link: "/more/marketplace",
      iconColor: "text-green-600",
      iconBg: "bg-green-100",
    },
  ];

  return (
    <>
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">More</h1>
        <p className="mt-2 text-gray-600">
          Explore additional features and services
        </p>
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {moreResources.map((resource) => (
          <NavLink
            key={resource.id}
            to={resource.link}
            className="group flex flex-col items-center rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm transition-all hover:scale-105 hover:border-blue-300 hover:shadow-md"
          >
            <div
              className={`mb-4 flex h-16 w-16 items-center justify-center rounded-full ${resource.iconBg} transition-transform group-hover:scale-110`}
            >
              <resource.icon className={`h-8 w-8 ${resource.iconColor}`} />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              {resource.title}
            </h3>
            <p className="text-sm text-gray-600">{resource.description}</p>
          </NavLink>
        ))}
      </div>
    </>
  );
};

export default More;

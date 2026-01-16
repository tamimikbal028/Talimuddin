import React, { useState } from "react";
import {
  FaCalendar,
  FaMapMarkerAlt,
  FaClock,
  FaUsers,
  FaTicketAlt,
  FaFilter,
} from "react-icons/fa";

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  category: string;
  attendees: number;
  image: string;
  organizer: string;
  price: string;
}

const UniversityEvents: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = [
    "All",
    "Academic",
    "Cultural",
    "Sports",
    "Career",
    "Social",
  ];

  const events: Event[] = [
    {
      id: 1,
      title: "Science Fair 2025",
      date: "Oct 15, 2025",
      time: "10:00 AM - 5:00 PM",
      location: "Main Auditorium",
      description:
        "Annual science exhibition featuring innovative projects from students across all departments. Showcase your research and compete for exciting prizes!",
      category: "Academic",
      attendees: 250,
      image:
        "https://images.unsplash.com/photo-1470229538611-16ba8c7ffbd7?w=800&q=80",
      organizer: "Science Club",
      price: "Free",
    },
    {
      id: 2,
      title: "Cultural Night 2025",
      date: "Oct 22, 2025",
      time: "6:00 PM - 10:00 PM",
      location: "Open Stage Arena",
      description:
        "An evening of music, dance, and drama performances by talented students. Experience the diversity of our campus culture!",
      category: "Cultural",
      attendees: 450,
      image:
        "https://images.unsplash.com/photo-1470229538611-16ba8c7ffbd7?w=800&q=80",
      organizer: "Cultural Committee",
      price: "৳50",
    },
    {
      id: 3,
      title: "Career Development Seminar",
      date: "Oct 30, 2025",
      time: "2:00 PM - 5:00 PM",
      location: "Seminar Hall B",
      description:
        "Meet industry experts and learn about career opportunities. Get insights on resume building, interview skills, and industry trends.",
      category: "Career",
      attendees: 180,
      image:
        "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
      organizer: "Career Services",
      price: "Free",
    },
    {
      id: 4,
      title: "Inter-University Sports Meet",
      date: "Nov 5, 2025",
      time: "8:00 AM - 6:00 PM",
      location: "University Sports Complex",
      description:
        "Annual sports competition featuring cricket, football, basketball, and track events. Come support our university team!",
      category: "Sports",
      attendees: 600,
      image:
        "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&q=80",
      organizer: "Sports Committee",
      price: "Free",
    },
    {
      id: 5,
      title: "Tech Talk: AI & Machine Learning",
      date: "Nov 8, 2025",
      time: "3:00 PM - 5:00 PM",
      location: "CSE Building, Room 301",
      description:
        "Guest lecture by industry professionals on the latest trends in AI and ML. Interactive Q&A session included.",
      category: "Academic",
      attendees: 120,
      image:
        "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80",
      organizer: "IEEE Student Branch",
      price: "Free",
    },
    {
      id: 6,
      title: "Freshers' Welcome Party",
      date: "Nov 12, 2025",
      time: "5:00 PM - 9:00 PM",
      location: "University Cafeteria",
      description:
        "Welcome the new batch with music, food, and fun activities. A great opportunity to make new friends!",
      category: "Social",
      attendees: 350,
      image:
        "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80",
      organizer: "Student Council",
      price: "৳100",
    },
  ];

  const filteredEvents = events.filter(
    (event) => selectedCategory === "All" || event.category === selectedCategory
  );

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900">University Events</h1>
        <p className="mt-1 text-lg text-gray-600">
          Discover and participate in upcoming campus activities
        </p>
      </div>

      {/* Category Filters */}
      <div className="flex items-center gap-4 overflow-x-auto rounded-xl border border-gray-200 bg-white p-2 shadow-sm">
        <div className="flex items-center gap-2 text-gray-700">
          <FaFilter className="h-4 w-4" />
          <span className="font-semibold">Filter:</span>
        </div>
        <div className="flex gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`rounded-lg px-4 py-2 font-medium whitespace-nowrap transition-colors ${
                selectedCategory === category
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
        {filteredEvents.map((event) => (
          <div
            key={event.id}
            className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-lg"
          >
            {/* Event Image */}
            <div className="relative h-48 overflow-hidden">
              <img
                src={event.image}
                alt={event.title}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute top-3 right-3 rounded-lg bg-blue-600 px-3 py-1 text-sm font-semibold text-white">
                {event.category}
              </div>
            </div>

            {/* Event Details */}
            <div className="p-5">
              <h3 className="mb-2 line-clamp-1 text-xl font-bold text-gray-900">
                {event.title}
              </h3>
              <p className="mb-4 line-clamp-2 text-sm text-gray-600">
                {event.description}
              </p>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-700">
                  <FaCalendar className="h-4 w-4 text-blue-600" />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <FaClock className="h-4 w-4 text-blue-600" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <FaMapMarkerAlt className="h-4 w-4 text-blue-600" />
                  <span>{event.location}</span>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4">
                <div className="flex items-center gap-2 text-gray-700">
                  <FaUsers className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    {event.attendees} attending
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <FaTicketAlt className="h-4 w-4" />
                  <span className="text-sm font-semibold">{event.price}</span>
                </div>
              </div>

              <button className="mt-4 w-full rounded-lg bg-blue-600 py-2 font-semibold text-white transition-colors hover:bg-blue-700">
                Register Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* No Results */}
      {filteredEvents.length === 0 && (
        <div className="py-16 text-center">
          <FaCalendar className="mx-auto mb-4 h-16 w-16 text-gray-400" />
          <h3 className="mb-2 text-xl font-semibold text-gray-900">
            No events found
          </h3>
          <p className="text-gray-600">Try selecting a different category</p>
        </div>
      )}
    </div>
  );
};

export default UniversityEvents;

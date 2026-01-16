import React, { useState } from "react";
import { FaUsers, FaArrowLeft, FaSearch, FaPlus } from "react-icons/fa";
import { NavLink } from "react-router-dom";

interface Club {
  id: number;
  name: string;
  tagline: string;
  members: number;
  coverImage: string;
  logo: string;
  category: string;
}

const dummyClubs: Club[] = [
  {
    id: 1,
    name: "BUET Debating Club",
    tagline: "Logic, Eloquence, and Persuasion",
    members: 150,
    coverImage:
      "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&q=80",
    logo: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=200&q=80",
    category: "Academic",
  },
  {
    id: 2,
    name: "BUET Photographic Society",
    tagline: "Capturing Moments, Creating Art",
    members: 220,
    coverImage:
      "https://images.unsplash.com/photo-1452421822248-d4c2b47f0c81?w=800&q=80",
    logo: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&q=80",
    category: "Arts & Culture",
  },
  {
    id: 3,
    name: "IEEE BUET Student Branch",
    tagline: "Advancing Technology for Humanity",
    members: 300,
    coverImage:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80",
    logo: "https://images.unsplash.com/photo-1563207153-f403bf289096?w=200&q=80",
    category: "Academic",
  },
  {
    id: 4,
    name: "BUET Drama Society",
    tagline: "All the World's a Stage",
    members: 95,
    coverImage:
      "https://images.unsplash.com/photo-1503095396549-807759245b35?w=800&q=80",
    logo: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=200&q=80",
    category: "Arts & Culture",
  },
  {
    id: 5,
    name: "BUET Sports Club",
    tagline: "Strength, Unity, and Victory",
    members: 450,
    coverImage:
      "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&q=80",
    logo: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=200&q=80",
    category: "Sports",
  },
  {
    id: 6,
    name: "BUET Environmental Watch",
    tagline: "For a Greener Tomorrow",
    members: 180,
    coverImage:
      "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80",
    logo: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=200&q=80",
    category: "Social",
  },
];

const Clubs: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const categories = ["All", "Academic", "Arts & Culture", "Sports", "Social"];

  const filteredClubs = dummyClubs.filter((club) => {
    const matchesCategory =
      selectedCategory === "All" || club.category === selectedCategory;
    const matchesSearch =
      club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      club.tagline.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-5">
      {/* Back Button */}
      <NavLink
        to=".."
        className="inline-flex items-center text-blue-600 transition-colors hover:text-blue-800"
      >
        <FaArrowLeft className="mr-2 h-4 w-4" />
        Back to More
      </NavLink>

      {/* Header */}
      <div>
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Clubs</h1>
            <p className="mt-2 text-lg text-gray-600">
              Discover institution organizations and communities.
            </p>
          </div>
          <button className="flex items-center gap-2 rounded-lg bg-green-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-green-600">
            <FaPlus className="h-4 w-4" />
            Register a Club
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {/* Search Bar */}
          <div className="relative max-w-md flex-1">
            <FaSearch className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search for clubs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white py-3 pr-4 pl-12 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Category Filters */}
          <div className="flex gap-3 overflow-x-auto">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`rounded-lg px-6 py-2 font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === category
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Clubs Grid */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
        {filteredClubs.map((club) => (
          <div
            key={club.id}
            className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-lg"
          >
            {/* Cover Image */}
            <div className="relative h-48 overflow-hidden">
              <img
                src={club.coverImage}
                alt={club.name}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
            </div>

            {/* Club Info */}
            <div className="flex flex-1 flex-col px-6 py-6 text-center">
              <h3 className="mb-2 line-clamp-2 min-h-[3.5rem] text-xl font-bold text-gray-900">
                {club.name}
              </h3>
              <p className="mb-4 line-clamp-2 min-h-[3rem] text-gray-600 italic">
                "{club.tagline}"
              </p>
              <div className="mt-auto flex items-center justify-center gap-2 text-gray-700">
                <FaUsers className="h-4 w-4" />
                <span className="font-medium">{club.members} members</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* No Results */}
      {filteredClubs.length === 0 && (
        <div className="py-16 text-center">
          <FaUsers className="mx-auto mb-4 h-16 w-16 text-gray-400" />
          <h3 className="mb-2 text-xl font-semibold text-gray-900">
            No clubs found
          </h3>
          <p className="text-gray-600">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}
    </div>
  );
};

export default Clubs;

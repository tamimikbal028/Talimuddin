import React, { useState } from "react";
import {
  FaBriefcase,
  FaMapMarkerAlt,
  FaClock,
  FaBookmark,
  FaExternalLinkAlt,
  FaFilter,
  FaBuilding,
  FaGraduationCap,
} from "react-icons/fa";

interface Job {
  id: string;
  title: string;
  company: string;
  logo: string;
  location: string;
  type: "Full-time" | "Part-time" | "Internship" | "Contract";
  category: string;
  deadline: string;
  postedDate: string;
  description: string;
  requirements: string[];
  salary?: string;
  applyLink: string;
  saved: boolean;
}

const CareerHub: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Mock job data
  const jobs: Job[] = [
    {
      id: "1",
      title: "Software Engineer",
      company: "Tech Solutions Ltd",
      logo: "https://ui-avatars.com/api/?name=Tech+Solutions&background=0D8ABC&color=fff",
      location: "Dhaka, Bangladesh",
      type: "Full-time",
      category: "IT & Software",
      deadline: "2025-11-15",
      postedDate: "2 days ago",
      description:
        "We are looking for a talented Software Engineer to join our team.",
      requirements: [
        "BSc in Computer Science",
        "2+ years experience in React/Node.js",
        "Good problem-solving skills",
      ],
      salary: "৳40,000 - ৳60,000",
      applyLink: "https://example.com/apply",
      saved: false,
    },
    {
      id: "2",
      title: "Data Analyst Intern",
      company: "DataCorp Bangladesh",
      logo: "https://ui-avatars.com/api/?name=DataCorp&background=4CAF50&color=fff",
      location: "Chittagong, Bangladesh",
      type: "Internship",
      category: "Data Science",
      deadline: "2025-10-30",
      postedDate: "5 days ago",
      description:
        "Internship opportunity for fresh graduates in data analysis.",
      requirements: [
        "BSc in Statistics/CSE/Math",
        "Knowledge of Python/R",
        "Excel proficiency",
      ],
      salary: "৳15,000 - ৳20,000",
      applyLink: "https://example.com/apply",
      saved: false,
    },
    {
      id: "3",
      title: "Marketing Executive",
      company: "Brand Builders",
      logo: "https://ui-avatars.com/api/?name=Brand+Builders&background=FF5722&color=fff",
      location: "Dhaka, Bangladesh",
      type: "Full-time",
      category: "Marketing",
      deadline: "2025-11-20",
      postedDate: "1 week ago",
      description:
        "Seeking creative marketing professional for brand management.",
      requirements: [
        "BBA/MBA in Marketing",
        "1-2 years experience",
        "Social media expertise",
      ],
      salary: "৳30,000 - ৳45,000",
      applyLink: "https://example.com/apply",
      saved: true,
    },
    {
      id: "4",
      title: "Junior Accountant",
      company: "Finance Solutions",
      logo: "https://ui-avatars.com/api/?name=Finance+Solutions&background=673AB7&color=fff",
      location: "Sylhet, Bangladesh",
      type: "Full-time",
      category: "Finance",
      deadline: "2025-11-10",
      postedDate: "3 days ago",
      description: "Entry-level position for accounting graduates.",
      requirements: [
        "BBA in Accounting",
        "Knowledge of Tally/QuickBooks",
        "Fresh graduates welcome",
      ],
      salary: "৳25,000 - ৳35,000",
      applyLink: "https://example.com/apply",
      saved: false,
    },
    {
      id: "5",
      title: "Content Writer",
      company: "Digital Media House",
      logo: "https://ui-avatars.com/api/?name=Digital+Media&background=E91E63&color=fff",
      location: "Remote",
      type: "Part-time",
      category: "Content & Writing",
      deadline: "2025-11-05",
      postedDate: "4 days ago",
      description:
        "Looking for creative content writers for our digital platforms.",
      requirements: [
        "Bachelor's degree in any field",
        "Excellent English writing",
        "Portfolio required",
      ],
      salary: "৳15,000 - ৳25,000",
      applyLink: "https://example.com/apply",
      saved: false,
    },
  ];

  const categories = [
    "All",
    "IT & Software",
    "Data Science",
    "Marketing",
    "Finance",
    "Content & Writing",
    "Engineering",
    "Teaching",
  ];

  const jobTypes = ["All", "Full-time", "Part-time", "Internship", "Contract"];

  const filteredJobs = jobs.filter((job) => {
    const matchesCategory =
      selectedCategory === "all" ||
      selectedCategory === "All" ||
      job.category === selectedCategory;
    const matchesType =
      selectedType === "all" ||
      selectedType === "All" ||
      job.type === selectedType;
    const matchesSearch =
      searchQuery === "" ||
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesType && matchesSearch;
  });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="rounded-lg border border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50 p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <FaBriefcase className="text-4xl text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Career Hub</h1>
            <p className="mt-1 text-gray-600">
              Find your dream job or internship opportunity
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mt-4">
          <input
            type="text"
            placeholder="Search jobs by title or company..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
          />
        </div>
      </div>

      <div className="flex gap-5">
        {/* Filters Sidebar */}
        <div className="w-64 shrink-0 space-y-4">
          {/* Category Filter */}
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center gap-2">
              <FaFilter className="text-blue-600" />
              <h3 className="font-bold text-gray-900">Category</h3>
            </div>
            <div className="space-y-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() =>
                    setSelectedCategory(category === "All" ? "all" : category)
                  }
                  className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                    (selectedCategory === "all" && category === "All") ||
                    selectedCategory === category
                      ? "bg-blue-100 font-semibold text-blue-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Job Type Filter */}
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center gap-2">
              <FaBriefcase className="text-purple-600" />
              <h3 className="font-bold text-gray-900">Job Type</h3>
            </div>
            <div className="space-y-2">
              {jobTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type === "All" ? "all" : type)}
                  className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                    (selectedType === "all" && type === "All") ||
                    selectedType === type
                      ? "bg-purple-100 font-semibold text-purple-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Stats Card */}
          <div className="rounded-lg border border-gray-200 bg-gradient-to-br from-green-50 to-blue-50 p-4 shadow-sm">
            <h3 className="mb-2 font-bold text-gray-900">Statistics</h3>
            <div className="space-y-2 text-sm">
              <p className="text-gray-700">
                <span className="font-semibold">Total Jobs:</span> {jobs.length}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Active:</span>{" "}
                {filteredJobs.length}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Saved:</span>{" "}
                {jobs.filter((j) => j.saved).length}
              </p>
            </div>
          </div>
        </div>

        {/* Job Listings */}
        <div className="flex-1 space-y-4">
          {filteredJobs.length === 0 ? (
            <div className="rounded-lg border border-gray-200 bg-white p-12 text-center shadow-sm">
              <FaBriefcase className="mx-auto mb-3 text-5xl text-gray-400" />
              <h3 className="text-xl font-bold text-gray-900">No jobs found</h3>
              <p className="mt-2 text-gray-600">
                Try adjusting your filters or search query
              </p>
            </div>
          ) : (
            filteredJobs.map((job) => (
              <div
                key={job.id}
                className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div className="flex gap-4">
                    <img
                      src={job.logo}
                      alt={job.company}
                      className="h-16 w-16 rounded-lg border border-gray-200"
                    />
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900">
                        {job.title}
                      </h3>
                      <div className="mt-1 flex items-center gap-2 text-gray-600">
                        <FaBuilding className="text-sm" />
                        <span className="font-medium">{job.company}</span>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-3 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <FaMapMarkerAlt />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FaClock />
                          <span>{job.postedDate}</span>
                        </div>
                        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                          {job.type}
                        </span>
                        <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
                          {job.category}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button className="rounded-lg p-2 transition-colors hover:bg-gray-100">
                    <FaBookmark
                      className={job.saved ? "text-blue-600" : "text-gray-400"}
                    />
                  </button>
                </div>

                <p className="mt-3 text-gray-700">{job.description}</p>

                <div className="mt-3">
                  <h4 className="mb-2 flex items-center gap-2 font-semibold text-gray-900">
                    <FaGraduationCap />
                    Requirements:
                  </h4>
                  <ul className="ml-5 list-disc space-y-1 text-sm text-gray-700">
                    {job.requirements.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4">
                  <div>
                    {job.salary && (
                      <p className="text-sm font-semibold text-green-700">
                        💰 {job.salary}
                      </p>
                    )}
                    <p className="text-xs text-red-600">
                      ⏰ Deadline: {job.deadline}
                    </p>
                  </div>
                  <a
                    href={job.applyLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 font-semibold text-white transition-colors hover:bg-blue-700"
                  >
                    Apply Now
                    <FaExternalLinkAlt className="text-sm" />
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CareerHub;

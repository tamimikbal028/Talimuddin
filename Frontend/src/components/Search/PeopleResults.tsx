import { NavLink } from "react-router-dom";
import type { SearchUser } from "../../types";

interface PeopleResultsProps {
  isVisible: boolean;
  people?: SearchUser[];
}

// Local card component for search results to decouple from primary FriendCard
const SearchPeopleCard: React.FC<{ person: SearchUser }> = ({ person }) => {
  const institutionName = person.institution?.name || "No Institution";

  return (
    <div className="flex items-center space-x-3 rounded-lg border border-gray-300 bg-white p-2 shadow-sm">
      <NavLink to={`/profile/${person.userName}`}>
        <img
          src={person.avatar}
          alt={person.fullName}
          className="h-10 w-10 rounded-full object-cover transition-opacity hover:opacity-80"
        />
      </NavLink>
      <div className="flex-1">
        <h3>
          <NavLink
            to={`/profile/${person.userName}`}
            className="font-medium text-gray-800 transition-colors hover:text-blue-600 hover:underline"
          >
            {person.fullName}
          </NavLink>
        </h3>
        <p className="text-sm font-medium text-gray-500">{institutionName}</p>
      </div>
      {/* Search actions can be added here later if needed with a custom design */}
    </div>
  );
};

const PeopleResults: React.FC<PeopleResultsProps> = ({
  isVisible,
  people = [],
}) => {
  if (!isVisible || people.length === 0) return null;

  return (
    <div>
      <h2 className="mb-4 text-xl font-bold text-gray-900">
        People ({people.length})
      </h2>
      <div className="space-y-4">
        {people.map((person) => (
          <SearchPeopleCard key={person._id} person={person} />
        ))}
      </div>
    </div>
  );
};

export default PeopleResults;

import React, { useState, useRef, useEffect } from "react";
import { FaChevronRight, FaEllipsisH } from "react-icons/fa";

interface BreadcrumbItem {
  id: string;
  name: string;
}

interface BreadcrumbProps {
  currentPath: BreadcrumbItem[];
  onNavigate: (index: number) => void;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ currentPath, onNavigate }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const breadcrumbRef = useRef<HTMLDivElement>(null);

  // Check if breadcrumb is overflowing
  useEffect(() => {
    const checkOverflow = () => {
      if (breadcrumbRef.current) {
        const isOverflow =
          breadcrumbRef.current.scrollWidth > breadcrumbRef.current.clientWidth;
        setIsOverflowing(isOverflow);
      }
    };

    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, [currentPath]);

  // Render full breadcrumb for short paths
  const renderFullBreadcrumb = () => (
    <nav className="flex items-center space-x-2 overflow-hidden text-sm">
      {currentPath.map((item, index) => {
        const isLast = index === currentPath.length - 1;
        return (
          <React.Fragment key={item.id}>
            {index === 0 ? (
              <button
                onClick={() => onNavigate(index)}
                className={`flex h-[38px] items-center rounded-lg px-3 py-2 transition-all ${
                  isLast && currentPath.length === 1
                    ? "text-blue-600"
                    : "text-gray-600 hover:bg-gray-200"
                }`}
              >
                <span className="max-w-[120px] truncate font-medium">
                  {item.name}
                </span>
              </button>
            ) : (
              <>
                <FaChevronRight className="h-3 w-3 flex-shrink-0 text-gray-400" />
                <button
                  onClick={() => onNavigate(index)}
                  className={`h-[38px] rounded-lg px-3 py-2 whitespace-nowrap transition-all ${
                    isLast ? "text-blue-600" : "text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <span className="block max-w-[120px] truncate font-medium">
                    {item.name}
                  </span>
                </button>
              </>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );

  // Render condensed breadcrumb for long paths
  const renderCondensedBreadcrumb = () => {
    if (currentPath.length <= 3) {
      return renderFullBreadcrumb();
    }

    const firstItem = currentPath[0];
    const lastTwoItems = currentPath.slice(-2);
    const hiddenItems = currentPath.slice(1, -2);

    return (
      <nav className="flex items-center space-x-2 text-sm">
        {/* First item (Home) */}
        <button
          onClick={() => onNavigate(0)}
          className="flex h-[38px] items-center rounded-lg px-3 py-2 whitespace-nowrap text-gray-600 transition-all hover:bg-gray-200"
        >
          <span className="max-w-[120px] truncate font-medium">
            {firstItem.name}
          </span>
        </button>

        {/* Separator */}
        <FaChevronRight className="h-3 w-3 flex-shrink-0 text-gray-400" />

        {/* Ellipsis with dropdown for hidden items */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex h-[38px] items-center justify-center rounded-lg px-3 py-2 text-gray-600 transition-all hover:bg-gray-200"
            title="Show hidden folders"
          >
            <FaEllipsisH className="h-3.5 w-3.5" />
          </button>

          {/* Dropdown for hidden items */}
          {showDropdown && (
            <div className="absolute top-full left-0 z-10 mt-1 min-w-[200px] rounded-lg border border-gray-200 bg-white shadow-lg">
              <div className="py-1">
                {hiddenItems.map((item, hiddenIndex) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      onNavigate(hiddenIndex + 1); // +1 because we skip the first item
                      setShowDropdown(false);
                    }}
                    className="w-full px-3 py-2 text-left text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
                  >
                    <span className="block truncate">{item.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Last two items */}
        {lastTwoItems.map((item, index) => {
          const originalIndex = currentPath.length - 2 + index;
          const isLast = originalIndex === currentPath.length - 1;
          return (
            <React.Fragment key={item.id}>
              <FaChevronRight className="h-3 w-3 flex-shrink-0 text-gray-400" />
              <button
                onClick={() => onNavigate(originalIndex)}
                className={`h-[38px] rounded-lg px-3 py-2 whitespace-nowrap transition-all ${
                  isLast ? "text-blue-600" : "text-gray-600 hover:bg-gray-200"
                }`}
              >
                <span className="block max-w-[120px] truncate font-medium">
                  {item.name}
                </span>
              </button>
            </React.Fragment>
          );
        })}
      </nav>
    );
  };

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        breadcrumbRef.current &&
        !breadcrumbRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={breadcrumbRef} className="min-w-0 flex-1">
      {currentPath.length > 4 || isOverflowing
        ? renderCondensedBreadcrumb()
        : renderFullBreadcrumb()}
    </div>
  );
};

export default Breadcrumb;

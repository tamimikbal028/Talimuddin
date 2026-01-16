import React from "react";

const GroupMediaTab: React.FC = () => {
  return (
    <div className="grid grid-cols-3 gap-4">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="aspect-square rounded-xl bg-gradient-to-br from-purple-400 to-pink-400"
        />
      ))}
    </div>
  );
};

export default GroupMediaTab;

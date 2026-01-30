import React from "react";
import CreateRoomForm from "../../components/ClassRoom/CreateRoomForm";

const CreateRoomPage: React.FC = () => {
  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Create New Room</h1>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
        <CreateRoomForm />
      </div>
    </>
  );
};

export default CreateRoomPage;

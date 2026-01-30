import React from "react";
import CreateBranchForm from "../../components/Branch/CreateBranchForm";

const CreateBranchPage: React.FC = () => {
  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Create New Branch</h1>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
        <CreateBranchForm />
      </div>
    </>
  );
};

export default CreateBranchPage;

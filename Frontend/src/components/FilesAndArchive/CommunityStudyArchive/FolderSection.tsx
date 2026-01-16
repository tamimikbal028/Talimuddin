import React, { useState } from "react";
import {
  FaFolder,
  FaChevronDown,
  FaChevronRight,
  FaArrowLeft,
  FaFile,
  FaPlus,
} from "react-icons/fa";
import {
  showSuccess,
  confirmDelete,
  inputFolderName,
  inputRename,
  showUploadSuccess,
} from "../../../utils/sweetAlert";
import FileActionButton from "../../shared/FileActionButtons";
import Breadcrumb from "../PersonalFiles/Breadcrumb";
import UploadModal from "../PersonalFiles/UploadModal";
import FileActionsMenu from "../../FilesAndArchive/shared/FileActionsMenu";
import FilePreviewModal from "../../FilesAndArchive/shared/FilePreviewModal";
import FileDetailsModal from "../../FilesAndArchive/shared/FileDetailsModal";

// File type
type FileItem = {
  id: string;
  name: string;
  type: "folder" | "file";
  fileCount?: number;
  size?: string;
  uploadedBy?: string;
  uploadDate?: string;
  description?: string;
  url?: string;
  downloads?: number;
  views?: number;
};

// TODO: Replace with API types
type Course = {
  id: string;
  name: string;
  code: string;
  folders: { id: string; name: string; fileCount: number }[];
};

type BreadcrumbItem = {
  id: string;
  name: string;
};

const FolderSection: React.FC = () => {
  // TODO: Replace with API data
  const [theoryCourses] = useState<Course[]>([]);
  const [sessionalCourses] = useState<Course[]>([]);
  const [isViewingFolder, setIsViewingFolder] = useState(false);
  const [breadcrumbPath, setBreadcrumbPath] = useState<BreadcrumbItem[]>([]);
  const [currentFolderItems, setCurrentFolderItems] = useState<FileItem[]>([]);

  // Get current folder ID to determine what to show
  const currentFolderId =
    breadcrumbPath.length > 0
      ? breadcrumbPath[breadcrumbPath.length - 1].id
      : null;

  // Local state for managing collapsed/expanded courses
  const [expandedCourses, setExpandedCourses] = useState<Set<string>>(
    new Set()
  );
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Modal states
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const toggleCourse = (courseId: string) => {
    setExpandedCourses((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(courseId)) {
        newSet.delete(courseId);
      } else {
        newSet.add(courseId);
      }
      return newSet;
    });
  };

  const handleFolderClick = (
    courseId: string,
    courseName: string,
    folderId: string,
    folderName: string
  ) => {
    // TODO: Replace with API call
    setBreadcrumbPath([
      { id: courseId, name: courseName },
      { id: folderId, name: folderName },
    ]);
    setIsViewingFolder(true);
  };

  const handleBackClick = () => {
    // TODO: Replace with proper navigation
    if (breadcrumbPath.length > 1) {
      setBreadcrumbPath((prev) => prev.slice(0, -1));
    } else {
      setIsViewingFolder(false);
      setBreadcrumbPath([]);
    }
  };

  const handleBreadcrumbClick = (index: number) => {
    // TODO: Replace with proper navigation
    if (index === 0) {
      setIsViewingFolder(false);
      setBreadcrumbPath([]);
    } else {
      setBreadcrumbPath((prev) => prev.slice(0, index + 1));
    }
  };

  const handleSubFolderClick = (folderId: string, folderName: string) => {
    // TODO: Replace with API call
    setBreadcrumbPath((prev) => [...prev, { id: folderId, name: folderName }]);
  };

  const handleCreateFolder = async () => {
    const folderName = await inputFolderName();

    if (folderName && currentFolderId) {
      // TODO: Replace with API call
      console.log("Create folder:", folderName, "in:", currentFolderId);

      showSuccess({
        title: "Folder created",
        text: `"${folderName}" has been created successfully`,
      });
    }
  };

  const handleUploadFile = () => {
    setShowUploadModal(true);
  };

  // File action handlers
  const handleFileClick = (file: FileItem) => {
    setSelectedFile(file);
    setShowPreviewModal(true);
  };

  const handleDownload = (file: FileItem) => {
    // Simulate download
    const link = document.createElement("a");
    link.href = file.url || "#";
    link.download = file.name;
    link.click();

    showSuccess({
      title: "Download started",
      text: `Downloading ${file.name}`,
    });
  };

  const handleRename = async (file: FileItem) => {
    const newName = await inputRename(file.name);

    if (newName && newName !== file.name) {
      // TODO: Implement rename in Redux
      showSuccess({
        title: "Renamed",
        text: `File renamed to "${newName}"`,
      });
    }
  };

  const handleDelete = async (file: FileItem) => {
    const confirmed = await confirmDelete(file.name);

    if (confirmed) {
      // TODO: Implement delete in Redux
      showSuccess({
        title: "Deleted",
        text: "File deleted successfully",
      });
    }
  };

  const handleDetails = (file: FileItem) => {
    setSelectedFile(file);
    setShowDetailsModal(true);
  };

  const handleUploadFiles = (files: File[]) => {
    if (!currentFolderId) return;

    // Format files for upload
    const formattedFiles = files.map((file) => ({
      name: file.name,
      size: `${(file.size / 1024).toFixed(1)} KB`,
    }));

    // TODO: Replace with API call
    console.log("Upload files:", formattedFiles, "to folder:", currentFolderId);

    showUploadSuccess(files.length);
  };

  // Get folders and files from current items
  const folders = currentFolderItems.filter((item) => item.type === "folder");
  const files = currentFolderItems.filter((item) => item.type === "file");

  // If viewing folder, show files and sub-folders list
  if (isViewingFolder) {
    return (
      <>
        <div className="space-y-4">
          {/* Back Button and Breadcrumb */}
          <div className="flex items-center space-x-3">
            {breadcrumbPath.length > 1 && (
              <button
                onClick={handleBackClick}
                className="flex h-[38px] items-center space-x-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                <FaArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </button>
            )}

            {/* Breadcrumb Navigation */}
            <Breadcrumb
              currentPath={breadcrumbPath}
              onNavigate={handleBreadcrumbClick}
            />
          </div>

          {/* Sub-Folders Section */}
          <div className="rounded-lg border border-gray-200 bg-white">
            <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 p-3">
              <h3 className="text-sm font-semibold text-gray-900">
                Folders ({folders.length})
              </h3>
              <FileActionButton
                icon={FaPlus}
                label="New Folder"
                onClick={handleCreateFolder}
              />
            </div>
            {folders.length > 0 && (
              <div className="divide-y divide-gray-100">
                {folders.map((folder) => (
                  <div
                    key={folder.id}
                    className="flex items-center justify-between p-3 transition-colors hover:bg-gray-50"
                  >
                    <div
                      onClick={() =>
                        handleSubFolderClick(folder.id, folder.name)
                      }
                      className="flex flex-1 cursor-pointer items-center space-x-3"
                    >
                      <FaFolder className="h-5 w-5 text-blue-500" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-gray-900">
                          {folder.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {folder.fileCount || 0} files
                        </p>
                      </div>
                      <FaChevronRight className="h-4 w-4 text-gray-400" />
                    </div>
                    <FileActionsMenu
                      file={folder}
                      onDownload={() => {}}
                      onRename={() => handleRename(folder)}
                      onDelete={() => handleDelete(folder)}
                      onDetails={() => handleDetails(folder)}
                    />
                  </div>
                ))}
              </div>
            )}
            {folders.length === 0 && (
              <div className="p-4 text-center text-sm text-gray-500">
                No folders yet. Create a new folder to get started.
              </div>
            )}
          </div>

          {/* Files List */}
          <div className="rounded-lg border border-gray-200 bg-white">
            <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 p-3">
              <h3 className="text-sm font-semibold text-gray-900">
                Files ({files.length})
              </h3>
              <FileActionButton
                icon={FaPlus}
                label="Upload File"
                onClick={handleUploadFile}
              />
            </div>
            {files.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {files.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-3 transition-colors hover:bg-gray-50"
                  >
                    <div
                      onClick={() => handleFileClick(file)}
                      className="flex flex-1 cursor-pointer items-center space-x-3"
                    >
                      <FaFile className="h-5 w-5 text-red-500" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-gray-900">
                          {file.name}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span>{file.size || "Unknown size"}</span>
                          {file.uploadedBy && (
                            <>
                              <span>•</span>
                              <span>{file.uploadedBy}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <FileActionsMenu
                      file={file}
                      onDownload={() => handleDownload(file)}
                      onRename={() => handleRename(file)}
                      onDelete={() => handleDelete(file)}
                      onDetails={() => handleDetails(file)}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-sm text-gray-500">
                No files yet. Upload files to get started.
              </div>
            )}
          </div>
        </div>

        {/* Upload Modal - Available in folder view */}
        <UploadModal
          isOpen={showUploadModal}
          onClose={() => setShowUploadModal(false)}
          onUploadFiles={handleUploadFiles}
        />
      </>
    );
  }

  return (
    <>
      <div className="space-y-5">
        {/* Theory Courses */}
        <div>
          <h3 className="mb-3 text-sm font-semibold text-gray-700">
            Theory Courses ({theoryCourses.length})
          </h3>
          {theoryCourses.length > 0 ? (
            <div className="grid items-start gap-4 md:grid-cols-2">
              {theoryCourses.map((course) => {
                const isExpanded = expandedCourses.has(course.id);
                return (
                  <div
                    key={course.id}
                    className="overflow-hidden rounded-lg border border-gray-200 bg-white"
                  >
                    <div
                      onClick={() => toggleCourse(course.id)}
                      className="flex cursor-pointer items-center justify-between border-b border-gray-100 bg-gray-50 p-3 transition-colors hover:bg-gray-100"
                    >
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">
                          {course.name} ({course.code})
                        </h4>
                        <p className="text-xs text-gray-500">
                          {course.fileCount} total files
                        </p>
                      </div>
                      <div className="ml-2">
                        {isExpanded ? (
                          <FaChevronDown className="h-4 w-4 text-gray-500" />
                        ) : (
                          <FaChevronRight className="h-4 w-4 text-gray-500" />
                        )}
                      </div>
                    </div>
                    {isExpanded && (
                      <div className="divide-y divide-gray-100">
                        {course.folders.map((folder) => (
                          <div
                            key={folder.id}
                            onClick={() =>
                              handleFolderClick(
                                course.id,
                                course.name,
                                folder.id,
                                folder.name
                              )
                            }
                            className="group flex cursor-pointer items-center justify-between p-3 transition-colors hover:bg-gray-50"
                          >
                            <div className="flex flex-1 items-center space-x-3">
                              <div className="text-lg">
                                <FaFolder className="text-blue-500" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium text-gray-900">
                                  {folder.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {folder.fileCount} files
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-center">
              <p className="text-sm text-gray-500">
                No theory courses found for this level and term
              </p>
            </div>
          )}
        </div>

        {/* Sessional Courses */}
        <div>
          <h3 className="mb-3 text-sm font-semibold text-gray-700">
            Sessional Courses ({sessionalCourses.length})
          </h3>
          {sessionalCourses.length > 0 ? (
            <div className="grid items-start gap-4 md:grid-cols-2">
              {sessionalCourses.map((course) => {
                const isExpanded = expandedCourses.has(course.id);
                return (
                  <div
                    key={course.id}
                    className="overflow-hidden rounded-lg border border-gray-200 bg-white"
                  >
                    <div
                      onClick={() => toggleCourse(course.id)}
                      className="flex cursor-pointer items-center justify-between border-b border-gray-100 bg-gray-50 p-3 transition-colors hover:bg-gray-100"
                    >
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">
                          {course.name} ({course.code})
                        </h4>
                        <p className="text-xs text-gray-500">
                          {course.fileCount} total files
                        </p>
                      </div>
                      <div className="ml-2">
                        {isExpanded ? (
                          <FaChevronDown className="h-4 w-4 text-gray-500" />
                        ) : (
                          <FaChevronRight className="h-4 w-4 text-gray-500" />
                        )}
                      </div>
                    </div>
                    {isExpanded && (
                      <div className="divide-y divide-gray-100">
                        {course.folders.map((folder) => (
                          <div
                            key={folder.id}
                            onClick={() =>
                              handleFolderClick(
                                course.id,
                                course.name,
                                folder.id,
                                folder.name
                              )
                            }
                            className="group flex cursor-pointer items-center justify-between p-3 transition-colors hover:bg-gray-50"
                          >
                            <div className="flex flex-1 items-center space-x-3">
                              <div className="text-lg">
                                <FaFolder className="text-green-500" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium text-gray-900">
                                  {folder.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {folder.fileCount} files
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-center">
              <p className="text-sm text-gray-500">
                No sessional courses found for this level and term
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Upload Modal - Available in all views */}
      <UploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUploadFiles={handleUploadFiles}
      />

      {/* File Preview Modal */}
      <FilePreviewModal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        file={selectedFile}
      />

      {/* File Details Modal */}
      <FileDetailsModal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        file={selectedFile}
      />
    </>
  );
};

export default FolderSection;

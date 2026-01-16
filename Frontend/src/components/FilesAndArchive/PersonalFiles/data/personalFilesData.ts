export interface FileItem {
  id: string;
  name: string;
  type: "folder" | "file";
  size?: string;
  createdAt: string;
  fileType?: string;
  shared?: boolean;
  isPublic?: boolean;
}

export interface BreadcrumbItem {
  id: string;
  name: string;
}

// Minimal hierarchical folder structure for the demo
export const folderContents: Record<string, FileItem[]> = {
  root: [
    {
      id: "1",
      name: "Shared with me",
      type: "folder",
      createdAt: "2025-09-15",
    },
    {
      id: "2",
      name: "Personal Documents",
      type: "folder",
      createdAt: "2025-09-10",
    },
    {
      id: "3",
      name: "Study Materials",
      type: "folder",
      createdAt: "2025-09-05",
    },
    {
      id: "f1",
      name: "Welcome.txt",
      type: "file",
      size: "1 KB",
      createdAt: "2025-09-01",
      fileType: "txt",
    },
    {
      id: "f2",
      name: "Resume.pdf",
      type: "file",
      size: "1200 KB",
      createdAt: "2025-08-28",
      fileType: "pdf",
    },
  ],

  // small subfolder to keep navigation testable
  "1": [
    {
      id: "1-1",
      name: "Project_Readme.md",
      type: "file",
      size: "2 KB",
      createdAt: "2025-09-14",
      fileType: "md",
    },
  ],
};

// Helper function to get current folder contents
export const getCurrentFolderContents = (
  currentPath: BreadcrumbItem[]
): FileItem[] => {
  if (currentPath.length === 0) return folderContents["root"] || [];
  const currentFolderId = currentPath[currentPath.length - 1].id;
  return folderContents[currentFolderId] || [];
};

// For backward compatibility
export const personalFilesData: FileItem[] = folderContents["root"];

import React, { useState, useEffect, useRef } from "react";
import { FiX } from "react-icons/fi";

// TODO: Replace with API types
type RoomPost = {
  id: string;
  roomId: string;
  authorId: string;
  content: string;
  createdAt: string;
  replies: unknown[];
  attachments?: {
    id: string;
    fileName: string;
    url: string;
    mimeType?: string;
    sizeKb?: number;
  }[];
};

interface Props {
  roomId: string;
  currentUserId?: string;
  onClose?: () => void;
}

const CreatePostForm: React.FC<Props> = ({
  roomId,
  currentUserId,
  onClose,
}) => {
  const [text, setText] = useState("");
  const [attachments, setAttachments] = useState<
    {
      id: string;
      fileName: string;
      url: string;
      mimeType?: string;
      sizeKb?: number;
      file?: File;
    }[]
  >([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleSubmit = () => {
    const content = text.trim();
    // allow posting if there's text or attachments
    if (!content && attachments.length === 0) return;

    const atts = attachments.map((a) => ({
      id: a.id,
      fileName: a.fileName,
      url: a.url,
      mimeType: a.mimeType,
      sizeKb: a.sizeKb,
    }));

    const newPost: RoomPost = {
      id: `post-${Date.now()}`,
      roomId,
      authorId: currentUserId ?? "0",
      content,
      createdAt: new Date().toISOString(),
      replies: [],
      attachments: atts.length ? atts : undefined,
    };

    // TODO: Replace with API call
    console.log("Create post:", newPost);
    setText("");
    // keep object URLs intact so the posted attachments remain viewable.
    // we only revoke when the user removes a preview or when the component unmounts.
    setAttachments([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
    onClose?.();
  };

  useEffect(() => {
    return () => {
      attachments.forEach((a) => {
        try {
          URL.revokeObjectURL(a.url);
        } catch (e) {
          void e;
        }
      });
    };
  }, [attachments]);

  return (
    <div className="mx-auto max-w-5xl rounded-lg border border-gray-500 bg-white p-4 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900">Create Post</h3>
      <textarea
        className="mt-2 w-full rounded border border-gray-200 p-2 text-sm"
        rows={4}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write something to the room..."
      />

      {/* attachments picker */}
      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => {
              const files = Array.from(e.target.files || []);
              if (files.length === 0) return;
              const next = files.map((f) => ({
                id: `att-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
                fileName: f.name,
                url: URL.createObjectURL(f),
                mimeType: f.type,
                sizeKb: Math.round(f.size / 1024),
                file: f,
              }));
              setAttachments((s) => [...s, ...next]);
              // reset input to allow selecting same file again
              if (fileInputRef.current) fileInputRef.current.value = "";
            }}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="rounded-md border border-gray-200 bg-white px-3 py-1 text-sm text-gray-700 hover:bg-gray-50"
          >
            Add Photos
          </button>

          {attachments.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                {attachments.length} photo{attachments.length > 1 ? "s" : ""}{" "}
                selected
              </span>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => {
              setText("");
              attachments.forEach((a) => {
                try {
                  URL.revokeObjectURL(a.url);
                } catch (e) {
                  void e;
                }
              });
              setAttachments([]);
              onClose?.();
            }}
            className="rounded border border-gray-300 px-3 py-1 text-sm"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="rounded bg-blue-600 px-3 py-1 text-sm font-medium text-white disabled:opacity-50"
            disabled={text.trim() === "" && attachments.length === 0}
          >
            Post
          </button>
        </div>
      </div>

      {/* previews */}
      {attachments.length > 0 && (
        <div className="mt-3 grid grid-cols-4 gap-2">
          {attachments.map((a) => (
            <div
              key={a.id}
              className="relative overflow-hidden rounded border border-gray-200 bg-gray-50"
            >
              <img
                src={a.url}
                alt={a.fileName}
                className="h-24 w-full object-cover"
              />
              <button
                onClick={() => {
                  try {
                    URL.revokeObjectURL(a.url);
                  } catch (e) {
                    void e;
                  }
                  setAttachments((s) => s.filter((x) => x.id !== a.id));
                }}
                className="absolute top-1 right-1 inline-flex items-center justify-center rounded-full bg-white p-1 text-red-600 shadow"
                aria-label="Remove photo"
              >
                <FiX className="h-4 w-4 cursor-pointer" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CreatePostForm;

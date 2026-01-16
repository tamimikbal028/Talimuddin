import React, { useState } from "react";
import { confirm } from "../utils/sweetAlert";
import { FaPoll, FaPlus, FaBullhorn } from "react-icons/fa";
import {
  PollCard,
  EndedPollCard,
  AnnouncementCard,
  AnnouncementForm,
  PollForm,
  type Poll,
  type Announcement,
} from "../components/CRCorner";

// TODO: Replace with API data
interface User {
  id: string;
  name: string;
  university?: { isCr?: boolean };
}

const CRCorner: React.FC = () => {
  // track selected option per poll: { [pollId]: optionId }
  const [selectedPolls, setSelectedPolls] = useState<
    Record<number, number | null>
  >({});
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);

  // Edit announcement state
  const [editingAnnouncementId, setEditingAnnouncementId] = useState<
    number | null
  >(null);
  const [existingFiles, setExistingFiles] = useState<
    Array<{ id: string; name: string; url?: string }>
  >([]);

  // Poll creation state
  const [showCreatePoll, setShowCreatePoll] = useState(false);
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState<string[]>(["", ""]);
  const [editingPollId, setEditingPollId] = useState<number | null>(null);

  // TODO: Replace with actual current user from API/context
  const currentUser: User | undefined = {
    id: "current-user-id",
    name: "Current User",
    university: { isCr: true },
  };

  const isCurrentUserCr = !!currentUser?.university?.isCr;

  // TODO: Replace with API data
  const polls: Poll[] = [];
  const announcements: Announcement[] = [];
  const activePolls: Poll[] = [];
  const endedPolls: Poll[] = [];

  // Toggle read state for a given announcement for the current user
  const toggleRead = (id: number) => {
    if (!currentUser?.id) return;
    // TODO: Replace with API call
    console.log("Toggle read:", { id, userId: currentUser.id });
  };

  const handleVote = (pollId: number, optionId: number) => {
    const prevSelected = selectedPolls[pollId] ?? null;
    // TODO: Replace with API call
    console.log("Vote:", { pollId, optionId, prevSelected });
    setSelectedPolls((prev) => ({ ...prev, [pollId]: optionId }));
  };

  const handleCancelVote = (pollId: number) => {
    const prevSelected = selectedPolls[pollId] ?? null;
    if (prevSelected === null) return;
    // TODO: Replace with API call
    console.log("Cancel vote:", { pollId, prevSelected });
    setSelectedPolls((prev) => ({ ...prev, [pollId]: null }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setAttachedFiles((prev) => [...prev, ...filesArray]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveExistingFile = (fileId: string) => {
    setExistingFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  const handleCreatePost = () => {
    if (!isCurrentUserCr) {
      alert("Only Class Representatives can create announcements.");
      return;
    }

    if (postTitle.trim() && postContent.trim()) {
      // TODO: Replace with API call
      console.log("Create/Update announcement:", {
        title: postTitle,
        content: postContent,
        files: attachedFiles,
        existingFiles,
        editingId: editingAnnouncementId,
      });

      setPostTitle("");
      setPostContent("");
      setAttachedFiles([]);
      setExistingFiles([]);
      setShowCreatePost(false);
      setEditingAnnouncementId(null);
    }
  };

  // Poll creation helpers
  const addPollOption = () => setPollOptions((s) => [...s, ""]);
  const removePollOption = (index: number) =>
    setPollOptions((s) => s.filter((_, i) => i !== index));
  const updatePollOption = (index: number, value: string) =>
    setPollOptions((s) => s.map((o, i) => (i === index ? value : o)));

  const handleCreatePoll = () => {
    if (!isCurrentUserCr) {
      alert("Only Class Representatives can create polls.");
      return;
    }

    const q = pollQuestion.trim();
    const opts = pollOptions.map((o) => o.trim()).filter(Boolean);
    if (!q || opts.length < 2) {
      alert("Please provide a question and at least two options.");
      return;
    }

    // TODO: Replace with API call
    console.log("Create/Update poll:", {
      question: q,
      options: opts,
      editingId: editingPollId,
    });

    setPollQuestion("");
    setPollOptions(["", ""]);
    setShowCreatePoll(false);
    setEditingPollId(null);
  };

  const handleDownload = (announcement: Announcement) => {
    const maybeUrl = announcement.fileUrl;
    if (maybeUrl) {
      const link = document.createElement("a");
      link.href = maybeUrl;
      link.download = announcement.fileName || "attachment";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(maybeUrl), 5000);
      return;
    }
    alert(`Downloading ${announcement.fileName || "file"}`);
  };

  // track which announcement ids are expanded
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});

  const toggleExpanded = (id: number) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // which announcement menu is open (id -> boolean)
  const [menuOpenFor, setMenuOpenFor] = useState<number | null>(null);

  // which ended polls are expanded (full view)
  const [expandedPolls, setExpandedPolls] = useState<Record<number, boolean>>(
    {}
  );

  const toggleMenu = (id: number) => {
    setMenuOpenFor((prev) => (prev === id ? null : id));
  };

  const handleEditPoll = (id: number) => {
    const poll = polls.find((p) => p.id === id);
    if (poll) {
      setEditingPollId(id);
      setPollQuestion(poll.question);
      setPollOptions(poll.options.map((opt) => opt.text));
      setShowCreatePoll(true);
    }
  };

  const handleEditAnnouncement = (id: number) => {
    const announcement = announcements.find((a) => a.id === id);
    if (announcement) {
      setEditingAnnouncementId(id);
      setPostTitle(announcement.title);
      setPostContent(announcement.content);

      if (announcement.files && announcement.files.length > 0) {
        setExistingFiles(announcement.files);
      } else if (announcement.hasFile && announcement.fileName) {
        setExistingFiles([
          {
            id: `${announcement.id}-file`,
            name: announcement.fileName,
            url: announcement.fileUrl,
          },
        ]);
      }

      setShowCreatePost(true);
      setMenuOpenFor(null);
    }
  };

  const handleDeleteAnnouncement = async (id: number) => {
    const confirmed = await confirm({
      title: "Delete Announcement?",
      text: "Are you sure you want to delete this announcement? This action cannot be undone.",
      icon: "warning",
      confirmButtonText: "Yes, delete it",
      isDanger: true,
    });

    if (confirmed) {
      // TODO: Replace with API call
      console.log("Delete announcement:", id);
      if (menuOpenFor === id) setMenuOpenFor(null);
    }
  };

  const handleDeletePoll = async (id: number) => {
    const confirmed = await confirm({
      title: "Delete Poll?",
      text: "Are you sure you want to delete this poll? This action cannot be undone.",
      icon: "warning",
      confirmButtonText: "Yes, delete it",
      isDanger: true,
    });

    if (confirmed) {
      // TODO: Replace with API call
      console.log("Delete poll:", id);
    }
  };

  const handleEndPoll = (id: number) => {
    // TODO: Replace with API call
    console.log("End poll:", id);
  };

  const toggleExpandPoll = (id: number) => {
    setExpandedPolls((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleReopenPoll = (id: number) => {
    // TODO: Replace with API call
    console.log("Reopen poll:", id);
  };

  return (
    <div className="space-y-3">
      {/* Page Header */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600">
              <FaBullhorn className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">CR Corner</h1>
              <p className="text-sm font-medium text-gray-500">
                Announcements, polls, and updates from your CR
              </p>
            </div>
          </div>

          {isCurrentUserCr && (
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowCreatePost(!showCreatePost)}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
              >
                <FaPlus className="h-4 w-4" />
                Announcement
              </button>
              <button
                onClick={() => setShowCreatePoll((s) => !s)}
                className="flex items-center gap-2 rounded-lg border border-blue-600 px-4 py-2.5 text-sm font-semibold text-blue-600 transition-colors hover:bg-blue-50"
              >
                <FaPoll className="h-4 w-4" />
                Poll
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Create Post Form */}
      {showCreatePost && (
        <AnnouncementForm
          isEditing={!!editingAnnouncementId}
          title={postTitle}
          content={postContent}
          existingFiles={existingFiles}
          attachedFiles={attachedFiles}
          onTitleChange={setPostTitle}
          onContentChange={setPostContent}
          onFileChange={handleFileChange}
          onRemoveExistingFile={handleRemoveExistingFile}
          onRemoveFile={handleRemoveFile}
          onSubmit={handleCreatePost}
          onCancel={() => {
            setShowCreatePost(false);
            setEditingAnnouncementId(null);
            setPostTitle("");
            setPostContent("");
            setAttachedFiles([]);
            setExistingFiles([]);
          }}
        />
      )}

      {/* Create Poll Form */}
      {showCreatePoll && isCurrentUserCr && (
        <PollForm
          isEditing={!!editingPollId}
          question={pollQuestion}
          options={pollOptions}
          onQuestionChange={setPollQuestion}
          onOptionChange={updatePollOption}
          onAddOption={addPollOption}
          onRemoveOption={removePollOption}
          onSubmit={handleCreatePoll}
          onCancel={() => {
            setShowCreatePoll(false);
            setEditingPollId(null);
            setPollQuestion("");
            setPollOptions(["", ""]);
          }}
        />
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Announcements Section */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-100 p-4">
            <div className="flex items-center gap-3">
              <FaBullhorn className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">
                Announcements
              </h2>
            </div>
          </div>
          <div className="p-4">
            {announcements.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-gray-200 bg-gray-50 p-8 text-center">
                <FaBullhorn className="h-10 w-10 text-gray-300" />
                <div>
                  <p className="font-medium text-gray-600">
                    No announcements yet
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {announcements.map((announcement) => (
                  <AnnouncementCard
                    key={announcement.id}
                    announcement={announcement}
                    currentUserId={currentUser!.id}
                    isExpanded={expanded[announcement.id] || false}
                    isMenuOpen={menuOpenFor === announcement.id}
                    onToggleExpanded={toggleExpanded}
                    onToggleMenu={toggleMenu}
                    onToggleRead={toggleRead}
                    onEdit={handleEditAnnouncement}
                    onDelete={handleDeleteAnnouncement}
                    onDownload={handleDownload}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Polls Section */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-100 p-4">
            <div className="flex items-center gap-3">
              <FaPoll className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">Polls</h2>
            </div>
          </div>
          <div className="p-4">
            {polls.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-gray-200 bg-gray-50 p-8 text-center">
                <FaPoll className="h-10 w-10 text-gray-300" />
                <div>
                  <p className="font-medium text-gray-600">No polls yet</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {activePolls.length > 0 && (
                  <div className="space-y-3">
                    {activePolls.map((poll) => (
                      <PollCard
                        key={poll.id}
                        poll={poll}
                        isCurrentUserCr={isCurrentUserCr}
                        selectedOption={selectedPolls[poll.id] ?? null}
                        onVote={handleVote}
                        onCancelVote={handleCancelVote}
                        onEditPoll={handleEditPoll}
                        onEndPoll={handleEndPoll}
                        onDeletePoll={handleDeletePoll}
                      />
                    ))}
                  </div>
                )}

                {endedPolls.length > 0 && (
                  <div className="mt-4">
                    <h3 className="mb-3 text-sm font-semibold text-gray-500">
                      Ended Polls ({endedPolls.length})
                    </h3>
                    <div className="space-y-2">
                      {endedPolls.map((poll) => (
                        <EndedPollCard
                          key={poll.id}
                          poll={poll}
                          isCurrentUserCr={isCurrentUserCr}
                          isExpanded={expandedPolls[poll.id] || false}
                          onToggleExpand={toggleExpandPoll}
                          onReopenPoll={handleReopenPoll}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CRCorner;

import React, { useState } from "react";
import {
  FaImage,
  FaPaperPlane,
  FaGlobe,
  FaUserFriends,
  FaLock,
  FaVideo,
  FaTag,
} from "react-icons/fa";
import type { IconType } from "react-icons";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  POST_VISIBILITY,
  POST_TYPES,
  POST_TARGET_MODELS,
} from "../../constants/post";
import { authHooks } from "../../hooks/useAuth";
import { groupHooks } from "../../hooks/useGroup";

const createMarketplacePostSchema = z.object({
  content: z
    .string()
    .min(1, "Post content cannot be empty")
    .max(2000, "Post content is too long"),
  tags: z.string().optional(),
  visibility: z.string(),
});

type CreateMarketplacePostFormData = z.infer<
  typeof createMarketplacePostSchema
>;

const CreateMarketplacePost: React.FC<{ groupId: string }> = ({ groupId }) => {
  const { user } = authHooks.useUser();
  const { mutate: createPost, isPending } = groupHooks.useCreateMarketplacePost();
  const [isExpanded, setIsExpanded] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { isValid },
  } = useForm<CreateMarketplacePostFormData>({
    resolver: zodResolver(createMarketplacePostSchema),
    defaultValues: {
      content: "",
      tags: "",
      visibility: POST_VISIBILITY.PUBLIC,
    },
  });

  const privacy = watch("visibility");
  const postContent = watch("content");

  const onSubmit = (data: CreateMarketplacePostFormData) => {
    const processedTags = data.tags
      ? data.tags
          .split(/[\s,]+/)
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0)
      : [];

    createPost(
      {
        ...data,
        postOnId: groupId,
        postOnModel: POST_TARGET_MODELS.GROUP,
        type: POST_TYPES.BUY_SELL, // BUY_SELL type for marketplace
        attachments: [],
        pollOptions: [],
        tags: processedTags,
      },
      {
        onSuccess: () => {
          reset();
          setIsExpanded(false);
        },
      }
    );
  };

  const privacyOptions: Array<{
    value: (typeof POST_VISIBILITY)[keyof typeof POST_VISIBILITY];
    label: string;
    Icon: IconType;
    show: boolean;
  }> = [
    {
      value: POST_VISIBILITY.PUBLIC,
      label: "Public",
      Icon: FaGlobe,
      show: true,
    },
    {
      value: POST_VISIBILITY.CONNECTIONS,
      label: "Connections",
      Icon: FaUserFriends,
      show: true,
    },
    {
      value: POST_VISIBILITY.ONLY_ME,
      label: "Only me",
      Icon: FaLock,
      show: true,
    },
  ];

  const mediaOptions: Array<{
    label: string;
    Icon: IconType;
    color: string;
    onClick: () => void;
    show: boolean;
  }> = [
    {
      label: "Photo",
      Icon: FaImage,
      color: "text-green-500",
      onClick: () => alert("Photo upload coming soon!"),
      show: true,
    },
    {
      label: "Video",
      Icon: FaVideo,
      color: "text-red-500",
      onClick: () => alert("Video upload coming soon!"),
      show: true,
    },
  ];

  return (
    <div className="rounded-lg border border-gray-400 bg-white p-4 shadow">
      {user?.restrictions?.isPostBlocked ? (
        <div className="rounded-lg bg-red-50 p-4 text-center">
          <p className="text-sm font-medium text-red-600">
            You are restricted from posting.
          </p>
          {user.restrictions.postRestriction?.reason && (
            <p className="mt-1 text-xs text-red-500">
              Reason: {user.restrictions.postRestriction.reason}
            </p>
          )}
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Header with icon */}
          <div className="mb-3 flex items-center gap-2 text-orange-600">
            <FaTag className="h-5 w-5" />
            <span className="font-semibold">Sell Something</span>
          </div>

          {/* User Avatar and Input */}
          <div className="flex space-x-3">
            <img
              src={user?.avatar}
              alt={user?.fullName || "Your avatar"}
              className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-300 object-cover"
            />
            <div className="flex-1">
              <div className="relative">
                <textarea
                  {...register("content")}
                  onFocus={() => setIsExpanded(true)}
                  placeholder="What are you selling? Include price, condition, etc."
                  className="w-full resize-none rounded-lg border border-gray-300 p-3 focus:border-transparent focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  rows={isExpanded ? 4 : 1}
                  maxLength={5000}
                />
              </div>
              {isExpanded && (
                <input
                  type="text"
                  {...register("tags")}
                  placeholder="Add tags (e.g., books, electronics, price)"
                  className="mt-2 w-full rounded-lg border border-gray-300 p-2 text-sm font-medium focus:border-transparent focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
              )}
            </div>
          </div>

          {/* Expanded Options */}
          {isExpanded && (
            <div className="mt-4">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center space-x-4">
                  {mediaOptions
                    .filter((opt) => opt.show)
                    .map((option) => (
                      <button
                        key={option.label}
                        type="button"
                        onClick={option.onClick}
                        className="flex items-center space-x-2 rounded-lg px-3 py-2 text-gray-600 transition-colors hover:bg-gray-100"
                      >
                        <option.Icon className={`h-5 w-5 ${option.color}`} />
                        <span className="text-sm font-medium">
                          {option.label}
                        </span>
                      </button>
                    ))}
                </div>

                {/* Privacy Selector */}
                <div className="flex items-center space-x-2">
                  {privacyOptions
                    .filter((opt) => opt.show)
                    .map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() =>
                          setValue("visibility", opt.value, {
                            shouldValidate: true,
                          })
                        }
                        aria-pressed={privacy === opt.value}
                        className={`flex items-center gap-2 rounded-lg px-3 py-1 text-sm font-medium transition-colors ${
                          privacy === opt.value
                            ? "bg-orange-50 text-orange-600"
                            : "text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        <opt.Icon className="h-4 w-4" />
                        <span className="hidden sm:inline">{opt.label}</span>
                      </button>
                    ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    reset();
                    setIsExpanded(false);
                  }}
                  className="flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:border-red-200 hover:bg-red-50"
                >
                  <span>Cancel</span>
                </button>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-400">
                    {postContent?.length || 0}/5000
                  </span>
                  <button
                    type="submit"
                    disabled={!isValid || isPending}
                    className="flex items-center space-x-2 rounded-lg bg-orange-600 px-6 py-2 text-white transition-colors hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <span>{isPending ? "Posting..." : "Post for Sale"}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Simple Post Button (when not expanded) */}
          {!isExpanded && postContent && (
            <div className="mt-3 flex justify-end">
              <button
                type="submit"
                disabled={isPending}
                className="flex items-center space-x-2 rounded-lg bg-orange-600 px-6 py-2 text-white transition-colors hover:bg-orange-700 disabled:opacity-50"
              >
                <FaPaperPlane className="h-4 w-4" />
                <span>{isPending ? "Posting..." : "Post"}</span>
              </button>
            </div>
          )}
        </form>
      )}
    </div>
  );
};

export default CreateMarketplacePost;





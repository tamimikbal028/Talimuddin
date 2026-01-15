import React, { useState, useRef } from "react";
import { FaCamera, FaImage, FaSpinner } from "react-icons/fa";
import { profileHooks } from "../../hooks/useProfile";

interface PhotosTabProps {
  avatar: string;
  coverImage?: string;
}

const PhotosTab: React.FC<PhotosTabProps> = ({ avatar, coverImage }) => {
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  // Preview states
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  // Hooks
  const { mutate: updateAvatar, isPending: isAvatarPending } =
    profileHooks.useUpdateAvatar();
  const { mutate: updateCover, isPending: isCoverPending } =
    profileHooks.useUpdateCoverImage();

  // Avatar handlers
  const handleAvatarSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Show preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setAvatarPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarUpload = () => {
    const file = avatarInputRef.current?.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    updateAvatar(formData, {
      onSuccess: () => {
        setAvatarPreview(null);
        if (avatarInputRef.current) avatarInputRef.current.value = "";
      },
    });
  };

  const cancelAvatarPreview = () => {
    setAvatarPreview(null);
    if (avatarInputRef.current) avatarInputRef.current.value = "";
  };

  // Cover handlers
  const handleCoverSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCoverPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverUpload = () => {
    const file = coverInputRef.current?.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("coverImage", file);

    updateCover(formData, {
      onSuccess: () => {
        setCoverPreview(null);
        if (coverInputRef.current) coverInputRef.current.value = "";
      },
    });
  };

  const cancelCoverPreview = () => {
    setCoverPreview(null);
    if (coverInputRef.current) coverInputRef.current.value = "";
  };

  return (
    <div className="space-y-6">
      {/* Profile Picture Section */}
      <div className="rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          <FaCamera className="mr-2 inline text-blue-600" />
          Profile Picture
        </h2>

        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
          {/* Current/Preview Image */}
          <div className="relative">
            <div className="h-40 w-40 overflow-hidden rounded-full border-4 border-gray-200 bg-gray-100">
              <img
                src={avatarPreview || avatar}
                alt="Avatar"
                className="h-full w-full object-cover"
              />
            </div>
            {avatarPreview && (
              <div className="absolute -top-2 -right-2 rounded-full bg-green-500 px-2 py-1 text-xs font-medium text-white">
                New
              </div>
            )}
          </div>

          {/* Upload Controls */}
          <div className="flex flex-1 flex-col gap-3">
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarSelect}
              className="hidden"
            />

            {!avatarPreview ? (
              <button
                type="button"
                onClick={() => avatarInputRef.current?.click()}
                className="rounded-lg border-2 border-dashed border-gray-300 px-6 py-4 text-gray-600 transition-colors hover:border-blue-400 hover:bg-blue-50"
              >
                <FaCamera className="mx-auto mb-2 text-2xl text-gray-400" />
                <span className="block font-medium">Choose New Photo</span>
                <span className="text-sm text-gray-500">
                  JPG, PNG or GIF (Max 5MB)
                </span>
              </button>
            ) : (
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleAvatarUpload}
                  disabled={isAvatarPending}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition-all hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30 active:scale-95 disabled:bg-blue-400"
                >
                  {isAvatarPending ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    "Save Avatar"
                  )}
                </button>
                <button
                  type="button"
                  onClick={cancelAvatarPreview}
                  disabled={isAvatarPending}
                  className="rounded-lg border border-red-100 bg-red-50 px-4 py-2 text-red-600 shadow-sm transition-all hover:bg-red-500 hover:text-white hover:shadow-md active:scale-95 disabled:opacity-50"
                >
                  Remove
                </button>
              </div>
            )}

            <p className="text-center text-sm font-medium text-gray-500">
              Recommended: Square image, at least 400×400px
            </p>
          </div>
        </div>
      </div>

      {/* Cover Image Section */}
      <div className="rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          <FaImage className="mr-2 inline text-purple-600" />
          Cover Image
        </h2>

        <div className="flex flex-col gap-4">
          {/* Current/Preview Cover */}
          <div className="relative">
            <div className="h-48 w-full overflow-hidden rounded-lg bg-gray-100">
              <img
                src={coverPreview || coverImage}
                alt="Cover"
                className="h-full w-full object-cover"
              />
            </div>
            {coverPreview && (
              <div className="absolute top-2 right-2 rounded-full bg-green-500 px-3 py-1 text-sm font-medium text-white">
                New Preview
              </div>
            )}
          </div>

          {/* Upload Controls */}
          <input
            ref={coverInputRef}
            type="file"
            accept="image/*"
            onChange={handleCoverSelect}
            className="hidden"
          />

          {!coverPreview ? (
            <>
              <button
                type="button"
                onClick={() => coverInputRef.current?.click()}
                className="rounded-lg border-2 border-dashed border-gray-300 px-6 py-4 text-gray-600 transition-colors hover:border-purple-400 hover:bg-purple-50"
              >
                <FaImage className="mx-auto mb-2 text-2xl text-gray-400" />
                <span className="block text-center font-medium text-black">
                  Choose Cover Image
                </span>
              </button>
              <span className="text-center text-sm font-medium text-gray-500">
                Recommended: 1500×500px for best display
              </span>
            </>
          ) : (
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleCoverUpload}
                disabled={isCoverPending}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-purple-600 px-4 py-2 font-semibold text-white transition-all hover:bg-purple-700 hover:shadow-lg hover:shadow-purple-500/30 active:scale-95 disabled:bg-purple-400"
              >
                {isCoverPending ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Uploading...
                  </>
                ) : (
                  "Save Cover Image"
                )}
              </button>
              <button
                type="button"
                onClick={cancelCoverPreview}
                disabled={isCoverPending}
                className="rounded-lg border border-red-100 bg-red-50 px-6 py-2 text-sm font-medium text-red-600 shadow-sm transition-all hover:bg-red-500 hover:text-white hover:shadow-md active:scale-95 disabled:opacity-50"
              >
                Remove
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PhotosTab;



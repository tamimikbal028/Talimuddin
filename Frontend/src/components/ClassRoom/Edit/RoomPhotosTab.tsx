import React, { useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaCamera, FaImage } from "react-icons/fa";
import { roomHooks } from "../../../hooks/useRoom";

interface RoomPhotosTabProps {
  coverImage: string;
}

const RoomPhotosTab: React.FC<RoomPhotosTabProps> = ({ coverImage }) => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const coverInputRef = useRef<HTMLInputElement>(null);

  const { mutate: updateCover, isPending: isUpdatingCover } =
    roomHooks.useUpdateRoomCoverImage();

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && roomId) {
      updateCover(
        { roomId, coverImage: file },
        {
          onSuccess: () => {
            navigate(`/classroom/rooms/${roomId}`);
          },
        }
      );
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 space-y-8 duration-500">
      {/* Cover Image Section */}
      <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Cover Image
        </h2>
        <div className="space-y-4">
          <div className="group relative aspect-[3/1] w-full overflow-hidden rounded-xl border border-dashed border-gray-300 bg-gray-50">
            {coverImage ? (
              <img
                src={coverImage}
                alt="Room Cover"
                className="h-full w-full object-cover transition-all group-hover:brightness-90"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 opacity-80">
                <FaImage className="text-4xl text-white/30" />
              </div>
            )}
            <button
              onClick={() => coverInputRef.current?.click()}
              disabled={isUpdatingCover}
              className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-gray-900 shadow-xl backdrop-blur-sm transition-all hover:scale-110 active:scale-95 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:opacity-50"
            >
              <FaCamera />
            </button>
            <input
              type="file"
              ref={coverInputRef}
              onChange={handleCoverChange}
              className="hidden"
              accept="image/*"
            />
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Recommend: 1200x400 pixels for best appearance across devices.
            </p>
            {isUpdatingCover && (
              <div className="flex items-center gap-2 text-sm font-medium text-blue-600">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
                Updating cover...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomPhotosTab;

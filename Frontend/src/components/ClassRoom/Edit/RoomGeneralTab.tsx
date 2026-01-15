import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { Room } from "../../../types/room.types";
import { roomHooks } from "../../../hooks/useRoom";
import { ROOM_TYPES } from "../../../constants/room";

interface RoomGeneralTabProps {
  room: Room;
}

const RoomGeneralTab: React.FC<RoomGeneralTabProps> = ({ room }) => {
  const navigate = useNavigate();
  const { roomId } = useParams();
  const [formData, setFormData] = useState({
    name: room.name,
    description: room.description || "",
    roomType: room.roomType,
  });

  const { mutate: updateDetails, isPending } = roomHooks.useUpdateRoomDetails();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateDetails(
      {
        roomId: roomId as string,
        updateData: formData,
      },
      {
        onSuccess: () => {
          navigate(`/classroom/rooms/${roomId}`);
        },
      }
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="animate-in fade-in slide-in-from-bottom-2 space-y-6 duration-500"
    >
      <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
        <h2 className="mb-6 text-xl font-bold text-gray-900">
          General Information
        </h2>

        <div className="space-y-5">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-semibold text-gray-700"
            >
              Room Name
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="e.g., Computer Science 101"
              className="mt-1.5 block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              required
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-semibold text-gray-700"
            >
              About the Room
            </label>
            <textarea
              id="description"
              rows={5}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Tell others what this room is about..."
              className="mt-1.5 block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <div>
            <label
              htmlFor="roomType"
              className="block text-sm font-semibold text-gray-700"
            >
              Room Type
            </label>
            <div className="mt-1.5 grid gap-3 sm:grid-cols-2">
              {[
                {
                  id: ROOM_TYPES.GENERAL,
                  label: "General",
                  desc: "For general purpose learning",
                },
                {
                  id: ROOM_TYPES.UNIVERSITY,
                  label: "University",
                  desc: "University level courses",
                },
                {
                  id: ROOM_TYPES.COLLEGE,
                  label: "College",
                  desc: "College level courses",
                },
                {
                  id: ROOM_TYPES.COACHING,
                  label: "Coaching",
                  desc: "Coaching center classes",
                },
                {
                  id: ROOM_TYPES.SCHOOL,
                  label: "School",
                  desc: "School level classes",
                },
              ].map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      roomType: option.id,
                    })
                  }
                  className={`flex flex-col items-start rounded-xl border-2 p-4 text-left transition-all ${
                    formData.roomType === option.id
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-100 hover:border-blue-200 hover:bg-gray-50"
                  }`}
                >
                  <span
                    className={`text-sm font-bold ${formData.roomType === option.id ? "text-blue-700" : "text-gray-900"}`}
                  >
                    {option.label}
                  </span>
                  <span className="mt-1 line-clamp-1 text-xs text-gray-500">
                    {option.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 flex items-center justify-end gap-3 border-t border-gray-100 pt-6">
          <button
            type="submit"
            disabled={
              isPending ||
              (formData.name === room.name &&
                formData.description === room.description &&
                formData.roomType === room.roomType)
            }
            className="flex min-w-[140px] items-center justify-center rounded-lg bg-blue-600 px-6 py-3 font-bold text-white shadow-lg shadow-blue-200 transition-all hover:bg-blue-700 hover:shadow-blue-300 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
          >
            {isPending ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Saving...
              </>
            ) : (
              "Update Details"
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default RoomGeneralTab;

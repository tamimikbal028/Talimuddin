import { useForm, Controller } from "react-hook-form";
import { FaChalkboardTeacher, FaChevronDown } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { roomHooks } from "../../hooks/useRoom";
import { useState, useRef, useEffect } from "react";
import { ROOM_PRIVACY, ROOM_TYPES } from "../../constants";

export type RoomFormValues = {
  name: string;
  description?: string;
  roomType: string;
  privacy: string;
  allowStudentPosting: boolean;
  allowComments: boolean;
};

const CreateRoomForm = () => {
  const navigate = useNavigate();
  const [showRoomTypeDropdown, setShowRoomTypeDropdown] = useState(false);
  const roomTypeRef = useRef<HTMLDivElement>(null);

  const { mutate: createRoom, isPending } = roomHooks.useCreateRoom();

  const handleCreate = (data: RoomFormValues) => {
    createRoom(data, {
      onSuccess: () => {
        navigate("/classroom");
      },
    });
  };

  const { register, handleSubmit, formState, control } =
    useForm<RoomFormValues>({
      defaultValues: {
        name: "",
        description: "",
        roomType: ROOM_TYPES.MAIN_ROOM,
        privacy: ROOM_PRIVACY.PUBLIC,
        allowStudentPosting: true,
        allowComments: true,
      },
    });

  const { errors } = formState;

  const roomTypes = [
    { value: ROOM_TYPES.MAIN_ROOM, label: "Main Room" },
    { value: ROOM_TYPES.SUB_ROOM, label: "Sub Room" },
  ];

  const getRoomTypeLabel = (value: string) => {
    return roomTypes.find((type) => type.value === value)?.label;
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        roomTypeRef.current &&
        !roomTypeRef.current.contains(event.target as Node)
      ) {
        setShowRoomTypeDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <form onSubmit={handleSubmit(handleCreate)} className="w-full space-y-5">
      <div className="mb-6 flex items-start gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg">
          <FaChalkboardTeacher className="h-6 w-6" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">
            Create a New Study Room
          </h3>
          <p className="mt-1 text-sm font-medium text-gray-500">
            Set up a collaborative space for your class
          </p>
        </div>
      </div>

      {/* Room Name Field */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-gray-700">
          Room Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          {...register("name", {
            required: "Room name is required",
            minLength: {
              value: 3,
              message: "Room name must be at least 3 characters",
            },
          })}
          placeholder="e.g., CSE 2-1 Study Group"
          className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 shadow-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        {errors.name?.message && (
          <p className="mt-1.5 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      {/* Description Field */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-gray-700">
          Description
        </label>
        <textarea
          {...register("description")}
          placeholder="Brief description of the room (optional)"
          rows={3}
          className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 shadow-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      {/* Room Type and Privacy */}
      <div className="flex justify-between gap-5">
        {/* Room Type */}
        <div className="w-full">
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Room Type <span className="text-red-500">*</span>
          </label>
          <Controller
            name="roomType"
            control={control}
            rules={{ required: "Room type is required" }}
            render={({ field }) => (
              <div className="relative" ref={roomTypeRef}>
                <button
                  type="button"
                  onClick={() => setShowRoomTypeDropdown(!showRoomTypeDropdown)}
                  className="flex w-full items-center justify-between rounded-lg border border-gray-300 bg-white px-4 py-3 text-left text-gray-900 shadow-sm transition-colors hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <span className="font-medium">
                    {getRoomTypeLabel(field.value)}
                  </span>
                  <FaChevronDown
                    className={`h-4 w-4 text-gray-500 transition-transform ${
                      showRoomTypeDropdown ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {showRoomTypeDropdown && (
                  <div className="absolute top-full left-0 z-50 mt-2 w-full rounded-lg border border-gray-200 bg-white shadow-lg">
                    {roomTypes.map((type) => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => {
                          field.onChange(type.value);
                          setShowRoomTypeDropdown(false);
                        }}
                        className={`flex w-full items-center px-4 py-3 text-left transition-colors hover:bg-gray-50 ${
                          field.value === type.value ? "bg-blue-50" : ""
                        }`}
                      >
                        <span
                          className={`text-sm font-semibold ${
                            field.value === type.value
                              ? "text-blue-600"
                              : "text-gray-900"
                          }`}
                        >
                          {type.label}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          />
          {errors.roomType?.message && (
            <p className="mt-1.5 text-sm text-red-600">
              {errors.roomType.message}
            </p>
          )}
        </div>
      </div>

      {/* Settings */}
      <div className="space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
        <h4 className="text-xl font-semibold text-gray-700">Room Settings</h4>

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            {...register("allowStudentPosting")}
            className="h-4 w-4 rounded border-gray-300 text-blue-600"
          />
          <span className="text-sm font-medium text-gray-700">
            Allow students to create posts
          </span>
        </label>

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            {...register("allowComments")}
            className="h-4 w-4 rounded border-gray-300 text-blue-600"
          />
          <span className="text-sm font-medium text-gray-700">
            Allow comments on posts
          </span>
        </label>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 border-t border-gray-200 pt-5">
        <button
          type="button"
          onClick={() => {
            navigate("/classroom");
          }}
          className="cursor-pointer rounded-lg border border-red-500 bg-white px-5 py-2.5 text-sm font-semibold text-red-500 shadow-sm transition-colors hover:bg-red-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:bg-blue-700"
        >
          {isPending ? "Creating..." : "Create Room"}
        </button>
      </div>
    </form>
  );
};

export default CreateRoomForm;

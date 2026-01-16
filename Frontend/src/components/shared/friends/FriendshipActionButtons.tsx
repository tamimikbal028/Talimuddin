import React from "react";
import Swal from "sweetalert2";
import { commonFriendshipHooks } from "../../../hooks/common/useFriendship";
import {
  AddFriendButton,
  CancelButton,
  AcceptButton,
  RejectButton,
  UnfriendButton,
  UnblockButton,
  MessageButton,
} from "./FriendActions";
import { USER_RELATION_STATUS } from "../../../constants";
import { toast } from "sonner";

interface FriendshipActionButtonsProps {
  userId: string;
  user_relation_status: (typeof USER_RELATION_STATUS)[keyof typeof USER_RELATION_STATUS];
  onActionSuccess?: () => void;
}

const FriendshipActionButtons: React.FC<FriendshipActionButtonsProps> = ({
  userId,
  user_relation_status,
  onActionSuccess,
}) => {
  // Hooks
  const { mutate: sendRequest, isPending: isSending } =
    commonFriendshipHooks.useSendRequest();
  const { mutate: cancelRequest, isPending: isCanceling } =
    commonFriendshipHooks.useCancelRequest();
  const { mutate: acceptRequest, isPending: isAccepting } =
    commonFriendshipHooks.useAcceptRequest();
  const { mutate: rejectRequest, isPending: isRejecting } =
    commonFriendshipHooks.useRejectRequest();
  const { mutate: unfriend, isPending: isUnfriending } =
    commonFriendshipHooks.useUnfriend();
  const { mutate: unblockUser, isPending: isUnblocking } =
    commonFriendshipHooks.useUnblock();

  // Placeholders for messaging logic (to be implemented later)
  const isMessaging = false;
  const handleMessage = () => {
    // TODO: Implement navigation to chat/message room
    toast("Messaging pore kora hobe");
  };

  // Handlers
  const handleSendRequest = () => {
    sendRequest(
      { userId },
      {
        onSuccess: () => onActionSuccess?.(),
      }
    );
  };

  const handleCancelRequest = () => {
    cancelRequest(
      { recipientId: userId },
      {
        onSuccess: () => onActionSuccess?.(),
      }
    );
  };

  const handleAcceptRequest = () => {
    acceptRequest(
      { requesterId: userId },
      {
        onSuccess: () => onActionSuccess?.(),
      }
    );
  };

  const handleRejectRequest = () => {
    rejectRequest(
      { requesterId: userId },
      {
        onSuccess: () => onActionSuccess?.(),
      }
    );
  };

  const handleUnfriend = () => {
    Swal.fire({
      title: "Unfriend?",
      text: "Are you sure you want to remove this friend?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, unfriend!",
    }).then((result) => {
      if (result.isConfirmed) {
        unfriend(
          { friendId: userId },
          {
            onSuccess: () => onActionSuccess?.(),
          }
        );
      }
    });
  };

  const handleUnblock = () => {
    Swal.fire({
      title: "Unblock?",
      text: "Are you sure you want to unblock this user?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, unblock!",
    }).then((result) => {
      if (result.isConfirmed) {
        unblockUser(
          { userId },
          {
            onSuccess: () => onActionSuccess?.(),
          }
        );
      }
    });
  };

  // Render Logic based on Standardized Status
  switch (user_relation_status) {
    case USER_RELATION_STATUS.FRIEND:
      return (
        <div className="flex items-center gap-2">
          <MessageButton onClick={handleMessage} disabled={isMessaging} />
          <UnfriendButton onClick={handleUnfriend} disabled={isUnfriending} />
        </div>
      );

    case USER_RELATION_STATUS.REQUEST_SENT:
      return (
        <CancelButton onClick={handleCancelRequest} disabled={isCanceling} />
      );

    case USER_RELATION_STATUS.REQUEST_RECEIVED:
      return (
        <div className="flex items-center gap-2">
          <AcceptButton onClick={handleAcceptRequest} disabled={isAccepting} />
          <RejectButton onClick={handleRejectRequest} disabled={isRejecting} />
        </div>
      );

    case USER_RELATION_STATUS.BLOCKED:
      return <UnblockButton onClick={handleUnblock} disabled={isUnblocking} />;

    case USER_RELATION_STATUS.BLOCKED_BY_THEM:
    case USER_RELATION_STATUS.SELF:
      return null;

    default:
      return (
        <AddFriendButton onClick={handleSendRequest} disabled={isSending} />
      );
  }
};

export default FriendshipActionButtons;

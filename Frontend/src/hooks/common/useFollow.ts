import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { followService } from "../../services/common/follow.service";
import type { ApiError } from "../../types";
import type { AxiosError } from "axios";
import { FOLLOW_TARGET_MODELS } from "../../constants";

// ইন্টারফেস ডিফাইন করা হলো যাতে প্যারামিটার টাইপ বোঝা যায়
interface UseToggleFollowProps {
  invalidateKey?: (string | undefined)[]; // যেই কুয়েরিটি রিফ্রেশ করতে হবে (Dynamic Key)
}

const useToggleFollow = ({ invalidateKey }: UseToggleFollowProps = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      targetId,
      targetModel,
    }: {
      targetId: string;
      targetModel: (typeof FOLLOW_TARGET_MODELS)[keyof typeof FOLLOW_TARGET_MODELS];
    }) => followService.toggleFollow(targetId, targetModel),

    onSuccess: (response) => {
      toast.success(response.message);

      // আগে এখানে ["profile_header"] ফিক্সড ছিল, এখন এটি ডাইনামিক
      if (invalidateKey) {
        queryClient.invalidateQueries({ queryKey: invalidateKey });
      }
    },

    onError: (error: AxiosError<ApiError>) => {
      const message = error?.response?.data?.message;
      toast.error(message || "Error from useToggleFollow");
    },
  });
};

const followHooks = {
  useToggleFollow,
} as const;

export { followHooks };

import { useState } from "react";
import type { ICommentReply } from "../interfaces";
import { axiosInstance } from "../api/axiosInstance";
import { handleAxiosError } from "../utils/handleAxiosError";

const useCommentReply = (id: string, count: number) => {
  const [replies, setReplies] = useState<ICommentReply[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [repliesCount, setRepliesCount] = useState<number>(count);
  const [repliesVisible, setRepliesVisible] = useState<boolean>(false);
  const [isReplyInputVisible, setIsReplyInputVisible] =
    useState<boolean>(false);

  //   const fetchDataOnce = useRef<boolean>(false);

  // Fetches the replies (sub-comments)
  const getReplies = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/comments/comment/${id}`);
      setReplies(response.data?.subComments);
    } catch (err) {
      handleAxiosError(err, "Failed to get replies!", setError, true);
    } finally {
      setLoading(false);
    }
  };

  // Shows/hides replies
  const toggleRepliesVisibility = () => {
    if (!repliesVisible) getReplies();

    setRepliesVisible((prev) => !prev);
  };
  const cancelReplying = () => setIsReplyInputVisible(false);

  const displayReplyInput = () => setIsReplyInputVisible(true);

  return {
    replies,
    loading,
    error,
    getReplies,
    repliesCount,
    repliesVisible,
    toggleRepliesVisibility,
    setRepliesCount,
    cancelReplying,
    displayReplyInput,
    isReplyInputVisible,
  };
};
export default useCommentReply;

import { useEffect, useState } from "react";
import CommentInput from "../components/CommentInput";
import Comment from "../components/Comment";
import CommentSkeleton from "../components/skeletons/CommentSkeleton";
import { axiosInstance } from "../api/axiosInstance";
import { handleAxiosError } from "../utils/handleAxiosError";
import type { IComment } from "../interfaces";

const CommentsSection = ({ postId }: { postId?: string }) => {
  const [comments, setComments] = useState<IComment[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | undefined>(undefined);

  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const getComments = async () => {
    setError(undefined);
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/comments/post/${postId}`);
      setComments(response.data?.comments);
      console.log(response.data?.comments);
    } catch (err) {
      handleAxiosError(err, "Failed to fetch Comments!", setError, true);
    } finally {
      setLoading(false);
    }
  };

  const deleteComment = async (commentId: string) => {
    setIsDeleting(true);
    try {
      await axiosInstance.delete(`/comments/${commentId}`);
      getComments();
    } catch (err) {
      handleAxiosError(err, "Failed to delete comment!");
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    if (!postId) return;

    getComments();
  }, [postId]);

  return (
    <section className="flex flex-col gap-3 w-full sm:w-5/6 mt-12 relative">
      <h4 className="text-primary font-semibold text-xl">Comments</h4>
      <CommentInput
        refreshComments={getComments}
        postId={postId}
        repliedToCommentId={null}
        className="mt-6 my-4"
      />
      <div className="flex flex-col w-full py-5 gap-6">
        {loading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <CommentSkeleton key={index} />
          ))
        ) : error ? (
          <p className="text-center w-full mt-12 flex items-center justify-center gap-4">
            {error}{" "}
            <button
              disabled={loading}
              onClick={getComments}
              className="border-none text-primary hover:text-primary-hover transition cursor-pointer"
            >
              Retry
            </button>
          </p>
        ) : (
          comments && (
            <>
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <Comment
                    isDeleting={isDeleting}
                    key={comment?.id}
                    {...comment}
                    deleteComment={deleteComment}
                  />
                ))
              ) : (
                <p className="text-center w-full mt-12">No Comments</p>
              )}
            </>
          )
        )}
      </div>
    </section>
  );
};
export default CommentsSection;

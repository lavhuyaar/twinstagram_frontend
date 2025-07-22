import { useEffect, useState } from "react";
import { Link } from "react-router";
import useAuth from "../hooks/useAuth";
import MainLayout from "../components/MainLayout";
import RequestSkeleton from "../components/skeletons/RequestSkeleton";
import Error from "../components/Error";
import { axiosInstance } from "../api/axiosInstance";
import { handleAxiosError } from "../utils/handleAxiosError";
import type { IFollowUser } from "../interfaces";

const SentRequests = () => {
  const [requests, setRequests] = useState<IFollowUser[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const { userData } = useAuth();

  const getRequests = async (stopLoading?: boolean) => {
    setError(undefined);
    if (!stopLoading) setLoading(true); //Makes sure that skeletons are only shown on initial loading
    try {
      const response = await axiosInstance.get(
        "/follow/pending/followingRequests"
      );
      setRequests(response.data?.pendingFollowings);
    } catch (err) {
      handleAxiosError(err, "Failed to get sent requests!", setError, true);
    } finally {
      if (!stopLoading) setLoading(false);
    }
  };

  // Deletes the sent request
  const undoSentRequest = async (requestId: string) => {
    setIsUpdatingStatus(true);
    try {
      await axiosInstance.delete(`/follow/${requestId}`);
      getRequests(true);
    } catch (err) {
      handleAxiosError(err, "Failed to cancel sent request!");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  useEffect(() => {
    if (!userData) return;
    getRequests();
  }, [userData]);

  if (error) {
    return <Error error={error} onRetry={getRequests} />;
  }

  return (
    <>
      <MainLayout>
        <section className="flex flex-col w-full">
          <h1 className="text-3xl font-bold w-full text-start text-primary">
            Sent Requests
          </h1>
          <em className="text-start w-full mt-1 text-sm text-text-muted">
            This is the list of people whom you have requested to follow
          </em>
          <span className="w-full h-[2px] bg-primary mt-1"></span>
        </section>
        <section className="flex flex-col mt-6 md:mt-12 w-full">
          {loading ? (
            Array.from({ length: 8 }).map((_, index) => (
              <RequestSkeleton key={index} />
            ))
          ) : requests && requests.length > 0 ? (
            requests.map((request) => (
              <div
                key={request.id}
                className={`flex items-center gap-3 sm:gap-6 border-b border-text-muted/30 pb-4 relative ${
                  isUpdatingStatus ? "pointer-events-none" : ""
                }`}
              >
                <img
                  src={request?.requestTo?.profilePicture ?? "/blank-pfp.webp"}
                  alt=""
                  className="shrink-0 size-[40px] rounded-full object-center object-cover"
                />
                <div>
                  <div className="w-full flex items-center gap-3">
                    <Link
                      to={`/u/${request?.requestTo?.id}`}
                      className="font-medium text-lg hover:text-primary transition"
                    >
                      {request?.requestTo?.username}
                    </Link>
                  </div>
                  <h4 className="text-text-muted text-xs">
                    {request?.requestTo?.firstName}{" "}
                    {request?.requestTo?.lastName}
                  </h4>
                </div>

                <div className="flex items-center justify-end gap-2 sm:gap-4 ml-auto flex-wrap">
                  <button
                    disabled={isUpdatingStatus}
                    onClick={() => undoSentRequest(request.id)}
                    className={`${
                      isUpdatingStatus ? "bg-primary/40" : ""
                    } border-2 border-text-primary hover:bg-primary-hover/30 text-text-primary rounded-md transition cursor-pointer font-semibold text-sm sm:text-[16px] px-4 py-1`}
                  >
                    Request Sent
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="w-full h-[40vh] items-center flex justify-center">
              <h4 className="text-center p-2 font-medium text-xl">
                No sent requests
              </h4>
            </div>
          )}
        </section>
      </MainLayout>
    </>
  );
};
export default SentRequests;

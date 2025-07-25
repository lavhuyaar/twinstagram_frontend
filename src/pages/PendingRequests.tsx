import { useEffect, useState } from "react";
import { Link } from "react-router";
import useAuth from "../hooks/useAuth";
import MainLayout from "../components/MainLayout";
import RequestSkeleton from "../components/skeletons/RequestSkeleton";
import Error from "../components/Error";
import { axiosInstance } from "../api/axiosInstance";
import { handleAxiosError } from "../utils/handleAxiosError";
import type { IFollowUser } from "../interfaces";

const PendingRequests = () => {
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
        "/follow/pending/followRequests"
      );
      setRequests(response.data?.pendingFollowRequests);
    } catch (err) {
      handleAxiosError(
        err,
        "Failed to get pending follow requests!",
        setError,
        true
      );
    } finally {
      if (!stopLoading) setLoading(false);
    }
  };

  // Accepts request
  const acceptRequest = async (requestId: string) => {
    setIsUpdatingStatus(true);
    try {
      await axiosInstance.put(`/follow/request/${requestId}/accept`);
      getRequests(true);
    } catch (err) {
      handleAxiosError(err, "Failed to accept request!");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Rejects request
  const rejectRequest = async (requestId: string) => {
    setIsUpdatingStatus(true);
    try {
      await axiosInstance.delete(`/follow/${requestId}`);
      getRequests(true);
    } catch (err) {
      handleAxiosError(err, "Failed to reject request!");
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
            Pending Requests
          </h1>
          <em className="text-start w-full mt-1 text-sm text-text-muted">
            This is the list of people who have requested to follow you
          </em>
          <span className="w-full h-[2px] bg-primary mt-1"></span>
        </section>
        <div className="flex flex-col mt-6 md:mt-12 w-full">
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
                  src={request?.requestBy?.profilePicture ?? "/blank-pfp.webp"}
                  alt=""
                  className="shrink-0 size-[40px] rounded-full object-center object-cover"
                />
                <div>
                  <div className="w-full flex items-center gap-3">
                    <Link
                      to={`/u/${request?.requestBy?.id}`}
                      className="font-medium text-lg hover:text-primary transition"
                    >
                      {request?.requestBy?.username}
                    </Link>
                  </div>
                  <h4 className="text-text-muted text-xs">
                    {request?.requestBy?.firstName}{" "}
                    {request?.requestBy?.lastName}
                  </h4>
                </div>

                <div className="flex items-center justify-end gap-2 sm:gap-4 ml-auto flex-wrap">
                  <button
                    disabled={isUpdatingStatus}
                    onClick={() => rejectRequest(request.id)}
                    className={`${
                      isUpdatingStatus ? "bg-primary/40" : ""
                    } bg-primary/40 hover:bg-primary-hover rounded-md sm:text-[16px] transition px-4 py-[3px] text-primary-txt font-semibold cursor-pointer`}
                  >
                    Reject
                  </button>
                  <button
                    disabled={isUpdatingStatus}
                    onClick={() => acceptRequest(request.id)}
                    className={`${
                      isUpdatingStatus ? "bg-primary/40" : ""
                    } bg-primary hover:bg-primary-hover transition px-4 py-[4px] text-primary-txt text-sm sm:text-[16px] rounded-md font-semibold cursor-pointer`}
                  >
                    Accept
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="w-full h-[40vh] items-center flex justify-center">
              <h4 className="text-center p-2 font-medium text-xl">
                No follow requests
              </h4>
            </div>
          )}
        </div>
      </MainLayout>
    </>
  );
};
export default PendingRequests;

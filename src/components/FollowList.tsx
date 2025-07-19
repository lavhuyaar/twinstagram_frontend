import { useEffect, useState } from "react";
import { NavLink } from "react-router";
import { RxCross2 } from "react-icons/rx";
import useAuth from "../hooks/useAuth";
import Modal from "./Modal";
import UserSkeleton from "./skeletons/UserSkeleton";
import { axiosInstance } from "../api/axiosInstance";
import { handleAxiosError } from "../utils/handleAxiosError";
import { abbreviateNumber } from "../utils/abbreviateNumber";
import type { IFollowUser } from "../interfaces";

const FollowList = ({
  count,
  permitToView,
  profileId,
  fetchFollowing,
  disabled,
}: {
  count: number;
  permitToView?: boolean;
  profileId?: string;
  fetchFollowing: boolean;
  disabled: boolean;
}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [users, setUsers] = useState<IFollowUser[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | undefined>(undefined);
  const [requestLoading, setRequestLoading] = useState<boolean>(false);
  const { userData } = useAuth();

  const getUsers = async (id?: string) => {
    if (!id) return;
    setLoading(true);
    try {
      // Following
      if (fetchFollowing) {
        const response = await axiosInstance.get(`/follow/followings/${id}`);
        setUsers(response.data?.followings);
      } else {
        // Followers
        const response = await axiosInstance.get(`/follow/followers/${id}`);
        setUsers(response.data?.followers);
      }
    } catch (err) {
      handleAxiosError(err, undefined, setError, true);
    } finally {
      setLoading(false);
    }
  };

  // Creates or deletes follow request
  const toggleRequest = async (
    isDelete: boolean,
    targetUserId?: string,
    requestId?: string
  ) => {
    if (isDelete && !requestId) return;
    if (!isDelete && !targetUserId) return;

    setRequestLoading(true);
    try {
      if (isDelete) {
        await axiosInstance.delete(`/follow/${requestId}`); //Deletes existing request (cancels sent request or unfollows)
      } else {
        await axiosInstance.post(`/follow/new/${targetUserId}`); // Directly follows user (if public) or sents follow request
      }

      // Re-fetches following users
      if (fetchFollowing) {
        const response = await axiosInstance.get(
          `/follow/followings/${profileId}`
        );
        setUsers(response.data?.followings);
      } else {
        // Re-fetches Followers
        const response = await axiosInstance.get(
          `/follow/followers/${profileId}`
        );
        setUsers(response.data?.followers);
      }
    } catch (err) {
      handleAxiosError(err);
    } finally {
      setRequestLoading(false);
    }
  };

  useEffect(() => {
    if (!isModalOpen || !profileId) return;
    getUsers(profileId);
  }, [isModalOpen, profileId]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setLoading(true);
  };

  // VERY IMPORTANT -------------------

  // The requestUserKey below is different due to Prisma model
  // requestTo is the user to which the follow request was sent to
  // requestBy is the user that created the follow request (follower)
  // Both requestTo and requestBy object returns following[0] if the Current User (userData) has created a follow request to either of them

  const requestUserKey: "requestTo" | "requestBy" = fetchFollowing
    ? "requestTo"
    : "requestBy";

  //  ---------------------------------

  return (
    <>
      {permitToView ? (
        <button
          disabled={disabled}
          onClick={openModal}
          className={`flex flex-col text-center items-center  transition ${
            disabled ? "" : "hover:text-primary-hover cursor-pointer"
          }`}
        >
          {" "}
          <p className="text-xl md:text-2xl font-medium">
            {abbreviateNumber(count)}
          </p>
          <p className="text-normal text-sm">
            {" "}
            {fetchFollowing ? "Following" : "Followers"}
          </p>
        </button>
      ) : (
        <div className="flex flex-col text-center items-center">
          <p className="text-xl md:text-2xl font-medium">
            {abbreviateNumber(count)}
          </p>
          <p className="text-normal text-sm">
            {" "}
            {fetchFollowing ? "Following" : "Followers"}
          </p>
        </div>
      )}

      {isModalOpen && (
        <Modal className="w-[500px] !p-6">
          <div className="flex items-center justify-between w-full gap-6">
            <h5 className="font-medium text-xl text-primary">
              {" "}
              {fetchFollowing ? "Following" : "Followers"}
            </h5>

            <button
              type="button"
              disabled={requestLoading}
              onClick={closeModal}
              title="Close modal"
              className="rounded-full cursor-pointer hover:text-primary-hover transition text-text-primary"
            >
              <RxCross2 className="text-2xl" />
            </button>
          </div>

          <span className="bg-primary w-full h-[1px]"></span>

          <div className="w-full h-[300px] md:h-[500px] overflow-y-auto flex flex-col">
            {error && (
              <div className="flex flex-col my-auto">
                <p className="w-full text-xl text-center">{error}</p>
                <button
                  onClick={() => getUsers(profileId)}
                  className="px-4 py-1 text-primary hover:text-primary-hover transition cursor-pointer"
                >
                  Retry
                </button>
              </div>
            )}
            {loading ? (
              <div className="flex flex-col w-full">
                {Array.from({ length: 10 }).map((_, index) => (
                  <UserSkeleton key={index} />
                ))}
              </div>
            ) : (
              users && (
                <div className="flex flex-col w-full">
                  {users.length > 0 ? (
                    users.map((user) => (
                      <div
                        key={user?.id}
                        className={`w-full flex items-center gap-3 py-3 border-b border-text-muted/20 ${
                          requestLoading ? "pointer-events-none" : ""
                        }`}
                      >
                        <img
                          alt=""
                          src={
                            user[requestUserKey]?.profilePicture ??
                            "/blank-pfp.webp"
                          }
                          className="shrink-0 size-[40px] rounded-full object-center object-cover"
                        />
                        <div className="flex flex-col hover:text-primary-hover transition">
                          <NavLink
                            to={`/u/${user[requestUserKey]?.id}`}
                            className="font-semibold"
                          >
                            {user[requestUserKey]?.username}
                          </NavLink>
                          <div className="text-[13px] text-text-secondary">
                            {`${user[requestUserKey]?.firstName} ${user[requestUserKey]?.lastName}`}
                          </div>
                        </div>
                        {/* No button appears if User sees himself in followers or following */}
                        {userData?.id === user[requestUserKey]?.id ? (
                          <></>
                        ) : (
                          <>
                            {/* Deletes follow request if followers[0] exists */}
                            {user[requestUserKey]?.followers[0] ? (
                              <button
                                disabled={requestLoading}
                                onClick={() =>
                                  toggleRequest(
                                    true,
                                    undefined,
                                    user[requestUserKey]?.followers[0]?.id
                                  )
                                }
                                className={`rounded-md ml-auto text-[14px] sm:text-[16px] transition cursor-pointer font-semibold border-1 border-text-primary hover:bg-primary-hover/30 text-text-primary px-2 py-1`}
                              >
                                {user[requestUserKey]?.followers[0]
                                  .isFollowing === "TRUE"
                                  ? "Unfollow"
                                  : user[requestUserKey]?.followers[0]
                                      .isFollowing === "PENDING"
                                  ? "Request sent"
                                  : ""}
                              </button>
                            ) : (
                              // Creates follow request if followers[0] does not exist
                              <button
                                disabled={requestLoading}
                                onClick={() =>
                                  toggleRequest(false, user[requestUserKey]?.id)
                                }
                                className={`rounded-md ml-auto text-[14px] sm:text-[16px] transition px-2 py-1 cursor-pointer font-semibold bg-primary border-1 text-primary-txt border-primary hover:bg-primary-hover hover:border-primary-hover`}
                              >
                                Follow
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    ))
                  ) : (
                    <>
                      <h6 className="font-semibold w-full text-center self-center mt-12 text-lg">
                        {fetchFollowing ? "No following" : "No followers"}
                      </h6>
                    </>
                  )}
                </div>
              )
            )}
          </div>
        </Modal>
      )}
    </>
  );
};
export default FollowList;

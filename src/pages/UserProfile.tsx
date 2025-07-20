import { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router";
import useAuth from "../hooks/useAuth";
import MainLayout from "../components/MainLayout";
import ProfilePosts from "../sections/ProfilePosts";
import FollowList from "../components/FollowList";
import ProfileSkeleton from "../components/skeletons/ProfileSkeleton";
import Error from "../components/Error";
import { axiosInstance } from "../api/axiosInstance";
import { handleAxiosError } from "../utils/handleAxiosError";
import { abbreviateNumber } from "../utils/abbreviateNumber";
import type { IUser } from "../interfaces";
import { FOLLOWING_STATUS, PROFILE_TYPE } from "../constants/constants";

type Following = "TRUE" | "FALSE" | "PENDING";

const UserProfile = () => {
  const [profile, setProfile] = useState<IUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [postsVisible, setPostsVisible] = useState<boolean | undefined>(
    undefined
  );
  const [isFollowing, setIsFollowing] = useState<Following>(
    FOLLOWING_STATUS.FALSE
  );
  const [followRequestId, setFollowRequestId] = useState<string | null>(null);
  const [sendingRequest, setSendingRequest] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const { userData } = useAuth();
  const { userId } = useParams();

  // Indicates if someone is seeing his own profile
  const isMyProfile: boolean | null = userData && userData.id === userId;

  // Fetches profile data
  const getProfile = async (id?: string) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/profile/${id}`);
      const { profile, isFollowing, followRequestId, type } = response.data;

      // Basic profile stats are visible to everyone
      setProfile(profile);

      // If user is following the profile
      setIsFollowing(isFollowing);

      setFollowRequestId(followRequestId);

      // Ensures that posts are only visible to user, his followers, and to everyone if his account is public
      if (isMyProfile || type === PROFILE_TYPE.PUBLIC || isFollowing === FOLLOWING_STATUS.TRUE) {
        setPostsVisible(true);
      } else setPostsVisible(false);
    } catch (err) {
      handleAxiosError(err, undefined, setError, true);
    } finally {
      setLoading(false);
    }
  };

  // Sends follow request
  const createFollowRequest = async (id?: string) => {
    if (!id) return;
    setSendingRequest(true);
    try {
      await axiosInstance.post(`/follow/new/${id}`); //Creates new request

      //Updates profile
      const response = await axiosInstance.get(`/profile/${id}`);
      const { profile, isFollowing, followRequestId, type } = response.data;

      // Basic profile stats are visible to everyone
      setProfile(profile);

      // If user is following the profile
      setIsFollowing(isFollowing);

      setFollowRequestId(followRequestId);

      // Ensures that posts are only visible to user, his followers, and to everyone if his account is public
      if (
        isMyProfile ||
        type === PROFILE_TYPE.PUBLIC ||
        isFollowing === FOLLOWING_STATUS.TRUE
      ) {
        setPostsVisible(true);
      } else setPostsVisible(false);
    } catch (err) {
      handleAxiosError(err);
    } finally {
      setSendingRequest(false);
    }
  };

  // Deletes follow request
  const deleteFollowRequest = async (
    id?: string,
    requestId?: string | null
  ) => {
    if (!id || !requestId) return;
    setSendingRequest(true);
    try {
      await axiosInstance.delete(`/follow/${requestId}`);

      //Updates profile
      const response = await axiosInstance.get(`/profile/${id}`);
      const { profile, isFollowing, followRequestId, type } = response.data;

      // Basic profile stats are visible to everyone
      setProfile(profile);

      // If user is following the profile
      setIsFollowing(isFollowing);

      setFollowRequestId(followRequestId);

      // Ensures that posts are only visible to user, his followers, and to everyone if his account is public
      if (isMyProfile || type === PROFILE_TYPE.PUBLIC || isFollowing === FOLLOWING_STATUS.TRUE) {
        setPostsVisible(true);
      } else setPostsVisible(false);
    } catch (err) {
      handleAxiosError(err);
    } finally {
      setSendingRequest(false);
    }
  };

  useEffect(() => {
    if (!userId) return;

    getProfile(userId);
  }, [userId]);

  // Error page
  if (error) {
    return <Error error={error} onRetry={() => getProfile(userId)} />;
  }

  return (
    <>
      <MainLayout>
        <div className="flex w-full items-center flex-col justify-center">
          {loading ? (
            <ProfileSkeleton />
          ) : (
            <>
              <h2 className="text-center font-bold text-2xl">
                {profile?.username}
              </h2>
              <section className="flex flex-col gap-3 mt-6 items-center">
                <div className="flex items-center gap-6 md:gap-12">
                  <img
                    src={profile?.profilePicture ?? "/blank-pfp.webp"}
                    alt=""
                    className="rounded-full size-[70px] md:size-[120px] shrink-0 object-center object-cover"
                  />
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-4 md:gap-12">
                      <div className="flex flex-col text-center items-center">
                        <p className="text-xl md:text-2xl font-medium">
                          {abbreviateNumber(profile?._count?.posts)}
                        </p>
                        <p className="text-normal text-sm">Posts</p>
                      </div>

                      {/* Gives permission to see followers and following of Profile (user) */}
                      {typeof profile?._count?.followers === "number" && (
                        <FollowList
                          permitToView={postsVisible}
                          profileId={profile.id}
                          count={profile._count.followers}
                          fetchFollowing={false}
                          disabled={sendingRequest}
                        />
                      )}
                      {typeof profile?._count?.following === "number" && (
                        <FollowList
                          permitToView={postsVisible}
                          profileId={profile.id}
                          count={profile._count.following}
                          fetchFollowing={true}
                          disabled={sendingRequest}
                        />
                      )}
                    </div>
                    {isMyProfile === true ? (
                      <NavLink
                        to="/settings?selected=edit_profile"
                        className="w-full px-4 py-1 text-center font-semibold bg-primary hover:bg-primary-hover rounded-md transition text-primary-txt"
                      >
                        Edit Profile
                      </NavLink>
                    ) : (
                      <button
                        disabled={sendingRequest}
                        onClick={
                          isFollowing === FOLLOWING_STATUS.TRUE ||
                          isFollowing === FOLLOWING_STATUS.PENDING
                            ? () =>
                                deleteFollowRequest(
                                  profile?.id,
                                  followRequestId
                                )
                            : () => createFollowRequest(profile?.id)
                        }
                        className={`"w-full px-4 py-1 text-center ${
                          isFollowing === FOLLOWING_STATUS.TRUE ||
                          isFollowing === FOLLOWING_STATUS.PENDING
                            ? "border-2 border-text-primary hover:bg-primary-hover/30 text-text-primary"
                            : "bg-primary border-2 text-primary-txt border-primary hover:bg-primary-hover hover:border-primary-hover"
                        } rounded-md transition cursor-pointer font-semibold`}
                      >
                        {isFollowing === FOLLOWING_STATUS.TRUE
                          ? "Unfollow"
                          : isFollowing === FOLLOWING_STATUS.FALSE
                          ? "Follow"
                          : "Request Sent"}
                      </button>
                    )}
                  </div>
                </div>
                <h3 className="text-[14px] md:text-lg w-full">
                  {profile?.firstName} {profile?.lastName}
                </h3>
              </section>

              <span className="w-full lg:w-2/3 h-[2px] my-4 bg-primary"></span>

              <ProfilePosts userId={userId} postsVisible={postsVisible} />
            </>
          )}
        </div>
      </MainLayout>
    </>
  );
};
export default UserProfile;

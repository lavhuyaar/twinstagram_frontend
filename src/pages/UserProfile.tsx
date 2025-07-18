import { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router";
import useAuth from "../hooks/useAuth";
import MainLayout from "../components/MainLayout";
import ProfilePosts from "../sections/ProfilePosts";
import Error from "../components/Error";
import type { IUser } from "../interfaces";
import { axiosInstance } from "../api/axiosInstance";
import { handleAxiosError } from "../utils/handleAxiosError";
import ProfileSkeleton from "../components/skeletons/ProfileSkeleton";

type Following = "TRUE" | "FALSE" | "PENDING";

const UserProfile = () => {
  const [profile, setProfile] = useState<IUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [postsVisible, setPostsVisible] = useState<boolean | undefined>(
    undefined
  );
  const [isFollowing, setIsFollowing] = useState<Following>("FALSE");
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
      if (isMyProfile || type === "PUBLIC" || isFollowing === "TRUE") {
        setPostsVisible(true);
      } else setPostsVisible(false);
    } catch (err) {
      handleAxiosError(err, undefined, setError, true);
    } finally {
      setLoading(false);
    }
  };

  // Sends follow request
  const createFollowRequest = async () => {
    if (isMyProfile || !profile) return;
    setSendingRequest(true);
    try {
      await axiosInstance.post(`/follow/new/${profile.id}`);
      getProfile(profile?.id);
    } catch (err) {
      handleAxiosError(err);
    } finally {
      setSendingRequest(false);
    }
  };

  // Deletes follow request
  const deleteFollowRequest = async () => {
    if (isMyProfile || !profile || !followRequestId) return;
    setSendingRequest(true);
    try {
      await axiosInstance.delete(`/follow/${followRequestId}`);
      getProfile(profile.id);
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
                          {profile?._count?.posts}
                        </p>
                        <p className="text-normal text-sm">Posts</p>
                      </div>

                      {/* Gives permission to see followers and following of Profile (user) */}
                      {postsVisible ? (
                        <>
                          <NavLink
                            to={`/followers/${profile?.id}`}
                            className="flex flex-col text-center items-center hover:text-primary-hover transition"
                          >
                            <p className="text-xl md:text-2xl font-medium">
                              {profile?._count?.followers}
                            </p>
                            <p className="text-normal text-sm">Followers</p>
                          </NavLink>
                          <NavLink
                            to={`/following/${profile?.id}`}
                            className="flex flex-col text-center items-center hover:text-primary-hover transition"
                          >
                            <p className="text-xl md:text-2xl font-medium">
                              {profile?._count?.following}
                            </p>
                            <p className="text-normal text-sm">Following</p>
                          </NavLink>
                        </>
                      ) : (
                        <>
                          <div className="flex flex-col text-center items-center">
                            <p className="text-xl md:text-2xl font-medium">
                              {profile?._count?.followers}
                            </p>
                            <p className="text-normal text-sm">Followers</p>
                          </div>
                          <div className="flex flex-col text-center items-center">
                            <p className="text-xl md:text-2xl font-medium">
                              {profile?._count?.following}
                            </p>
                            <p className="text-normal text-sm">Following</p>
                          </div>
                        </>
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
                          isFollowing === "TRUE" || isFollowing === "PENDING"
                            ? deleteFollowRequest
                            : createFollowRequest
                        }
                        className={`"w-full px-4 py-1 text-center ${
                          isFollowing === "TRUE" || isFollowing === "PENDING"
                            ? "border-2 border-text-primary hover:bg-primary-hover/30 text-text-primary"
                            : "bg-primary border-2 text-primary-txt border-primary hover:bg-primary-hover hover:border-primary-hover"
                        } rounded-md transition cursor-pointer font-semibold`}
                      >
                        {isFollowing === "TRUE"
                          ? "Unfollow"
                          : isFollowing === "FALSE"
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

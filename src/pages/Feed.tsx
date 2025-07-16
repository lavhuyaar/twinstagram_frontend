import MainLayout from "../components/MainLayout";
import RedirectToLogin from "../components/RedirectToLogin";
import Post from "../components/Post";
import PostSkeleton from "../components/skeletons/PostSkeleton";
import useFeedPosts from "../hooks/useFeedPosts";

const Feed = () => {
  const { posts, isFetching, fetchMore, hasMore, error } = useFeedPosts();
  return (
    <>
      <RedirectToLogin />
      <MainLayout>
        <h1 className="text-3xl w-full font-medium text-primary self-start">
          My Feed
        </h1>

        <section className="flex gap-5 flex-wrap mx-auto justify-center justify-self-center my-12">
          {posts.map((post) => (
            <Post {...post} key={post?.id} />
          ))}
          {isFetching &&
            Array.from({ length: 6 }).map((_, index) => (
              <PostSkeleton key={index} />
            ))}
        </section>
        {hasMore && <button onClick={fetchMore}>Load more</button>}
        {!hasMore && <p>No data left to load</p>}
        {error && <p>{error}</p>}
      </MainLayout>
    </>
  );
};
export default Feed;

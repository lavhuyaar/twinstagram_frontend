import { Link } from "react-router";
import useFeedPosts from "../hooks/useFeedPosts";
import Error from "../components/Error";
import MainLayout from "../components/MainLayout";
import Post from "../components/Post";
import PostSkeleton from "../components/skeletons/PostSkeleton";

const Feed = () => {
  const { posts, isFetching, fetchMore, hasMore, error } = useFeedPosts();

  if (error) {
    return <Error error={error} onRetry={() => location.reload()} />;
  }

  return (
    <>
      <MainLayout>
        <div className="flex items-center justify-between gap-4 w-full">
          <h1 className="text-3xl w-full font-medium text-primary self-start">
            My Feed
          </h1>
          <Link
            to="/post/new"
            className="hidden md:block bg-primary shrink-0 text-[14px] px-4 py-1 rounded-md text-primary-txt font-semibold text-center cursor-pointer text-lg border-none hover:bg-primary-hover transition"
          >
            Create New Post
          </Link>
        </div>

        <section className="flex gap-5 flex-wrap mx-auto justify-center justify-self-center my-12">
          {posts.length > 0 ? (
            posts.map((post) => <Post {...post} key={post?.id} />)
          ) : (
            <div className="p-3 w-full text-lg font-medium text-center flex items-center justify-center min-h-[60vh]">
              No posts are available in your feed :(
            </div>
          )}
          {isFetching &&
            Array.from({ length: 3 }).map((_, index) => (
              <PostSkeleton key={index} />
            ))}
        </section>
        {hasMore && (
          <button
            disabled={isFetching}
            onClick={fetchMore}
            className="cursor-pointer font-semibold text-primary-txt bg-primary px-3 py-1 rounded-lg hover:bg-primary-hover transition"
          >
            Load more
          </button>
        )}
      </MainLayout>
    </>
  );
};
export default Feed;

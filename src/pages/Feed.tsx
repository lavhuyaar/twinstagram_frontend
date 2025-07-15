import { useEffect } from "react";
import usePagination from "../hooks/usePagination";
import type { IPost } from "../interfaces";
import MainLayout from "../components/MainLayout";
import RedirectToLogin from "../components/RedirectToLogin";

const Feed = () => {
  const { data, isFetching, error, hasMore, fetchMore } = usePagination<IPost>({
    endpoint: "/posts/feed",
    dataKey: "posts",
  });

  useEffect(() => {
    console.log(data);
  }, [data]);

  return (
    <>
      <RedirectToLogin />
      <MainLayout>
        {hasMore && <button onClick={fetchMore}>Load more</button>}
        {isFetching && <p>Loading..........</p>}
        {!hasMore && <p>No data left to load</p>}
        {error && <p>{error}</p>}
      </MainLayout>
    </>
  );
};
export default Feed;

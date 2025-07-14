import { useEffect } from "react";
import { useNavigate } from "react-router";
import useAuth from "../hooks/useAuth";
import usePagination from "../hooks/usePagination";
import type { IPost } from "../interfaces";

const Feed = () => {
  const { userData } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!userData) {
      navigate("/auth/login");
    }
  }, [userData]);

  const { data, isFetching, error, hasMore, fetchMore } = usePagination<IPost>({
    endpoint: "/posts/feed",
    dataKey: "posts",
  });

  useEffect(() => {
    console.log(data);
  }, [data]);

  return (
    <>
      <main className="bg-amber-400 w-full h-screen"></main>
      {hasMore && <button onClick={fetchMore}>Load more</button>}
      {isFetching && <p>Loading..........</p>}
      {!hasMore && <p>No data left to load</p>}
      {error && <p>{error}</p>}
    </>
  );
};
export default Feed;

import { createContext } from "react";
import usePagination from "../hooks/usePagination";
import type { IPost } from "../interfaces";

interface IFeedPostsValues {
  posts: IPost[];
  isFetching: boolean;
  error: string | undefined;
  hasMore: boolean;
  fetchMore: VoidFunction;
}

const FeedPostsContext = createContext<IFeedPostsValues | null>(null);

export const FeedPostsProvider = ({
  children,
}: {
  children?: React.ReactNode;
}) => {
  const { data, isFetching, error, hasMore, fetchMore } = usePagination<IPost>({
    endpoint: "/posts/feed",
    dataKey: "posts",
  });

  return (
    <>
      <FeedPostsContext.Provider
        value={{ posts: data, isFetching, error, hasMore, fetchMore }}
      >
        {children}
      </FeedPostsContext.Provider>
    </>
  );
};

export default FeedPostsContext;

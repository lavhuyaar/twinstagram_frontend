import { useContext } from "react";
import FeedPostsContext from "../contexts/FeedPostsContext";

const useFeedPosts = () => {
  const context = useContext(FeedPostsContext);

  if (!context) {
    throw new Error("Feed Posts context not found!");
  }

  return context;
};
export default useFeedPosts;

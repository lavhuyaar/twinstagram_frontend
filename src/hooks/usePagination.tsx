import { useEffect, useRef, useState } from "react";
import useAuth from "./useAuth";
import { axiosInstance } from "../api/axiosInstance";
import { handleAxiosError } from "../utils/handleAxiosError";

interface IPaginationProps {
  page?: number;
  limit?: number;
  dataKey: string;
  endpoint: string;
}

const usePagination = <T,>({
  page = 1,
  limit = 20,
  dataKey,
  endpoint,
}: IPaginationProps) => {
  const [currentPage, setCurrentPage] = useState<number>(page || 1);
  const [data, setData] = useState<T[]>([]);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const initialFetch = useRef(false);

  const { userData } = useAuth();

  const fetchData = async (page: number) => {
    setIsFetching(true);
    try {
      const response = await axiosInstance.get(
        `${endpoint}?limit=${limit}&page=${page}`
      );
      setData((prev) => [...prev, ...response.data[dataKey]]);
      // setData([])
      setHasMore(response.data[dataKey].length >= limit);
    } catch (err) {
      handleAxiosError(err, undefined, setError, true);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (!currentPage || !userData) return;

    if (initialFetch.current) return;
    initialFetch.current = true;

    fetchData(currentPage);
  }, [currentPage, userData]);

  const fetchMore = () => {
    if (!hasMore) return;
    setCurrentPage((prev) => prev + 1);
    fetchData(currentPage + 1);
  };

  return { data, isFetching, error, hasMore, fetchMore };
};
export default usePagination;

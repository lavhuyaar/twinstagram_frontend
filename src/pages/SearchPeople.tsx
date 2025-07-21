import { useEffect, useState } from "react";
import MainLayout from "../components/MainLayout";
import { axiosInstance } from "../api/axiosInstance";
import { handleAxiosError } from "../utils/handleAxiosError";
import type { IRequestUser } from "../interfaces";
import { IoSearch } from "react-icons/io5";
import Error from "../components/Error";
import { RxCross2 } from "react-icons/rx";
import RequestSkeleton from "../components/skeletons/RequestSkeleton";
import { Link } from "react-router";

const SearchPeople = () => {
  const [value, setValue] = useState<string>("");
  const [debouncedValue, setDebouncedValue] = useState<string>("");
  const [users, setUsers] = useState<IRequestUser[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | undefined>(undefined);

  const inputOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  const getUsers = async (searchValue: string) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `/profile/users/all?search=${searchValue}`
      );

      setUsers(response.data?.users);
    } catch (err) {
      handleAxiosError(err, undefined, setError, true);
    } finally {
      setLoading(false);
    }
  };

  const clearInput = () => setValue("");

  // Debounce by 500ms
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedValue(value);
    }, 500);

    return () => clearTimeout(timeout);
  }, [value]);

  useEffect(() => {
    getUsers(debouncedValue);
  }, [debouncedValue]);

  if (error) {
    return <Error error={error} onRetry={() => getUsers(debouncedValue)} />;
  }

  return (
    <>
      <MainLayout>
        <section className="flex flex-col w-full p-3">
          <div className="flex items-center w-full gap-4">
            <IoSearch className="text-text-muted text-2xl" />
            <input
              type="text"
              value={value}
              autoFocus
              onChange={inputOnChange}
              className="text-text-primary text-sm sm:text-[16px] outline-none w-full border-none resize-none"
              placeholder="Search user by username or name..."
            />
            <button
              title="Clear"
              className="text-text-muted text-2xl self-end hover:text-text-primary transition cursor-pointer"
            >
              <RxCross2 onClick={clearInput} />
            </button>
          </div>
          <span className="w-full h-[2px] bg-primary mt-3"></span>
        </section>
        <section className="flex flex-col mt-6 w-full gap-3 p-3">
          {loading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <RequestSkeleton key={index} />
            ))
          ) : users && users.length > 0 ? (
            users.map((user) => (
              <div
                key={user.id}
                className={`flex items-center gap-3 sm:gap-6 border-b border-text-muted/30 pb-4 relative`}
              >
                <img
                  src={user?.profilePicture ?? "/blank-pfp.webp"}
                  alt=""
                  className="shrink-0 size-[40px] rounded-full object-center object-cover"
                />
                <div>
                  <div className="w-full flex items-center gap-3">
                    <Link
                      to={`/u/${user?.id}`}
                      className="font-medium text-lg hover:text-primary transition"
                    >
                      {user?.username}
                    </Link>
                  </div>
                  <h4 className="text-text-muted text-xs">
                    {user?.firstName} {user?.lastName}
                  </h4>
                </div>
              </div>
            ))
          ) : (
            <div className="w-full h-[40vh] items-center flex justify-center p-3">
              <h4 className="text-center p-2 font-medium text-xl">
                No users found
              </h4>
            </div>
          )}
        </section>
      </MainLayout>
    </>
  );
};
export default SearchPeople;

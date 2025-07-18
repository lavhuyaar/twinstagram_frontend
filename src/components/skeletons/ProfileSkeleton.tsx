import PostSkeleton from "./PostSkeleton";

const ProfileSkeleton = () => {
  return (
    <>
      <div className="flex flex-col items-center">
        <div className="w-[200px] bg-surface h-7 animate-pulse"></div>
        <div className="flex items-center gap-6 md:gap-12 mt-12">
          <div className="rounded-full size-[70px] md:size-[120px] shrink-0 bg-surface animate-pulse"></div>
          <div className="flex flex-col items-center">
            <div className="flex  gap-4 md:gap-12 items-center">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="flex flex-col gap-2 items-center">
                  <div className="bg-surface w-[50px] md:w-[60px] h-7 animate-pulse"></div>
                  <div className="bg-surface w-[30px] md:w-[40px] h-5 animate-pulse"></div>
                </div>
              ))}
            </div>
            <div className="bg-surface w-full animate-pulse"></div>
          </div>
        </div>
      </div>
      <div className="flex flex-col w-full items-center mt-10 gap-6">
        {Array.from({length: 2}).map((_, index) => (
          <PostSkeleton key={index}/>
        ))}

      </div>
    </>
  );
};
export default ProfileSkeleton;

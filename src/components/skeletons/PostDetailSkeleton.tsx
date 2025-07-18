const PostDetailSkeleton = () => {
  return (
    <>
      <div className="w-full sm:w-5/6 flex items-center flex-col bg-surface p-6 mt-6">
        <div className="flex items-center gap-3 w-full">
          <div className="shrink-0 size-[40px] rounded-full object-center object-cover bg-background animate-pulse" />
          <div className="flex flex-col gap-2">
            <div className="bg-background h-4 w-[150px] animate-pulse"></div>
            <div className="bg-background h-3 w-[80px] animate-pulse"></div>
          </div>
        </div>
        <div className="flex flex-col mt-6 w-full gap-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="bg-background h-4 w-full animate-pulse"
            ></div>
          ))}
        </div>
        <div className="w-full animate-pulse min-h-[400px] mt-4 bg-background"></div>
      </div>
    </>
  );
};
export default PostDetailSkeleton;

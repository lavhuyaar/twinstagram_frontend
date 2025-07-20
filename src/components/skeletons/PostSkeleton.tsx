const PostSkeleton = () => {
  return (
    <div className="bg-surface w-full lg:w-2/3 md:min-w-[500px] h-[400px] flex flex-col shrink-0 hover:scale-105 transition duration-300 cursor-pointer">
      <div className="flex items-center gap-3 px-3 py-2 border-b border-text-muted/20">
        <div className="shrink-0 size-[45px] rounded-full object-center object-cover bg-background animate-pulse" />
        <div className="flex flex-col gap-2">
          <div className="bg-background h-5 w-[100px] animate-pulse"></div>
          <div className="bg-background h-3 w-[60px] animate-pulse"></div>
        </div>
      </div>
      <div className="size-full p-4">
        <div className="bg-background size-full animate-pulse"></div>
      </div>
      <div className="mt-auto flex items-center p-4 gap-6">
        <div className="w-[80px] h-6 bg-background animate-pulse"></div>
        <div className="w-[80px] h-6 bg-background animate-pulse"></div>
      </div>
    </div>
  );
};
export default PostSkeleton;

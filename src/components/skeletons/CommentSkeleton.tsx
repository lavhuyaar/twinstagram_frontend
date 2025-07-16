const CommentSkeleton = () => {
  return (
    <>
      <div className="w-full flex py-4 gap-5">
        <div className="rounded-full size-[45px] bg-surface animate-pulse shrink-0"></div>
        <div className="w-full flex flex-col gap-2 pr-6">
          <div className="w-[150px] h-[10px] animate-pulse bg-surface"></div>
          <div className="w-full h-[12px] animate-pulse bg-surface mt-2"></div>
          <div className="w-full h-[12px] animate-pulse bg-surface"></div>
        </div>
      </div>
    </>
  );
};
export default CommentSkeleton;

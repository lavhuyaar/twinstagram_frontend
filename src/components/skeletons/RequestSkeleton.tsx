const RequestSkeleton = () => {
  return (
    <div className="w-full flex items-center gap-3 px-3 py-3 border-b border-text-muted/20">
      <div className="shrink-0 size-[60px] rounded-full object-center object-cover bg-surface animate-pulse" />
      <div className="flex flex-col gap-2">
        <div className="bg-surface h-5 w-[180px] md:w-[250px] animate-pulse"></div>
        <div className="bg-surface h-3 w-[80px] md:w-[140px] animate-pulse"></div>
      </div>
    </div>
  );
};
export default RequestSkeleton;

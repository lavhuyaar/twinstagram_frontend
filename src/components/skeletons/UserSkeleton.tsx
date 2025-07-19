const UserSkeleton = () => {
  return (
    <div className="w-full flex items-center gap-3 px-3 py-3 border-b border-text-muted/20">
      <div className="shrink-0 size-[40px] rounded-full object-center object-cover bg-background animate-pulse" />
      <div className="flex flex-col gap-2">
        <div className="bg-background h-5 w-[150px] animate-pulse"></div>
        <div className="bg-background h-3 w-[90px] animate-pulse"></div>
      </div>
    </div>
  );
};
export default UserSkeleton;

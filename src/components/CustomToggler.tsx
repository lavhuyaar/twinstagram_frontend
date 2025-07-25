const CustomToggler = ({
  onClick,
  isChecked,
  isDisabled,
  title,
}: {
  onClick?: VoidFunction;
  isChecked: boolean;
  isDisabled?: boolean;
  title?: string;
}) => {
  const togglerOnClick = () => {
    if (isDisabled || !onClick) return;
    onClick();
  };

  return (
    <div
      title={title}
      className={`${
        isDisabled ? "opacity-20" : ""
      } w-[60px] h-8 flex shrink-0 items-center p-1 rounded-full cursor-pointer transition-all duration-300 border border-text-muted`}
      onClick={togglerOnClick}
    >
      <div
        className={`h-full w-6 rounded-full transition-transform transform duration-500 flex items-center justify-center ${
          isChecked
            ? "translate-x-[24px] bg-primary"
            : "translate-x-[1px] bg-text-primary"
        }`}
      >
        {isChecked ? (
          <span className="text-primary"></span>
        ) : (
          <span className="text-surface"></span>
        )}
      </div>
    </div>
  );
};
export default CustomToggler;

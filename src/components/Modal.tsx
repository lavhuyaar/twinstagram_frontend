const Modal = ({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className="fixed inset-0 z-[99999] bg-background/80 flex items-center justify-center">
      <div
        className={`p-12 rounded-md bg-surface min-size-[250px] max-w-[90%] flex flex-col gap-4 ${
          className ?? ""
        }`}
      >
        {children}
      </div>
    </div>
  );
};
export default Modal;

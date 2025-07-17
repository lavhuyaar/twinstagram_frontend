interface IModalProps {
  isOpen: boolean;
  openModal: VoidFunction;
  closeModal: VoidFunction;
  textMessage: string;
  onClick: VoidFunction;
  taskMessage: string;
  loading: boolean;
}

const CustomModal = ({
  closeModal,
  textMessage,
  onClick,
  taskMessage,
  loading,
}: IModalProps) => {
  return (
    <div className="fixed inset-0 z-[99999] bg-background/80 flex items-center justify-center">
      <div className=" p-12 rounded-md bg-surface min-size-[250px] max-w-[90%] flex flex-col gap-4">
        <p>{textMessage}</p>
        <div className="flex gap-4 mt-4 justify-center items-center">
          <button
            onClick={closeModal}
            disabled={loading}
            className={`${
              loading ? "" : "hover:bg-primary-hover"
            } cursor-pointer px-4 py-2 bg-primary/40  transition text-primary-txt font-semibold`}
          >
            Close
          </button>
          <button
            onClick={onClick}
            disabled={loading}
            className={`${
              loading ? "bg-primary/40" : "bg-primary hover:bg-primary-hover"
            } cursor-pointer px-4 py-2   transition text-primary-txt font-semibold`}
          >
            {taskMessage}
          </button>
        </div>
      </div>
    </div>
  );
};
export default CustomModal;

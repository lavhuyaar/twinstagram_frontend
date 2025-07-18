import MainLayout from "./MainLayout";

const Error = ({
  error,
  onRetry,
}: {
  error: string | undefined;
  onRetry: VoidFunction;
}) => {
  return (
    <MainLayout mainStyling="justify-center">
      <p className="w-full text-2xl text-center">{error}</p>
      <button
        onClick={onRetry}
        className="px-4 py-1 text-primary hover:text-primary-hover transition cursor-pointer"
      >
        Retry
      </button>
    </MainLayout>
  );
};
export default Error;

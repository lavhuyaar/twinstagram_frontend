interface ICustomInput {
  name: string;
  placeholder?: string;
  type: string;
  value?: boolean | string;
  errorMessage?: string | undefined;
  labelText?: string;
  register: any;
}

const CustomInput: React.FC<ICustomInput> = ({
  name,
  labelText,
  register,
  type,
  placeholder,
  errorMessage,
  value,
}) => {
  return (
    <>
      <div className="flex flex-col w-full gap-2">
        <label htmlFor={name} id={name} className="font-semibold text-lg">
          {labelText}
        </label>
        <input
          autoComplete="off"
          defaultValue={value}
          className="border-text-primary/10 text-text-primary/60 focus:outline-none align-middle border rounded-md px-3 py-2"
          {...register(name, { required: true })}
          type={type}
          placeholder={placeholder}
        />

        {errorMessage && (
          <p className="text-red-500 text-sm w-full">{errorMessage}</p>
        )}
      </div>
    </>
  );
};

export default CustomInput;
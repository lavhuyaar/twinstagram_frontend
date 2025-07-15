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
      <div className="flex flex-col w-full gap-1 relative">
        <label htmlFor={name} className="font-semibold text-[12px]">
          {labelText}
        </label>
        <input
          autoComplete="off"
          defaultValue={value}
          id={name}
          className="border-text-primary/10 text-text-primary/60 focus:outline-none align-middle border p-3 italic"
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

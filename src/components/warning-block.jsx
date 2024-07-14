


export const WarningBlock = ({children}) => {
  return (
    <div
      className="bg-red-bg lg:text-2xl flex items-center justify-center text-nowrap rounded-sm px-4 py-5 font-bios text-sm/[14px] text-white shadow-squareDefault sm:px-16 sm:text-xl"
    >
      <span>{children}</span>
    </div>

  );
}
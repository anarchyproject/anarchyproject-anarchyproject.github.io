export const Modal = ({children, title, setIsOpen}) => {

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-[#333] bg-opacity-50"
    >
      <div className="bg-[#181818] border border-[#642424] sm:min-w-[575px] relative p-8 pr-10 gap-12 shadow-squareDefault flex flex-col">
        {title && <span className="font-bios text-white">{title}</span>}
        {children}
        <button
          className="absolute top-0 right-0 p-3 font-bios text-white"
          onClick={() => setIsOpen(false)}
        >
          X
        </button>
      </div>
    </div>
  );
}
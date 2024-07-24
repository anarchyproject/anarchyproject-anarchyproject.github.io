import {ShadowedBorderBlock} from "~/components/shadowed-border-block";

export const Modal = ({children, title, setIsOpen}) => {

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-[#333] bg-opacity-50"
    >
      <ShadowedBorderBlock>
        {title && <span className="font-bios text-white">{title}</span>}
        {children}
        <button
          className="absolute top-0 right-0 p-3 font-bios text-white"
          onClick={() => setIsOpen(false)}
        >
          X
        </button>
      </ShadowedBorderBlock>
    </div>
  );
}
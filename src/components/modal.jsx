

export const Modal = ({ children }) => {

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50"
    >
      {children}
    </div>
  );
}
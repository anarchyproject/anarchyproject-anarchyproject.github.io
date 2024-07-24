import cx from 'clsx';

export const ShadowedBorderBlock = ({children, minified = false}) => {
  const cn = "bg-[#181818] border border-[#642424] sm:min-w-[575px] relative p-8 pr-10 gap-12 shadow-squareDefault flex flex-col";
  const minifiedCn = "relative p-0 pr-0 w-auto min-w-0"
  return (
    <div
      className={cx(
        cn,
        { minifiedCn: minified, }
      )}>
      {children}
    </div>
  );
};
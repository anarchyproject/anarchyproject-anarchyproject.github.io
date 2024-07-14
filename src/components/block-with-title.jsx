function TitleLines({ color }) {
  return (
    <div
      className="h-[6px] w-full border-[1.4px] border-l-0 border-r-0"
      style={{ borderColor: color }}
    ></div>
  );
}

export function BlockWithTitle({ children, title, primaryColor, bgColor = 'transparent' }) {
  return (
    <div
      className="relative flex flex-col gap-6 border-2 px-2 py-8 text-white md:px-8 md:py-14 lg:px-8 lg:py-10 xl:px-10 xl:py-16"
      style={{ backgroundColor: bgColor, borderColor: '#373737' }}
    >
      <div className="flex flex-row items-center gap-5">
        <TitleLines color={primaryColor} />
        <p
          className="lg:text-2xl text-wrap text-center sm:text-nowrap font-bios text-base/[17px] sm:text-xl"
          style={{ color: primaryColor }}
        >
          {title}
        </p>
        <TitleLines color={primaryColor} />
      </div>
      {children}
    </div>
  );
}
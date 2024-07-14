export function Hl({ text, color = 'white' }) {
  return (
    <span className="font-bios text-base/[22px] sm:text-xl md:text-[22px]" style={{color}}>
      {` ${text}`}
    </span>
  );
}
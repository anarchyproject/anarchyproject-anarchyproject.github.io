import Image from "next/image";
import {usePathname} from "next/navigation";

const NEXT_PUBLIC_HIDE = process.env.NEXT_PUBLIC_HIDE;

export function Footer() {
  const pathname = usePathname();
  if (NEXT_PUBLIC_HIDE === 'true' && pathname !== '/mint') {
    return null;
  }

  return (
    <footer className="flex flex-col items-center gap-3 py-4">
      <div className="flex gap-5">
        <a href="/#" target="_blank">
          <Image width={24} height={24} src="/icons/Discord.svg" alt="discord"/>
        </a>

        <a href="https://t.me/AnarchyCoin" target="_blank">
          <Image src={"/icon-telegram.svg"} alt="tg" width={24} height={24} />
        </a>

        <a href="https://x.com/burnbtcmintac" target="_blank">
          <Image width={24} height={24} src="/icons/Twitter.svg" alt="twitter"/>
        </a>

        <a href="/#" target="_blank">
          <Image width={24} height={24} src="/icons/Github.svg" alt="github"/>
        </a>
      </div>
      <p
        className="flex flex-col justify-center font-bios text-xs/[22px] text-[#ECECEC] sm:flex-row sm:gap-4 lg:text-sm"
      >
        <span className="text-nowrap">Anarchy Coin. All rights reserved.</span>
        <a className="text-center" href="mailto:burnbtcmintac@gmail.com">burnbtcmintac@gmail.com</a>
      </p>
    </footer>
  );
}

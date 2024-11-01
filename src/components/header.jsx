"use client";
import {usePathname} from "next/navigation";
import Link from "next/link";
import {ConnectOrAccountButton} from "~/components/wallet-connect-acc-btn";


const NEXT_PUBLIC_HIDE = process.env.NEXT_PUBLIC_HIDE;

function NavLink(href, text) {
  const pathname = usePathname();
  const isActive = pathname === href;
  return (
  <Link
    className={`nav-link flex justify-center text-nowrap ${isActive ? 'active' : ''}`}
    href={href}
  >
    {text}
  </Link>
  );
}

export function Header() {
  const pathname = usePathname();
  if (NEXT_PUBLIC_HIDE === 'true' && pathname !== '/mint') {
    return null;
  }
  return (
    <header className="header">
      <nav className="nav">
        <div className="grid grid-cols-3 sm:flex">
          {NavLink('/', '[ HOME ]')}
          {NavLink('/mint', '[ MINT ]')}
          {/*{NavLink('/swap', '[ SWAP ]')}*/}
        </div>
        <div className="flex w-full flex-grow items-center justify-around sm:flex-grow-0 sm:justify-end">
          <ConnectOrAccountButton />

        {/*  <a href="https://x.com/#" target="_blank" className="nav-link text-nowrap">[ X ]</a>*/}
        {/*  <a href="https://t.me/?" target="_blank" className="nav-link text-nowrap">[ Telegram ]</a>*/}
        </div>
      </nav>
    </header>
  );
}

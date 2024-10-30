import {useAccount, useConnect, useDisconnect, useEnsAvatar, useEnsName} from "wagmi";
import {useAcBalance, useTBTCBalance} from "~/app/mint/hooks";
import {useRef, useState} from "react";
import {Modal} from "~/components/modal";
import useOnClickOutside from "~/hooks/use-click-outside";

export function Account() {
  const {address} = useAccount()
  const {disconnect} = useDisconnect()
  const {data: ensName} = useEnsName({address})
  const {data: ensAvatar} = useEnsAvatar({name: ensName})
  const balance = useAcBalance(address);
  const [isOpen, setIsOpen] = useState(false);

  const ref = useRef();
  useOnClickOutside(ref, () => setIsOpen(false));

  return (
    <div className="flex font-bios items-center justify-center" ref={ref}>
      <div className="flex justify-center items-center p-3">{balance || 0} AC</div>
      <div
        onClick={() => setIsOpen(true)}
        className="flex relative justify-center items-center p-3 bg-[#00aa00]"
      >
        <div className="flex gap-3">
          <div>{address.slice(0, 3)}...{address.slice(-2)}</div>
          <div className="font-bios rotate-90">{'>'}</div>
        </div>
        {isOpen && (
          <div className="absolute bg-[#181818] z-50 bottom-0 translate-y-full left-0 w-full p-4 gap-4 shadow-squareDefault flex flex-col">
          <button onClick={disconnect}>Disconnect</button>
        </div>
        )}
      </div>
    </div>
  );
}

export function WalletOptions({isOpen, setIsOpen}) {
  const {connectors, connect} = useConnect()

  if (!isOpen) {
    return null;
  }

  return (
    <Modal title="Select Wallet" setIsOpen={setIsOpen}>
      <div className="flex flex-col gap-5">
        {connectors.map((connector) => (
          <button
            className="py-5 px-6 color-[#b5b5b5] bg-[#272829] uppercase font-bios"
            key={connector.uid}
            onClick={() => connect({connector})}
          >
            {connector.name}
          </button>))}
      </div>
    </Modal>
  );
}

export function ConnectWallet() {
  const [isOpen, setIsOpen] = useState(false);
  const connect = () => {
    setIsOpen(true);
  };
  return (
    <>
      {isOpen && <WalletOptions isOpen={isOpen} setIsOpen={setIsOpen}/>}
      <button onClick={connect} className="h-full flex nav-link justify-center text-nowrap font-bios text-white">
        [ Connect Wallet ]
      </button>
    </>
  );
}

export function ConnectOrAccountButton() {
  const {isConnected, isConnecting} = useAccount();
  if (isConnected && !isConnecting) {
    return <Account/>
  }
  return <ConnectWallet/>;
}
import {useAccount, useConnect, useDisconnect, useEnsAvatar, useEnsName} from "wagmi";
import {useAcBalance} from "~/app/mint/hooks";
import {useState} from "react";
import {Modal} from "~/components/modal";

export function Account() {
  const {address} = useAccount()
  const {disconnect} = useDisconnect()
  const {data: ensName} = useEnsName({address})
  const {data: ensAvatar} = useEnsAvatar({name: ensName})
  const balance = useAcBalance(address);

  return (
    <div className="flex">
      <div className="flex justify-center items-center p-3">{balance}</div>
      <div
        className="flex justify-center items-center p-3 bg-[#00aa00]">{address.slice(0, 3)}...{address.slice(-2)}</div>
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
      <button onClick={connect} className="h-full flex nav-link justify-center text-nowrap font-bios text-white">[
        Connect Wallet ]
      </button>
    </>
  );
}

export function ConnectOrAccountButton() {
  const isConnected = useAccount().isConnected;
  if (isConnected) {
    return <Account/>
  }
  return <ConnectWallet/>;
}
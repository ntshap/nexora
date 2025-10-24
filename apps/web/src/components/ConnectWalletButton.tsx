import { useMemo } from "react";
import { useAccount, useConnect, useDisconnect, useSwitchChain } from "wagmi";
import { sepolia } from "wagmi/chains";

import { Button } from "@/components/ui/button";

const chainName = sepolia.name;

export const ConnectWalletButton = () => {
  const { address, isConnected, chainId } = useAccount();
  const { connect, connectors, status: connectStatus } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChainAsync, status: switchStatus } = useSwitchChain();

  const primaryConnector = useMemo(() => connectors[0], [connectors]);
  const unsupported = Boolean(chainId && chainId !== sepolia.id);

  if (!isConnected) {
    return (
      <Button
        variant="hero"
        onClick={() => primaryConnector && connect({ connector: primaryConnector })}
        className="rounded-full text-sm"
        disabled={!primaryConnector || connectStatus === "pending"}
      >
        {connectStatus === "pending" ? "Connecting..." : "Connect Wallet"}
      </Button>
    );
  }

  if (unsupported && switchChainAsync) {
    return (
      <Button
        variant="hero"
        onClick={() => switchChainAsync({ chainId: sepolia.id })}
        className="rounded-full text-sm"
        disabled={switchStatus === "pending"}
      >
        Switch to {chainName}
      </Button>
    );
  }

  return (
    <Button variant="hero" onClick={() => disconnect()} className="rounded-full text-sm">
      {address ? `${address.slice(0, 6)}…${address.slice(-4)}` : "Disconnect"}
    </Button>
  );
};


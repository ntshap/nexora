import { createConfig, http } from "wagmi";
import { sepolia } from "wagmi/chains";
import { injected, walletConnect } from "wagmi/connectors";

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? "";
const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://rpc.sepolia.org";
const isServer = typeof window === "undefined";

export const wagmiConfig = createConfig({
  chains: [sepolia],
  connectors: [
    injected({ shimDisconnect: true }),
    ...(!isServer && projectId
      ? [
          walletConnect({
            projectId,
            showQrModal: true,
            metadata: { name: "NEXORA", description: "NEXORA DeFi Vaults", url: "https://nexora.app", icons: [] },
          }),
        ]
      : []),
  ],
  transports: {
    [sepolia.id]: http(rpcUrl),
  },
  ssr: true,
});

export const SUPPORTED_CHAIN = sepolia;

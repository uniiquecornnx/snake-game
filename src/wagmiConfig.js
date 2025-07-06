import { createConfig, http } from 'wagmi';
import { base, mainnet, polygon } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';

export const config = createConfig({
  chains: [base, mainnet, polygon],
  connectors: [
    injected(),
  ],
  transports: {
    [base.id]: http(),
    [mainnet.id]: http(),
    [polygon.id]: http(),
  },
}); 
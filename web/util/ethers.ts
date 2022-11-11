import Web3Modal from "web3modal";
import { providers } from "ethers";
import { Contract } from "ethers";

import { Marketplace as MarketplaceContract } from "../types/ethers-contracts/Marketplace";
import { TicketNFT as TicketNFTContract } from "../types/ethers-contracts/TicketNFT";

import Marketplace from "../contracts/ethereum-contracts/Marketplace.json";
import TicketNFT from "../contracts/ethereum-contracts/TicketNFT.json";

export const marketplaceNetworks = Marketplace.networks as any;
export const ticketNFTNetworks = TicketNFT.networks as any;

export async function getProvider(): Promise<providers.Web3Provider> {
  const web3Modal = new Web3Modal();
  const provider = await web3Modal.connect();
  return new providers.Web3Provider(provider);
}

export async function getMarketplaceContract(
  provider: providers.Web3Provider,
  chainId: number,
  signer: boolean = false
) {
  if (!chainId) {
    chainId = (await provider.getNetwork()).chainId;
  }
  console.log(`Network to use: ${chainId}`);

  return new Contract(
    marketplaceNetworks[chainId].address,
    Marketplace.abi,
    signer ? provider.getSigner() : provider
  ) as MarketplaceContract;
}

export async function getTicketNFTContract(
  provider: providers.Web3Provider,
  chainId: number,
  signer: boolean = false
) {
  if (!chainId) {
    chainId = (await provider.getNetwork()).chainId;
  }
  console.log(`Network to use: ${chainId}`);

  return new Contract(
    ticketNFTNetworks[chainId].address,
    TicketNFT.abi,
    signer ? provider.getSigner() : provider
  ) as TicketNFTContract;
}

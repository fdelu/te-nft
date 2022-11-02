import Web3Modal from "web3modal";
import { useEffect, useState } from "react";
import axios from "axios";
import { Contract, providers, utils } from "ethers";

import { Marketplace as MarketplaceContract } from "../types/ethers-contracts/Marketplace";
import { TicketNFT as TicketNFTContract } from "../types/ethers-contracts/TicketNFT";
import { NFT } from "../types/NFT";
const Marketplace = require("../contracts/optimism-contracts/Marketplace.json");
const TicketNFT = require("../contracts/optimism-contracts/TicketNFT.json");

async function getProvider(): Promise<providers.Web3Provider> {
  const web3Modal = new Web3Modal();
  const provider = await web3Modal.connect();
  return new providers.Web3Provider(provider);
}

export default function Home() {
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loadingState, setLoadingState] = useState("not-loaded");

  useEffect(() => {
    loadNFTs();
  }, []);

  async function loadNFTs() {
    const provider = await getProvider();
    const { chainId } = await provider.getNetwork();

    // Get all listed NFTs
    const marketPlaceContract = new Contract(
      Marketplace.networks[chainId].address,
      Marketplace.abi,
      provider
    ) as MarketplaceContract;

    const listings = await marketPlaceContract.getListedNfts();

    // Iterate over the listed NFTs and retrieve their metadata
    const nfts = await Promise.all(
      listings.map(async (i) => {
        try {
          const ticketsNFTContract = new Contract(
            TicketNFT.networks[chainId].address,
            TicketNFT.abi,
            provider
          ) as TicketNFTContract;
          const tokenURI = await ticketsNFTContract.tokenURI(i.tokenId);

          const meta = await axios.get(tokenURI);

          const nft: NFT = {
            price: i.price,
            tokenId: i.tokenId,
            seller: i.seller,
            owner: i.owner,
            image: meta.data.image,
            name: meta.data.name,
            description: meta.data.description,
          };
          return nft;
        } catch (err) {
          console.log(err);
          return null;
        }
      })
    );

    // @ts-ignore
    setNfts(nfts.filter((nft) => nft !== null));
    setLoadingState("loaded");
  }

  async function buyNft(nft: NFT) {
    const provider = await getProvider();
    const { chainId } = await provider.getNetwork();

    const marketPlaceContract = new Contract(
      Marketplace.networks[chainId].address,
      Marketplace.abi,
      provider
    ) as MarketplaceContract;

    const accounts = await provider.listAccounts();
    await marketPlaceContract.buyNft(
      TicketNFT.networks[chainId].address,
      nft.tokenId,
      { from: accounts[0], value: nft.price }
    );
    loadNFTs();
  }

  if (loadingState === "loaded" && !nfts.length) {
    return <h1 className="px-20 py-10 text-3xl">No tickets available!</h1>;
  } else {
    return (
      <div className="flex justify-center">
        <div className="px-4" style={{ maxWidth: "1600px" }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
            {nfts.map((nft, i) => (
              <div key={i} className="border shadow rounded-xl overflow-hidden">
                <img src={nft.image} />
                <div className="p-4">
                  <p
                    style={{ height: "64px" }}
                    className="text-2xl font-semibold"
                  >
                    {nft.name}
                  </p>
                  <div style={{ height: "70px", overflow: "hidden" }}>
                    <p className="text-gray-400">{nft.description}</p>
                  </div>
                </div>
                <div className="p-4 bg-black">
                  <p className="text-2xl font-bold text-white">
                    {utils.formatEther(nft.price)} ETH
                  </p>
                  <button
                    className="mt-4 w-full bg-teal-400 text-white font-bold py-2 px-12 rounded"
                    onClick={() => buyNft(nft)}
                  >
                    Buy
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

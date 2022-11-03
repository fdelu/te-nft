import { useEffect, useState } from "react";
import axios from "axios";
import { utils } from "ethers";

import {
  getMarketplaceContract,
  getProvider,
  getTicketNFTContract,
  ticketNFTNetworks,
} from "../util/ethers";

import { NFT } from "../types/NFT";

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
    const marketPlaceContract = await getMarketplaceContract(provider, chainId);

    const listings = await marketPlaceContract.getListedNfts();

    // Iterate over the listed NFTs and retrieve their metadata
    const nfts = await Promise.all(
      listings.map(async (i) => {
        try {
          const ticketsNFTContract = await getTicketNFTContract(
            provider,
            chainId
          );

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

    const marketPlaceContract = await getMarketplaceContract(
      provider,
      chainId,
      true
    );

    const accounts = await provider.listAccounts();
    await marketPlaceContract.buyNft(
      ticketNFTNetworks[chainId].address,
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

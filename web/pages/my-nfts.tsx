import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import {
  getMarketplaceContract,
  getProvider,
  getTicketNFTContract,
} from "../util/ethers";
import { NFT } from "../types/NFT";
import { utils } from "ethers";

export default function MyAssets() {
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loadingState, setLoadingState] = useState("not-loaded");
  const router = useRouter();

  useEffect(() => {
    loadNFTs();
  }, []);

  async function loadNFTs() {
    const provider = await getProvider();
    const { chainId } = await provider.getNetwork();
    const marketPlaceContract = await getMarketplaceContract(provider, chainId);
    const ticketNFTContract = await getTicketNFTContract(provider, chainId);
    const accounts = await provider.listAccounts();
    const data = await marketPlaceContract.getMyNfts({ from: accounts[0] });

    const nfts = await Promise.all(
      data.map(async (i) => {
        try {
          const tokenURI = await ticketNFTContract.tokenURI(i.tokenId);
          const meta = await axios.get(tokenURI);
          let nft: NFT = {
            price: i.price,
            tokenId: i.tokenId,
            seller: i.seller,
            owner: i.owner,
            image: meta.data.image,
            name: meta.data.name,
            description: meta.data.description,
            tokenURI: tokenURI,
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

  function listNFT(nft: NFT) {
    router.push(`/resell-nft?id=${nft.tokenId}&tokenURI=${nft.tokenURI}`);
  }

  if (loadingState === "loaded" && !nfts.length) {
    return <h1 className="py-10 px-20 text-3xl">No NFTs owned</h1>;
  } else {
    return (
      <div className="flex justify-center">
        <div className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
            {nfts.map((nft, i) => (
              <div key={i} className="border shadow rounded-xl overflow-hidden">
                <img src={nft.image} className="rounded" />
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
                    Price - {utils.formatEther(nft.price)} ETH
                  </p>
                  <button
                    className="mt-4 w-full bg-teal-400 text-white font-bold py-2 px-12 rounded"
                    onClick={() => listNFT(nft)}
                  >
                    List
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

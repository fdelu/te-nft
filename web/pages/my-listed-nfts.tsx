import { useEffect, useState } from "react";
import axios from "axios";
import { utils } from "ethers";
import { Spinner } from "../components/spinner";
import { Card, CardTitle, CardSubtitle, CardBody, CardText } from "reactstrap";
import {
  getMarketplaceContract,
  getProvider,
  getTicketNFTContract,
} from "../util/ethers";

import { NFT } from "../types/NFT";

export default function CreatorDashboard() {
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loadingText, setLoadingText] = useState<string>("Loading...");

  useEffect(() => {
    loadNFTs();
  }, []);

  async function loadNFTs() {
    const provider = await getProvider();
    const { chainId } = await provider.getNetwork();

    // Get listed NFTs
    const marketPlaceContract = await getMarketplaceContract(provider, chainId);
    const accounts = await provider.listAccounts();
    const listings = await marketPlaceContract.getMyListedNfts({
      from: accounts[0],
    });

    // Iterate over my listed NFTs and retrieve their metadata
    const nfts = await Promise.all(
      listings.map(async (i) => {
        try {
          const ticketNFTContract = await getTicketNFTContract(
            provider,
            chainId
          );
          const tokenURI = await ticketNFTContract.tokenURI(i.tokenId);
          const meta = await axios.get(tokenURI);
          let item: NFT = {
            price: i.price,
            tokenId: i.tokenId,
            seller: i.seller,
            owner: i.owner,
            image: meta.data.image,
            name: meta.data.name,
            description: meta.data.description,
          };
          return item;
        } catch (err) {
          console.log(err);
          return null;
        }
      })
    );

    // @ts-ignore
    setNfts(nfts.filter((nft) => nft !== null));
    setLoadingText("");
  }

  if (!loadingText && !nfts.length) {
    return <h1 className="py-10 px-20 text-3xl">No NFTs listed</h1>;
  }

  return (
    <div>
      {loadingText ? <Spinner text={loadingText} /> : null}

      <div className="p-4">
        <h2 className="text-2xl py-2">Items Listed</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {nfts.map((nft, i) => (
            <Card
              key={i}
              style={{
                width: "18rem",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <CardBody style={{ flex: "none" }}>
                <CardTitle tag="h5">{nft.name}</CardTitle>
                <CardSubtitle className="mb-2 text-muted" tag="h6">
                  {utils.formatEther(nft.price)} ETH
                </CardSubtitle>
              </CardBody>
              <img src={nft.image} />
              <CardBody style={{ flex: "none" }}>
                <CardText>{nft.description}</CardText>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

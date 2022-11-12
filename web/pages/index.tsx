import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { utils } from "ethers";
import { Spinner } from "../components/spinner";
import {
  Card,
  CardTitle,
  CardSubtitle,
  CardBody,
  CardText,
  Button,
} from "reactstrap";
import {
  getMarketplaceContract,
  getProvider,
  getTicketNFTContract,
  ticketNFTNetworks,
} from "../util/ethers";

import { NFT } from "../types/NFT";

export default function Home() {
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loadingText, setLoadingText] = useState<string>("Loading...");

  useEffect(() => {
    loadNFTs();
  }, []);

  async function loadNFTs() {
    const provider = await getProvider();
    const { chainId } = await provider.getNetwork();

    // Get all listed NFTs
    const marketPlaceContract = await getMarketplaceContract(provider, chainId);

    const listings = await marketPlaceContract.getListedNfts();

    const ticketsNFTContract = await getTicketNFTContract(provider, chainId);

    // Iterate over the listed NFTs and retrieve their metadata
    const nfts = await Promise.all(
      listings.map(async (i) => {
        try {
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
          console.log(`ID: ${i.tokenId}-OK`);
          return nft;
        } catch (err) {
          console.log(`ID: ${i.tokenId}-ERROR`);
          console.error(err);
          return null;
        }
      })
    );

    // @ts-ignore
    setNfts(nfts.filter((nft) => nft !== null));
    setLoadingText("");
  }

  async function buyNft(nft: NFT) {
    setLoadingText("Buying NFT...");
    const provider = await getProvider();
    const { chainId } = await provider.getNetwork();

    const marketPlaceContract = await getMarketplaceContract(
      provider,
      chainId,
      true
    );

    const accounts = await provider.listAccounts();
    let tx = await marketPlaceContract.buyNft(
      ticketNFTNetworks[chainId].address,
      nft.tokenId,
      { from: accounts[0], value: nft.price }
    );
    setLoadingText("Waiting for transaction to complete...");
    tx.wait().then(() => loadNFTs());
  }

  if (!loadingText && !nfts.length) {
    return <h1 className="px-20 py-10 text-3xl">No tickets available!</h1>;
  }

  return (
    <div className="flex justify-center">
      {loadingText ? <Spinner text={loadingText} /> : null}
      <div className="px-4" style={{ maxWidth: "1600px" }}>
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
                <Button onClick={() => buyNft(nft)}>Buy</Button>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

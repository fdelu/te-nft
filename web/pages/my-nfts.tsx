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
import { Spinner } from "../components/spinner";
import {
  Card,
  CardTitle,
  CardSubtitle,
  CardBody,
  CardText,
  Button,
} from "reactstrap";

export default function MyAssets() {
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loadingText, setLoadingText] = useState("Loading...");
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
    setLoadingText("");
  }

  function listNFT(nft: NFT) {
    router.push(`/resell-nft?id=${nft.tokenId}&tokenURI=${nft.tokenURI}`);
  }

  if (!loadingText && !nfts.length) {
    return <h1 className="py-10 px-20 text-3xl">No NFTs owned</h1>;
  }
  return (
    <div className="flex justify-center">
      {loadingText ? <Spinner text={loadingText} /> : null}
      <div className="p-4">
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
                <Button onClick={() => listNFT(nft)}>List</Button>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

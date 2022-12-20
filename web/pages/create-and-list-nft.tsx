import { ChangeEvent, useState } from "react";
import { create as ipfsHttpClient } from "ipfs-http-client";
import { useRouter } from "next/router";
import { BigNumber, utils } from "ethers";
import { Spinner } from "../components/spinner";
import {
  getMarketplaceContract,
  getProvider,
  getTicketNFTContract,
  ticketNFTNetworks,
} from "../util/ethers";
import { LOADING_TEXT } from "../types/loading-messages";

// Todo: Use Next.js API call to avoid exposiing this to the browser
const projectId = process.env.NEXT_PUBLIC_INFURA_PROJECT_ID;
const projectSecret = process.env.NEXT_PUBLIC_INFURA_API_KEY_SECRET;
const auth =
  "Basic " + Buffer.from(`${projectId}:${projectSecret}`).toString("base64");
const IPFS_URL = "ipfs.io";
const client = ipfsHttpClient({
  host: IPFS_URL,
  port: 5001,
  protocol: "https",
  headers: {
    authorization: auth,
  },
});

export default function CreateItem() {
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [loadingText, setLoadingText] = useState<string>(LOADING_TEXT.EMPTY);
  const [formInput, updateFormInput] = useState({
    price: "",
    name: "",
    description: "",
  });
  const router = useRouter();

  async function onChange(e: ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;

    const str = "Uploading image to IPFS: ";
    setLoadingText(LOADING_TEXT.UPLOAD_IMAGE + "0%");
    const file = e.target.files[0];
    console.log("File size: ", file?.size);
    if (!file) return;
    try {
      const added = await client.add(file, {
        progress: (prog) => {
          const perc = Math.round((prog / file.size) * 100);
          setLoadingText(LOADING_TEXT.UPLOAD_IMAGE + perc + "%");
        },
      });
      const url = `https://${IPFS_URL}/ipfs/${added.path}`;
      setFileUrl(url);
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
    setLoadingText(LOADING_TEXT.EMPTY);
  }

  async function uploadToIPFS() {
    const { name, description, price } = formInput;
    if (!name || !description || !price || !fileUrl) {
      return;
    } else {
      // first, upload metadata to IPFS
      const data = JSON.stringify({
        name,
        description,
        image: fileUrl,
      });
      try {
        const added = await client.add(data);
        const url = `https://${IPFS_URL}/ipfs/${added.path}`;
        // after metadata is uploaded to IPFS, return the URL to use it in the transaction
        return url;
      } catch (error) {
        console.log("Error uploading file: ", error);
      }
    }
  }

  async function listNFTForSale() {
    setLoadingText(LOADING_TEXT.WEB3);
    const provider = await getProvider();
    setLoadingText(LOADING_TEXT.UPLOAD_NFT);
    const url = await uploadToIPFS();
    setLoadingText(LOADING_TEXT.MINT_NFT);
    if (!url) return;
    const { chainId } = await provider.getNetwork();

    // Mint the NFT
    const ticketNFTContract = await getTicketNFTContract(
      provider,
      chainId,
      true
    );
    const accounts = await provider.listAccounts();
    const marketPlaceContract = await getMarketplaceContract(
      provider,
      chainId,
      true
    );
    let listingFee = (await marketPlaceContract.getListingFee()).toString();
    const tx_mint = await ticketNFTContract.mint(url, { from: accounts[0] });
    setLoadingText(LOADING_TEXT.WAIT_TRANSACTION);
    const receipt = await tx_mint.wait();

    setLoadingText(LOADING_TEXT.LIST_NFT_FOR_SALE);

    // List the NFT
    const tokenId = receipt.events?.find((e) => e.event == "NFTMinted")
      ?.args?.[0] as BigNumber;
    if (!tokenId) {
      console.error("Error: Token ID not found");
      return;
    }
    const tx_list = await marketPlaceContract.listNft(
      ticketNFTNetworks[chainId].address,
      tokenId,
      utils.parseUnits(formInput.price, "ether"),
      { from: accounts[0], value: listingFee }
    );

    setLoadingText(LOADING_TEXT.WAIT_TRANSACTION);
    await tx_list.wait();

    console.log("listed");
    router.push("/");
  }

  return (
    <div className="flex justify-center">
      {loadingText ? <Spinner text={loadingText} /> : null}
      <div className="w-1/2 flex flex-col pb-12">
        <input
          placeholder="Asset Name"
          className="mt-8 border rounded p-4"
          onChange={(e) =>
            updateFormInput({ ...formInput, name: e.target.value })
          }
        />
        <textarea
          placeholder="Asset Description"
          className="mt-2 border rounded p-4"
          onChange={(e) =>
            updateFormInput({ ...formInput, description: e.target.value })
          }
        />
        <input
          placeholder="Asset Price in Eth"
          className="mt-2 border rounded p-4"
          onChange={(e) =>
            updateFormInput({ ...formInput, price: e.target.value })
          }
        />

        <input type="file" name="Asset" className="my-4" onChange={onChange} />
        {fileUrl && <img className="rounded mt-4" width="350" src={fileUrl} />}
        <button
          onClick={listNFTForSale}
          className="font-bold mt-4 bg-teal-400 text-white rounded p-4 shadow-lg"
        >
          Mint and list NFT
        </button>
      </div>
    </div>
  );
}

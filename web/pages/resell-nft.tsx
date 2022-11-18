import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import {
  getMarketplaceContract,
  getProvider,
  ticketNFTNetworks,
} from "../util/ethers";
import { utils } from "ethers";
import { Spinner } from "../components/spinner";
import { LOADING_TEXT } from "../types/loading-messages";

export default function ResellNFT() {
  const [loadingText, setLoadingText] = useState(LOADING_TEXT.EMPTY);
  const [formInput, updateFormInput] = useState({ price: "", image: "" });
  const router = useRouter();
  const { id, tokenURI } = router.query;
  const { image, price } = formInput;

  useEffect(() => {
    fetchNFT();
  }, [id]);

  async function fetchNFT() {
    if (!tokenURI) {
      return;
    } else {
      const meta = await axios.get(tokenURI.toString());
      updateFormInput((state) => ({ ...state, image: meta.data.image }));
    }
  }

  async function listNFTForSale() {
    if (!price || !id) {
      return;
    } else {
      setLoadingText(LOADING_TEXT.LIST_NFT);
      const provider = await getProvider();
      const { chainId } = await provider.getNetwork();
      const marketPlaceContract = await getMarketplaceContract(
        provider,
        chainId,
        true
      );
      let listingFee = (await marketPlaceContract.getListingFee()).toString();
      const accounts = await provider.listAccounts();
      setLoadingText(LOADING_TEXT.WAIT_TRANSACTION);
      await (
        await marketPlaceContract.resellNft(
          ticketNFTNetworks[chainId].address,
          id.toString(),
          utils.parseUnits(formInput.price, "ether"),
          { from: accounts[0], value: listingFee }
        )
      ).wait();

      router.push("/");
    }
  }

  return (
    <div className="flex justify-center">
      {loadingText ? <Spinner text={loadingText} /> : null}

      <div className="w-1/2 flex flex-col pb-12">
        <input
          placeholder="Asset Price in Eth"
          className="mt-2 border rounded p-4"
          onChange={(e) =>
            updateFormInput({ ...formInput, price: e.target.value })
          }
        />
        {image && <img className="rounded mt-4" width="350" src={image} />}
        <button
          onClick={listNFTForSale}
          className="font-bold mt-4 bg-teal-400 text-white rounded p-4 shadow-lg"
        >
          List NFT
        </button>
      </div>
    </div>
  );
}

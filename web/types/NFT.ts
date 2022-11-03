import type { BigNumber } from "ethers";

export interface NFT {
  price: BigNumber;
  tokenId: BigNumber;
  seller: string;
  owner: string;
  image: any;
  name?: any;
  description?: any;
  tokenURI?: string;
}

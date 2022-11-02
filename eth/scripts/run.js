var TicketNFT = artifacts.require("TicketNFT");
var Marketplace = artifacts.require("Marketplace");

async function logNftLists(marketplace) {
  let listedNfts = await marketplace.getListedNfts.call();
  const accountAddress = "0x226Dc8B3AD819d13A6f80c28D7c1E8203ef1cFf3";
  let myNfts = await marketplace.getMyNfts.call({ from: accountAddress });
  let myListedNfts = await marketplace.getMyListedNfts.call({
    from: accountAddress,
  });
  console.log(`listedNfts: ${listedNfts.length}`);
  console.log(`myNfts: ${myNfts.length}`);
  console.log(`myListedNfts ${myListedNfts.length}\n`);
}

const main = async (cb) => {
  try {
    const ticketNFTs = await TicketNFT.deployed();
    const marketplace = await Marketplace.deployed();

    console.log("MINT AND LIST 3 NFTs");
    let listingFee = await marketplace.getListingFee();
    listingFee = listingFee.toString();
    let txn1 = await ticketNFTs.mint("URI1");
    let tokenId1 = txn1.logs[2].args[0].toNumber();
    await marketplace.listNft(ticketNFTs.address, tokenId1, 1, {
      value: listingFee,
    });
    console.log(`Minted and listed ${tokenId1}`);
    let txn2 = await ticketNFTs.mint("URI1");
    let tokenId2 = txn2.logs[2].args[0].toNumber();
    await marketplace.listNft(ticketNFTs.address, tokenId2, 1, {
      value: listingFee,
    });
    console.log(`Minted and listed ${tokenId2}`);
    let txn3 = await ticketNFTs.mint("URI1");
    let tokenId3 = txn3.logs[2].args[0].toNumber();
    await marketplace.listNft(ticketNFTs.address, tokenId3, 1, {
      value: listingFee,
    });
    console.log(`Minted and listed ${tokenId3}`);
    await logNftLists(marketplace);

    console.log("BUY 2 NFTs");
    await marketplace.buyNft(ticketNFTs.address, tokenId1, { value: 1 });
    await marketplace.buyNft(ticketNFTs.address, tokenId2, { value: 1 });
    await logNftLists(marketplace);

    console.log("RESELL 1 NFT");
    await marketplace.resellNft(ticketNFTs.address, tokenId2, 1, {
      value: listingFee,
    });
    await logNftLists(marketplace);
  } catch (err) {
    console.log("Doh! ", err);
  }
  cb();
};

module.exports = main;

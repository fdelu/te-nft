const { ethers } = require("hardhat");

async function main() {
  const TicketTEs = await ethers.getContractFactory("TicketTE");
  const ticketTEs = await TicketTEs.deploy();

  const address = ticketTEs.address;
  console.log(`Deployed NFT: https://goerli.etherscan.io/address/${address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

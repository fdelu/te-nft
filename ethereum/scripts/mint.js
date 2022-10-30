require("dotenv").config();
const { ethers } = require("hardhat");

const contract = require("../artifacts/contracts/TicketTE.sol/TicketTE.json");
const contractInterface = contract.abi;

// https://docs.ethers.io/v5/api/providers
const provider = ethers.getDefaultProvider("goerli", {
  alchemy: process.env.DEV_API_URL,
});

// https://docs.ethers.io/v5/api/signer/#Wallet
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

//https://docs.ethers.io/v5/api/contract/contract
const ticketTEs = new ethers.Contract(
  process.env.PUBLIC_KEY,
  contractInterface,
  wallet
);

const main = () => {
  ticketTEs
    .mint(process.env.PUBLIC_KEY)
    .then((transaction) => console.log(transaction))
    .catch((e) => console.log("something went wrong", e));
};

main();

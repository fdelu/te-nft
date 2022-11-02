var TicketNFT = artifacts.require("TicketNFT");
var Marketplace = artifacts.require("Marketplace");

module.exports = async function (deployer) {
  await deployer.deploy(Marketplace);
  const marketplace = await Marketplace.deployed();
  await deployer.deploy(TicketNFT, marketplace.address);
} as Truffle.Migration;

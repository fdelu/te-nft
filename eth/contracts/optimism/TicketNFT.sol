// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract TicketNFT is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    address marketplaceContract;
    event NFTMinted(uint256);

    constructor(address _marketplaceContract) ERC721("Ticket NFT", "TNFT") {
        marketplaceContract = _marketplaceContract;
        _tokenIds.increment();
    }

    function mint(string memory _tokenURI) public {
        uint256 newTokenId = _tokenIds.current();
        _tokenIds.increment();
        _safeMint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, _tokenURI);
        setApprovalForAll(marketplaceContract, true);
        emit NFTMinted(newTokenId);
    }
}

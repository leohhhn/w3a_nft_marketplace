// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;

interface INFTMarketplace {

    struct Listing {
        address seller;
        uint256 price;
    }

    event CreatedNFT(uint256 tokenID, string tokenURI, address creator);
    event SoldNFT(uint256 tokenID, uint256 price, address buyer);
    event ListedNFT(uint256 tokenID, uint256 price);
    event ClearedListing(uint256 tokenID);

    //todo insert docs
    // natspec
    function createNFT(string memory _tokenURI) external;

    function buyNFT(uint256 _tokenID) external payable;

    function listNFT(uint256 _tokenID, uint256 price) external;

    function cancelListing(uint256 _tokenID) external;
}

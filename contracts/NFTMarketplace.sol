// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./interfaces/INFTMarketplace.sol";

contract NFTMarketplace is ERC721URIStorage, Ownable, INFTMarketplace {

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    mapping(uint256 => Listing) public _listings;

    constructor() ERC721("Web3 Academy NFTs", "W3ANFTs") {
    }

    function createNFT(string memory _tokenURI) external {
        uint256 _newId = _tokenIdCounter.current();

        _safeMint(msg.sender, _newId);
        _setTokenURI(_newId, _tokenURI);
        _tokenIdCounter.increment();

        emit CreatedNFT(_newId, _tokenURI, msg.sender);
    }

    function listNFT(uint256 _tokenID, uint256 _price) external {
        require(_price > 0, "Price must be greater than 0");

        _listings[_tokenID] = Listing(msg.sender, _price);
        transferFrom(msg.sender, address(this), _tokenID);

        emit ListedNFT(_tokenID, _price);
    }

    function cancelListing(uint256 _tokenID) external {
        Listing memory listing = _listings[_tokenID];
        require(listing.seller == msg.sender, "Not the owner of the listing");

        ERC721(address(this)).transferFrom(address(this), msg.sender, _tokenID);
        delete listing;

        emit ClearedListing(_tokenID);
    }

    function buyNFT(uint256 _tokenID) external payable {
        Listing memory listing = _listings[_tokenID];
        require(listing.seller != address(0), "Listing doesn't exist");
        require(msg.value == listing.price, "Wrong price");
        ERC721(address(this)).transferFrom(address(this), msg.sender, _tokenID);

        (bool sent,) = listing.seller.call{value : msg.value * 95 / 100}("");
        require(sent, "Failed to send Ether");

        emit SoldNFT(_tokenID, listing.price, msg.sender);
    }
}

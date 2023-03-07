// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./interfaces/INFTMarketplace.sol";
import "./W3ACandidates.sol";

contract NFTMarketplace is ERC721URIStorage, Ownable, INFTMarketplace {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    mapping(uint256 => Listing) public _listings;
    W3ACandidates public candidates;

    modifier onlyCandidates() {
        require(candidates.checkCandidate(msg.sender), "Not a W3A Candidate");
        _;
    }

    constructor(address _candidates) ERC721("Web3 Academy NFTs", "W3ANFTs") {
        candidates = W3ACandidates(_candidates);
    }

    function createNFT(string memory _tokenURI) external {
        uint _newTokenId = _tokenIdCounter.current();
        _safeMint(msg.sender, _newTokenId);
        _setTokenURI(_newTokenId, _tokenURI);

        _tokenIdCounter.increment();
        emit CreatedNFT(_newTokenId, _tokenURI, msg.sender);
    }

    function listNFT(uint256 _tokenID, uint256 _price) external {
        require(_price > 0, "Price of listing cannot be 0");

        transferFrom(msg.sender, address(this), _tokenID);
        _listings[_tokenID] = Listing(msg.sender, _price);

        emit ListedNFT(_tokenID, _price);
    }

    function cancelListing(uint256 _tokenID) external {
        Listing memory listing = _listings[_tokenID];

        require(listing.price > 0, "Listing for this NFT doesn't exist");
        require(listing.seller == msg.sender, "Not listing owner");

        ERC721(address(this)).transferFrom(address(this), msg.sender, _tokenID);
        clearListing(_tokenID);
        emit ClearedListing(_tokenID);
    }

    function buyNFT(uint256 _tokenID) external payable {
        Listing memory listing = _listings[_tokenID];

        require(listing.price != 0, "NFT not listed for sale");
        require(msg.value == listing.price, "Incorrect amount of ETH");

        ERC721(address(this)).transferFrom(address(this), msg.sender, _tokenID);

        // https://solidity-by-example.org/sending-ether/

        (bool sent,) = payable(listing.seller).call{value : (listing.price * 95 / 100)}("");
        require(sent, "ETH Transfer failed");

        emit SoldNFT(_tokenID, msg.value);
    }

    function clearListing(uint256 _tokenId) internal {
        delete _listings[_tokenId];
    }
}

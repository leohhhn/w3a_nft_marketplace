// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract W3ACandidates is Ownable {

    mapping(address => bool) public candidates;

    constructor() {
        candidates[msg.sender] = true;
    }

    function addCandidate(address _candidate) external onlyOwner {
        candidates[_candidate] = true;
    }

    function addCandidates(address[] memory _candidates) external onlyOwner {
        for (uint i = 0; i < _candidates.length; i++) {
            candidates[_candidates[i]] = true;
        }
    }

    function checkCandidate(address _candidate) external view returns (bool) {
        return candidates[_candidate];
    }
}

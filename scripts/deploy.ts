import {ethers} from 'hardhat';

async function main() {

    const [deployer] = await ethers.getSigners();
    console.log('Deploying with: ' + deployer.address);

    let W3ACandidates = await ethers.getContractFactory('W3ACandidates');
    let w3aCandidates = await W3ACandidates.deploy();
    await w3aCandidates.deployed();

    console.log('Deployed W3ACandidates to: ' + w3aCandidates.address);

    let NFTMarketplace = await ethers.getContractFactory('NFTMarketplace');
    let nftMarketplace = await NFTMarketplace.deploy(w3aCandidates.address);
    await nftMarketplace.deployed();

    console.log('Deployed NFTMarketplace to: ' + nftMarketplace.address);
}
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

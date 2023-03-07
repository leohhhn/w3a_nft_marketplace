import {ethers} from 'hardhat';

async function main() {

    const [deployer] = await ethers.getSigners();
    console.log('Deploying with: ' + deployer.address);

    let NFTMarketplace = await ethers.getContractFactory('NFTMarketplace');
    let nftMarketplace = await NFTMarketplace.deploy();
    await nftMarketplace.deployed();

    console.log('Deployed NFTMarketplace to: ' + nftMarketplace.address);
}
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

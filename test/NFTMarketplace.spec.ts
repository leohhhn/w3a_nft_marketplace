import {ethers} from 'hardhat';
import {NFTMarketplace} from "../typechain-types";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {expect} from "chai";

describe('NFTMarketplace Tests', async () => {

    let nftMarketplace: NFTMarketplace;
    let admin: SignerWithAddress, user: SignerWithAddress;

    let tokenURI = "https://myserver.com/json/1";

    beforeEach('setup env', async () => {
        let NFTMarketplace = await ethers.getContractFactory('NFTMarketplace');
        nftMarketplace = await NFTMarketplace.deploy() as NFTMarketplace;
        [admin, user] = await ethers.getSigners();
    })

    it('should create NFT & emit event', async () => {
        await expect(nftMarketplace.createNFT(tokenURI))
            .to.emit(nftMarketplace, 'CreatedNFT').withArgs(0, tokenURI, admin.address);

        await expect(nftMarketplace.createNFT(tokenURI))
            .to.emit(nftMarketplace, 'CreatedNFT').withArgs(1, tokenURI, admin.address);
    })

    it('should create listing for NFT', async () => {
        await nftMarketplace.createNFT(tokenURI);

        let price = ethers.utils.parseEther('1');
        expect(await nftMarketplace.listNFT(0, price))
            .to.emit(nftMarketplace, 'ListedNFT').withArgs(0, price);
    });

    it('should transfer ownership upon listing', async () => {
        await nftMarketplace.createNFT(tokenURI);

        let price = ethers.utils.parseEther('1');
        expect(await nftMarketplace.ownerOf(0)).to.be.eq(admin.address);

        await nftMarketplace.listNFT(0, price);

        expect(await nftMarketplace.ownerOf(0)).to.be.eq(nftMarketplace.address);

    });

    it('should buy/sell NFT correctly', async () => {
        await nftMarketplace.createNFT(tokenURI);
        let price = ethers.utils.parseEther('1');
        await nftMarketplace.listNFT(0, price);

        let balanceAdminBefore = await admin.getBalance();
        await nftMarketplace.connect(user).buyNFT(0, {value: price});

        let balanceAdminAfter = await admin.getBalance();

        expect(balanceAdminAfter.sub(balanceAdminBefore)).to.be.eq(price.mul(95).div(100));
    });

});
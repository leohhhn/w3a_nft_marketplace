import {ethers} from 'hardhat';
import {expect} from 'chai';
import {BigNumber} from "ethers";
import {W3ACandidates, NFTMarketplace} from '../typechain-types';
import {SignerWithAddress} from '@nomiclabs/hardhat-ethers/signers';

describe('NFTMarketplace Tests', async () => {

    let w3aCandidates: W3ACandidates;
    let nftMarketplace: NFTMarketplace;

    let admin: SignerWithAddress, user: SignerWithAddress;

    let exampleTokenURI: string = "https://myserver.com/tokenMetadata/";

    beforeEach(async () => {
        [admin, user] = await ethers.getSigners();

        let W3ACandidates = await ethers.getContractFactory('W3ACandidates');
        w3aCandidates = await W3ACandidates.deploy() as W3ACandidates;
        await w3aCandidates.deployed();

        let NFTMarketplace = await ethers.getContractFactory('NFTMarketplace');
        nftMarketplace = await NFTMarketplace.deploy(w3aCandidates.address) as NFTMarketplace;
        await nftMarketplace.deployed();
    });

    it('should create NFT & emit Created event', async () => {
        await expect(await nftMarketplace.createNFT(exampleTokenURI))
            .to.emit(nftMarketplace, 'CreatedNFT')
            .withArgs(0, exampleTokenURI, admin.address);
    });

    it('should create listing & emit listing event', async () => {
        await nftMarketplace.createNFT(exampleTokenURI);

        let price = ethers.utils.parseEther('1');

        await expect(await nftMarketplace.listNFT(0, price))
            .to.emit(nftMarketplace, 'ListedNFT')
            .withArgs(0, price);
    });

    it('should sell nft & collect fee', async () => {
        let price = ethers.utils.parseEther('1');
        let fee = price.sub(price.mul(95).div(100));

        let marketBalanceBefore: BigNumber = await ethers.provider.getBalance(nftMarketplace.address);

        await nftMarketplace.createNFT(exampleTokenURI);
        await nftMarketplace.listNFT(0, price);

        expect(await nftMarketplace.buyNFT(0, {value: price}))
            .to.emit(nftMarketplace, 'SoldNFT').withArgs(0, price);

        let marketBalanceAfter: BigNumber = await ethers.provider.getBalance(nftMarketplace.address);

        expect(marketBalanceAfter.sub(marketBalanceBefore)).to.be.eq(fee);
    });

    it('should transfer ownership upon sale', async () => {
        let price = ethers.utils.parseEther('1');

        // admin creates & lists NFT
        await nftMarketplace.createNFT(exampleTokenURI);
        expect(await nftMarketplace.ownerOf(0)).to.be.eq(admin.address);

        await nftMarketplace.listNFT(0, price);
        expect(await nftMarketplace.ownerOf(0)).to.be.eq(nftMarketplace.address);

        await nftMarketplace.connect(user).buyNFT(0,{value: price});
        expect(await nftMarketplace.ownerOf(0)).to.be.eq(user.address);

    });




});
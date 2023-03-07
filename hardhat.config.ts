import {HardhatUserConfig} from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';

import * as dotenv from 'dotenv';

dotenv.config({path: __dirname + '/.env'});

const config: HardhatUserConfig = {
    solidity: '0.8.18',

    // // DEPLOYMENT
    // networks: {
    //     goerli: {
    //         url: process.env.ALCHEMY_GOERLI_URL,
    //         accounts: [`0x${process.env.PRIVATE_KEY}`],
    //     },
    // },
    // etherscan: {
    //     apiKey: process.env.ETHERSCAN_API_KEY,
    // }
};

export default config;

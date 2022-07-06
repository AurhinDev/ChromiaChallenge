require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require('@openzeppelin/hardhat-upgrades');
require("dotenv").config({path:".env"})
//require('@symblox/hardhat-abi-gen');

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      gas: 2600000    
    },
    rinkeby: {
      url: "https://eth-rinkeby.alchemyapi.io/v2/CZurhojJKjHztWuvPlc4coBqQM_9KZUI",
      accounts: [process.env.PRIVATE_KEY_MAIN, process.env.PRIVATE_KEY_SECOND]
    },
    mumbai: {
      url: "https://polygon-mumbai.g.alchemy.com/v2/_SN6bv605oNDkPN_lNjCLzaPzzcfnQMI",
      accounts: [process.env.PRIVATE_KEY_MAIN, process.env.PRIVATE_KEY_SECOND],
      gas: 26000000
    },
    mainnet: {
      url: "https://eth-mainnet.alchemyapi.io/v2/PqxTA5MX4SQlIRspW02IitZMpjcyMN8I",
      accounts: [process.env.PRIVATE_KEY_MAIN, process.env.PRIVATE_KEY_SECOND],
      gas: 26000000
    }
  },
  etherscan: {
    apiKey: "UXZI8GNPJHN4DRBF4Y5J19831XB74T7GGQ"
  },
  abiExporter: {
    path: './data/abi',
    clear: true,
    flat: true,
    only: [],
    spacing: 2
  },
  solidity: {
    version: "0.8.7",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  mocha: {
    timeout: 40000
  }
};
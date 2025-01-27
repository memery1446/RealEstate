import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  networks: {
    hardhat: {},
    localhost: {
      url: "http://127.0.0.1:8545/"
    }
  },
  paths: {
    sources: "./src/contracts",
    tests: "./test",
    artifacts: "./src/contracts/abis"
  }
};

export default config;


// scripts/deploy.ts
const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying PropertyManager contract...");

  // Get the ContractFactory
  const PropertyManager = await ethers.getContractFactory("PropertyManager");
  
  // Deploy the contract
  const propertyManager = await PropertyManager.deploy();

  // Wait for deployment to finish
  await propertyManager.waitForDeployment();

  const address = await propertyManager.getAddress();
  console.log("PropertyManager deployed to:", address);
}

// Execute deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

  
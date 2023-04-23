const hardhat = require("hardhat");

async function main() {
  // Fetch contract from `contracts` folder
  const EgoToken = await hardhat.ethers.getContractFactory('EgoToken');
  // Deploy contract and save deployed contract instance in `token` variable
  const token = await EgoToken.deploy();
  // Wait for deployment transaction to complete before moving
  await token.deployed();

  
  // Save contract address and ABI 
  saveData(token);
}

// Saves the contract data i.e ABI and contract address 
function saveData(contract) {
  const fs = require("fs");
  const contractsDir = __dirname + "/../src/contracts";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + "/Token-address.json",
    JSON.stringify({ Token: contract.address }, undefined, 2)
  );

  const contractData = hardhat.artifacts.readArtifactSync("EgoToken"); 

  fs.writeFileSync(
    contractsDir + "/Token.json",
    JSON.stringify(contractData, null, 4)
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
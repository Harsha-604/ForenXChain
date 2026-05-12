// scripts/deploy.js
const hre = require("hardhat");

async function main() {
  const EvidenceStore = await hre.ethers.deployContract("EvidenceStore");
  await EvidenceStore.waitForDeployment();

  console.log(`EvidenceStore deployed to: ${await EvidenceStore.getAddress()}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

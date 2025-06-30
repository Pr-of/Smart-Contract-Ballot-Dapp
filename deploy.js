const hre = require("hardhat");

async function main() {
    const Ballot = await hre.ethers.getContractFactory("Ballot");
    const proposals = ["Alice", "Bob", "Charlie"].map(name => hre.ethers.utils.formatBytes32String(name));

    const ballot = await Ballot.deploy(proposals);
    await ballot.deployed();

    console.log("Ballot deployed to:", ballot.address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
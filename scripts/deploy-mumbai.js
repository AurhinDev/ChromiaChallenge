// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {

    //dev = "0x7BA1C74E6998AACD5717cf5d7907130b7Aeb4932";

    [owner, operator] = await ethers.getSigners();
    console.log("Owner",  owner.address);
    console.log("Operator",  operator.address);
    const TokenUSDT = await ethers.getContractFactory("TokenUSDT");
    usdt = await TokenUSDT.deploy();
    console.log("usdt adr",  usdt.address);
    await usdt.deployed();

    const CL = await ethers.getContractFactory("CollateralizedLeverage");
    cl = await CL.deploy(usdt.address);
    console.log("cl adr",  cl.address);
    await cl.deployed();

//     await usdt.connect(operator).approve(cl.address, ethers.utils.parseEther("10"));
//     await usdt.connect(owner).approve(cl.address, ethers.utils.parseEther("10"));
 }

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
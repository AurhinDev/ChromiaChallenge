const { expect } = require("chai");
const { ethers } = require("hardhat");


describe("Initial Deployment", function () {

  let owner, operator, dev

  beforeEach(async function() {
    [owner, operator, dev] = await ethers.getSigners();

    // Deploy A
    const A = await ethers.getContractFactory("TokenUSDT");
    a = await A.deploy();
    await a.deployed();

    expect(await a.balanceOf(owner.address)).to.equal(ethers.utils.parseEther("10"));

    await a.transfer(dev.address, ethers.utils.parseEther("2"));
    expect(await a.balanceOf(dev.address)).to.equal(ethers.utils.parseEther("2"));

    // Deploy Tokensale
    const CollateralizedLeverage = await ethers.getContractFactory("CollateralizedLeverage");
    cl = await CollateralizedLeverage.deploy(a.address);
    await cl.deployed();


    // Set allowances
    await a.connect(dev).approve(cl.address, ethers.utils.parseEther("10"));
    await a.connect(owner).approve(cl.address, ethers.utils.parseEther("10"));
  })

  it("Should have correct values", async function () {

    let ownerUSDT2 = await a.balanceOf(owner.address);
    let devUSDT2= await a.balanceOf(dev.address);

    let ownerEth2 = await ethers.provider.getBalance(owner.address)
    let devEth2 = await ethers.provider.getBalance(dev.address)

    console.log("OwnerUSDT", ownerUSDT2);
    console.log("devUSDT", devUSDT2);
    console.log("ownerEth", ownerEth2);
    console.log("devEth", devEth2);

    await cl.PostLoan(ethers.utils.parseEther("1"), 4);
    await cl.connect(dev).TakeLoan(0, {
      value: ethers.utils.parseEther("2") // 2 ether
    });
    
    await cl.connect(dev).PayBack(0);
    await cl.ClaimStable(0);

    let ownerUSDT = await a.balanceOf(owner.address);
    let devUSDT= await a.balanceOf(dev.address);

    let ownerEth = await ethers.provider.getBalance(owner.address)
    let devEth = await ethers.provider.getBalance(dev.address)

    console.log("OwnerUSDT", ownerUSDT);
    console.log("devUSDT", devUSDT);
    console.log("ownerEth", ownerEth);
    console.log("devEth", devEth);
  });
});
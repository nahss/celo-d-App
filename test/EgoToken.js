const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("EgoToken", function () {
  let egoToken;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  beforeEach(async function () {
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    const EgoToken = await ethers.getContractFactory("EgoToken");
    egoToken = await EgoToken.deploy();
    await egoToken.deployed();
  });
  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await egoToken.owner()).to.equal(owner.address);
    });

    it("Should set the name and symbol of the token", async function () {
      expect(await egoToken.name()).to.equal("EgoToken");
      expect(await egoToken.symbol()).to.equal("EGT");
    });
  });

  describe("safeMint", function () {
    it("Should mint a new token and set the correct tokenURI", async function () {
      const uri = "https://example.com/token/0";
      await egoToken.safeMint(uri);
      expect(await egoToken.tokenCounter()).to.equal(1);
      const tokenId = 0;
      expect(await egoToken.ownerOf(tokenId)).to.equal(owner.address);
      expect(await egoToken.tokenURI(tokenId)).to.equal(uri);
    });
  });

  describe("tokenCounter", function () {
    it("Should return the total number of tokens minted", async function () {
      expect(await egoToken.tokenCounter()).to.equal(0);
      await egoToken.safeMint("https://example.com/token/0");
      expect(await egoToken.tokenCounter()).to.equal(1);
      await egoToken.safeMint("https://example.com/token/1");
      expect(await egoToken.tokenCounter()).to.equal(2);
    });
  });

  describe("_burn", function () {
    it("Should burn an existing token", async function () {
      const uri = "https://example.com/token/0";
      await egoToken.safeMint(uri);
      const tokenId = 0;
      expect(await egoToken.ownerOf(tokenId)).to.equal(owner.address);
      await egoToken._burn(tokenId);
      expect(await egoToken.tokenCounter()).to.equal(0);
    });
  });

  describe("minting", function () {
    it("increments the total token count", async function () {
      await egoToken.safeMint("https://example.com/token1");
      await egoToken.safeMint("https://example.com/token2");
      expect(await egoToken.tokenCounter()).to.equal(2);
    });

    it("assigns the caller as the owner of the minted token", async function () {
      await egoToken.safeMint("https://example.com/token1");
      expect(await egoToken.ownerOf(0)).to.equal(owner.address);
    });

    it("sets the URI for the minted token", async function () {
      await egoToken.safeMint("https://example.com/token1");
      expect(await egoToken.tokenURI(0)).to.equal("https://example.com/token1");
    });
  });

 
});
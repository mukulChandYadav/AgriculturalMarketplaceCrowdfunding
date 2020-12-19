var ProductHub = artifacts.require("ProductHub.sol");
let StandardRegisterUserHub = artifacts.require('StandardRegisterUserHub.sol');
let SupplychainHub = artifacts.require('SupplychainHub.sol');
let MathLib = artifacts.require('Math.sol');


module.exports = async function (deployer, network, accounts) {


  console.log("Network: " + network);
  await deployer.deploy(MathLib, { from: accounts[9] });
  await deployer.link(MathLib, StandardRegisterUserHub);
  await deployer.deploy(StandardRegisterUserHub, { from: accounts[9] });

  hub = await StandardRegisterUserHub.deployed();

  console.log("RegisterHub addr:", StandardRegisterUserHub.address);
  if (network !== "test") {
    var reg1 = hub.registerUser("Farmer 1", 1, { from: accounts[1] })
      .then((result) => {
        console.log("Farmer registered:" + result);

      });
    var reg2 = hub.registerUser("Farmer 3", 1, { from: accounts[4] })
      .then((result3) => {
        console.log("Farmer registered:" + result3);

      });
    var reg3 = hub.registerUser("Investor 1", 3, { from: accounts[2] })
      .then((result1) => {
        console.log("Investor registered:" + result1);
      });

    var reg4 = hub.registerUser("Farmer 2", 1, { from: accounts[3] })
      .then((result2) => {
        console.log("Farmer registered:" + result2);
      });

    var reg5 = hub.registerUser("Investor 2", 3, { from: accounts[5] })
      .then((result4) => {
        console.log("Investor registered:" + result4);
      });

    var reg6 = hub.registerUser("Donor 1", 2, { from: accounts[6] })
      .then((result5) => {
        console.log("Donor registered:" + result5);
      });


    var reg7 = hub.registerUser("Spot Market Consumer 1", 5, { from: accounts[7] })
      .then((result6) => {
        console.log("Spot Market Consumer registered:" + result6);
      });

    var reg8 = hub.registerUser("Forward Market Consumer 1", 4, { from: accounts[8] })
      .then((result7) => {
        console.log("Forward Market Consumer registered:" + result7);
      });


    await Promise.all([reg1, reg2, reg3, reg4, reg5, reg6, reg7, reg8]);
  }


  await deployer.deploy(SupplychainHub, { from: accounts[9] });
  let scHub = SupplychainHub.deployed();

  console.log("SCHUB deployed addr:", SupplychainHub.address);

  await deployer.deploy(ProductHub, SupplychainHub.address, StandardRegisterUserHub.address, { from: accounts[9] });
  let productHub = await ProductHub.deployed();
  console.log("Product Hub deployed addr:", ProductHub.address);
  if (network !== "test") {
    var pro1 = productHub.produce(
      web3.utils.asciiToHex("Barley"),
      2,
      101,
      55, { from: accounts[1] }).then(function (result) {
        console.log(result);
        productHub.getproduce(1).then(function (produceDetails) {
          console.log("Crop name:" + web3.utils.hexToAscii(produceDetails[1]));
        });
      });


    var pro2 = productHub.produce(
      web3.utils.asciiToHex("Rice"),
      10,
      101,
      55, { from: accounts[4] }).then(function (result4) {
        productHub.getproduce(5).then(function (produceDetails4) {
          console.log("Crop name:" + web3.utils.hexToAscii(produceDetails4[1]));
        });
      });


    var pro3 = productHub.produce(
      web3.utils.asciiToHex("Millet"),
      10,
      101,
      55, { from: accounts[4] }).then(function (result3) {
        productHub.getproduce(4).then(function (produceDetails3) {
          console.log("Crop name:" + web3.utils.hexToAscii(produceDetails3[1]));
        });
      });


    var pro4 = productHub.produce(
      web3.utils.asciiToHex("Maize"),
      10,
      101,
      55, { from: accounts[3] }).then(function (result2) {
        productHub.getproduce(3).then(function (produceDetails2) {
          console.log("Crop name:" + web3.utils.hexToAscii(produceDetails2[1]));
        });
      });


    var pro5 = productHub.produce(
      web3.utils.asciiToHex("Wheat"),
      10,
      101,
      55, { from: accounts[1] }).then(function (result1) {
        productHub.getproduce(2).then(function (produceDetails1) {
          console.log("Crop name:" + web3.utils.hexToAscii(produceDetails1[1]));
        });
      });

    await Promise.all([pro1, pro2, pro3, pro4, pro5]);
  }
}
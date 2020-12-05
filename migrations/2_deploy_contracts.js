var StructStorage = artifacts.require("StructStorage.sol");
let StandardRegisterUserHub = artifacts.require('StandardRegisterUserHub.sol');
//let StandardSupplychainHub = artifacts.require('StandardSupplychainHub.sol');

// var fundingCap = web3.toWei(2, "ether"); 
// var deadlineInSeconds = 60 * 60; 

module.exports = function (deployer, network, accounts) {

  deployer.deploy(StandardRegisterUserHub)
    .then((hub) => {
      hub.registerUser("Farmer 1", 1, { from: accounts[0] })
        .then((result) => {
          console.log("Farmer registered:" + result);
          hub.registerUser("Investor 1", 3, { from: accounts[2] })
            .then((result1) => {
              console.log("Investor registered:" + result1);
            });
        });
    });

  deployer.deploy(StructStorage)
    .then((storage) => {

      storage.fundaddr(accounts[0]);
      storage.fundaddr(accounts[2]);



      storage.produce(
        web3.utils.asciiToHex("Barley"),
        2,
        101,
        55, {from:accounts[0]}).then(function (result) { console.log(result); });
      storage.getproduce(1).then(function (produceDetails) {
        console.log("Crop name:" + web3.utils.hexToAscii(produceDetails[1]));
      });
    });
};

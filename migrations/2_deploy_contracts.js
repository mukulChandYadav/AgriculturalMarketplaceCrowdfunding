var StructStorage = artifacts.require("StructStorage.sol");
let StandardRegisterUserHub = artifacts.require('StandardRegisterUserHub.sol');
//let StandardSupplychainHub = artifacts.require('StandardSupplychainHub.sol');

// var fundingCap = web3.toWei(2, "ether"); 
// var deadlineInSeconds = 60 * 60; 

module.exports = function (deployer, network, accounts) {

  deployer.deploy(StandardRegisterUserHub, { from: accounts[9] })
    .then((hub) => {
      var pr1 = hub.registerUser("Farmer 1", 1, { from: accounts[0] })
        .then((result) => {
          console.log("Farmer registered:" + result);

        });
      var pr2 = hub.registerUser("Farmer 3", 1, { from: accounts[4] })
        .then((result3) => {
          console.log("Farmer registered:" + result3);

        });
      var pr3 = hub.registerUser("Investor 1", 3, { from: accounts[2] })
        .then((result1) => {
          console.log("Investor registered:" + result1);
        });

      var pr4 = hub.registerUser("Farmer 2", 1, { from: accounts[3] })
        .then((result2) => {
          console.log("Farmer registered:" + result2);
        });

      var pr5 = hub.registerUser("Investor 3", 3, { from: accounts[5] })
        .then((result4) => {
          console.log("Investor registered:" + result4);
        });

      Promise.all(pr1, pr2, pr3, pr4, pr5).then(function (res) {
        deployer.deploy(StructStorage)
          .then((storage) => {

            storage.fundaddr(accounts[0]);
            storage.fundaddr(accounts[2]);
            storage.fundaddr(accounts[3]);
            storage.fundaddr(accounts[4]);
            storage.fundaddr(accounts[5]);


            storage.produce(
              web3.utils.asciiToHex("Barley"),
              2,
              101,
              55, { from: accounts[0] }).then(function (result) {
                console.log(result);
                storage.getproduce(1).then(function (produceDetails) {
                  console.log("Crop name:" + web3.utils.hexToAscii(produceDetails[1]));
                });
              });


            storage.produce(
              web3.utils.asciiToHex("Rice"),
              10,
              101,
              55, { from: accounts[4] }).then(function (result4) {
                storage.getproduce(5).then(function (produceDetails4) {
                  console.log("Crop name:" + web3.utils.hexToAscii(produceDetails4[1]));
                });
              });


            storage.produce(
              web3.utils.asciiToHex("Millet"),
              10,
              101,
              55, { from: accounts[4] }).then(function (result3) {
                storage.getproduce(4).then(function (produceDetails3) {
                  console.log("Crop name:" + web3.utils.hexToAscii(produceDetails3[1]));
                });
              });


            storage.produce(
              web3.utils.asciiToHex("Maize"),
              10,
              101,
              55, { from: accounts[3] }).then(function (result2) {
                storage.getproduce(3).then(function (produceDetails2) {
                  console.log("Crop name:" + web3.utils.hexToAscii(produceDetails2[1]));
                });
              });



            storage.produce(
              web3.utils.asciiToHex("Wheat"),
              10,
              101,
              55, { from: accounts[0] }).then(function (result1) {
                storage.getproduce(2).then(function (produceDetails1) {
                  console.log("Crop name:" + web3.utils.hexToAscii(produceDetails1[1]));
                });
              });

          });

      });
    });





}
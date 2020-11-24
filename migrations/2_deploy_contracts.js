const Supplychain = artifacts.require("./Supplychain.sol");

module.exports = function (deployer, network, accounts) {
  deployer.deploy(Supplychain, {from: accounts[5], overwrite: false });
};

let Math = artifacts.require('Math.sol');
let Tools = artifacts.require('Tools.sol');
let StandardSupplychainHub = artifacts.require('StandardSupplychainHub.sol');

// var fundingCap = web3.toWei(2, "ether"); 
// var deadlineInSeconds = 60 * 60; 

module.exports = function (deployer, network, accounts) {
  deployer.deploy(Math);
  deployer.deploy(Tools);

  deployer.link(Math, StandardSupplychainHub);
  deployer.link(Tools, StandardSupplychainHub);
  //uint256 _upc,
  //     //uint256 _sku,
  //     address payable _ownerID,
  //     address payable _originFarmerID,
  //     string memory _originFarmName,
  //     string memory _originFarmInformation,
  //     string memory _originFarmLatitude,
  //     string memory _originFarmLongitude,
  //     string memory _productNotes,
  //     uint256 _fundingCap,
  //     uint256 _deadline
  deployer.deploy(StandardSupplychainHub, 1, accounts[0], accounts[0], "Farm 1", "GNV1", "Lat.", "long.", "sample product notes", 200, 3600);
  // .then(() => {
  //   return StandardFundingHub.deployed()
  //     .then((hub) => {
  //       return hub.createProject(fundingCap, deadlineInSeconds, {from: web3.eth.coinbase});
  //     })
  // });
};

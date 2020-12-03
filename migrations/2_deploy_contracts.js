let Math = artifacts.require('Math.sol');
let Tools = artifacts.require('Tools.sol');
let SupplychainProduct = artifacts.require('SupplychainProduct.sol');
let StandardProduct = artifacts.require('StandardProduct.sol');
// let CommonUtility = artifacts.require('./CommonUtility.sol');
let CrowdFundedProduct = artifacts.require('CrowdFundedProduct.sol');
let StandardFundingHub = artifacts.require('StandardFundingHub.sol');

let StandardSupplychainHub = artifacts.require('StandardSupplychainHub.sol');

// var fundingCap = web3.toWei(2, "ether"); 
// var deadlineInSeconds = 60 * 60; 

module.exports = function (deployer, network, accounts) {
  //deployer.deploy(SupplychainProduct);
  //deployer.link(SupplychainProduct, StandardProduct);
  //deployer.deploy(StandardProduct);

  // deployer.deploy(CommonUtility);

  // deployer.link(CommonUtility, CrowdFundedProduct);
  //deployer.link(StandardProduct, CrowdFundedProduct);

  //deployer.deploy(CrowdFundedProduct);

  //deployer.link(CrowdFundedProduct, StandardFundingHub);
  // deployer.link(CommonUtility, StandardFundingHub);

  //deployer.deploy(StandardFundingHub);

  deployer.deploy(Math);
  deployer.deploy(Tools);

  deployer.link(Math, StandardSupplychainHub);
  deployer.link(Tools, StandardSupplychainHub);
  //deployer.link(StandardFundingHub, StandardSupplychainHub);


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
  deployer.deploy(StandardSupplychainHub, accounts[5]);
  // .then(() => {
  //   return StandardFundingHub.deployed()
  //     .then((hub) => {
  //       return hub.createProject(fundingCap, deadlineInSeconds, {from: web3.eth.coinbase});
  //     })
  // });
};

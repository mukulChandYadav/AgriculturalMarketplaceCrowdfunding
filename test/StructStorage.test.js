const StructStorage = artifacts.require('./StructStorage.sol');
const SupplychainHub = artifacts.require('./SupplychainHub.sol');
const StandardRegisterUserHub = artifacts.require('./StandardRegisterUserHub.sol');

const BN = require('bn.js');
const { assert } = require('chai');

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bn')(BN))//// Enable and inject BN dependency https://www.chaijs.com/plugins/chai-bn/
  .should();



contract('StructStorage', (accounts) => {
  let structStorage, supplychainHub, standardRegisterUserHub, creator, farmer, investor, customer, upc;

  before(async () => {
    standardRegisterUserHub = await StandardRegisterUserHub.new();
    supplychainHub = await SupplychainHub.new();
    structStorage = await StructStorage.new(supplychainHub.address);
    creator = accounts[0];
    farmer = accounts[1];
    investor = accounts[3];
    customer = accounts[5];
  });

  describe('creation', () => {
    it('deploys successfully', async () => {
      assert.notEqual(structStorage.address, 0x0);
      assert.notEqual(structStorage.address, '');
      assert.notEqual(structStorage.address, null);
      assert.notEqual(structStorage.address, undefined);
    });

    it('verify upc function', async () => {
      const scUPC = await supplychainHub.upc();
      scUPC.should.be.bignumber.equal(await structStorage.upc());
    });
  });

  describe('product supply chain', () => {

    describe('SUCCESS', () => {

      before(async () => {
        await standardRegisterUserHub.registerUser("Farmer1", 1, { from: farmer });
        await standardRegisterUserHub.registerUser("Investor1", 2, { from: investor });
        await standardRegisterUserHub.registerUser("Customer1", 3, { from: customer });
      });

      it('publish product campaign', async () => {
        await structStorage.produce(web3.utils.asciiToHex("Barley"),
          web3.utils.numberToHex(10),
          web3.utils.numberToHex(101),
          web3.utils.numberToHex(55), { from: farmer });

        const retValArray = await structStorage.getproduce(1);
        const cropName = web3.utils.hexToAscii(retValArray[1]).replace(/[^A-Za-z0-9]/g, '');
        upc = retValArray[0];
        assert.equal(cropName, "Barley");
        upc.should.be.bignumber.equal(new BN(1, 10));
      });

      it('Invest in product campaign', async () => {
        let farmerBalanceBefore = await structStorage.getBalance(farmer);
        let investorBalanceBefore = await structStorage.getBalance(investor);
        upc = 1;
        const retValArray = await structStorage.getproduce(upc);
        const reqFunding = retValArray[4];

        let retVal = await structStorage.fundProduct(farmer,
          3,//Investor role
          upc, { from: investor, to: farmer, value: reqFunding });
        let currentSCStage = await structStorage.getSupplychainStage(upc, { from: investor });
        farmerBalanceBefore.should.be.bignumber.that.is.lessThan(new BN(await structStorage.getBalance(farmer),10));
        investorBalanceBefore.should.be.bignumber.that.is.greaterThan(new BN(await structStorage.getBalance(investor),10));
        currentSCStage.should.be.bignumber.equal(new BN(2, 10));
        
      });

    });
  });

});
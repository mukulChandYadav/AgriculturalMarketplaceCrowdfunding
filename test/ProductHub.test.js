const ProductHub = artifacts.require('./ProductHub.sol');
const SupplychainHub = artifacts.require('./SupplychainHub.sol');
const StandardRegisterUserHub = artifacts.require('./StandardRegisterUserHub.sol');

const BN = require('bn.js');
const { assert } = require('chai');

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bn')(BN))//// Enable and inject BN dependency https://www.chaijs.com/plugins/chai-bn/
  .should();



contract('ProductHub', (accounts) => {
  let productHub, supplychainHub, standardRegisterUserHub, marketPlaceManager, farmer1, investor1, investor2, donor1, donor2, spotMarketConsumer1, forwardMarketConsumer1, upc;

  before(async () => {
    standardRegisterUserHub = await StandardRegisterUserHub.new();
    supplychainHub = await SupplychainHub.new();
    productHub = await ProductHub.new(supplychainHub.address, standardRegisterUserHub.address);
    marketPlaceManager = accounts[0];
    farmer1 = accounts[1];
    investor1 = accounts[3];
    investor2 = accounts[4];
    spotMarketConsumer1 = accounts[5];
    donor1 = accounts[7];
    donor2 = accounts[8];
    forwardMarketConsumer1 = accounts[9];
  });

  describe('creation', () => {
    it('deploys successfully', async () => {
      assert.notEqual(productHub.address, 0x0);
      assert.notEqual(productHub.address, '');
      assert.notEqual(productHub.address, null);
      assert.notEqual(productHub.address, undefined);
    });

    it('verify upc function', async () => {
      const scUPC = await supplychainHub.upc();
      scUPC.should.be.bignumber.equal(await productHub.upc());
    });
  });

  describe('product supply chain', () => {

    describe('SUCCESS', () => {

      before(async () => {
        await standardRegisterUserHub.registerUser("Farmer1", 1, { from: farmer1 });
        await standardRegisterUserHub.registerUser("Investor1", 3, { from: investor1 });

        await standardRegisterUserHub.registerUser("Investor2", 3, { from: investor2 });
        await standardRegisterUserHub.registerUser("Donor1", 2, { from: donor1 });
        await standardRegisterUserHub.registerUser("Donor2", 2, { from: donor2 });
        await standardRegisterUserHub.registerUser("SpotMarketConsumer1", 5, { from: spotMarketConsumer1 });
      });

      it('publish product campaign', async () => {
        await productHub.produce(web3.utils.asciiToHex("Barley"),
          web3.utils.numberToHex(10),
          web3.utils.numberToHex(101),
          web3.utils.numberToHex(55), { from: farmer1 });

        const retValArray = await productHub.getproduce(1);
        const cropName = web3.utils.hexToAscii(retValArray[1]).replace(/[^A-Za-z0-9]/g, '');
        upc = retValArray[0];
        assert.equal(cropName, "Barley");
        upc.should.be.bignumber.equal(new BN(1, 10));
      });

      it('Invest in product campaign', async () => {
        let farmerBalanceBefore = await productHub.getBalance(farmer1);
        let investorBalanceBefore = await productHub.getBalance(investor1);
        upc = 1;
        const retValArray = await productHub.getproduce(upc);
        const reqFunding = retValArray[4];
        let investments = [reqFunding.toNumber() - 21, 11, 10];
        //First round of investment by Investor1
        let retVal = await productHub.fundProduct(farmer1,
          3,//Investor role
          upc, { from: investor1, to: farmer1, value: investments[0] - 1 });
        // Second round of investment by Investor1
        let retVal1 = await productHub.fundProduct(farmer1,
          3,//Investor role
          upc, { from: investor1, to: farmer1, value: 1 });
        //First round of investment by Investor2
        let retVal2 = await productHub.fundProduct(farmer1,
          3,//Investor role
          upc, { from: investor2, to: farmer1, value: investments[1] });

        //First round of investment by Investor3
        let retVal3 = await productHub.fundProduct(farmer1,
          2,//Investor role
          upc, { from: donor1, to: farmer1, value: investments[2] });

        let numInvestors = new BN(await productHub.getNumberOfInvestorsForAProduct(upc, { from: investor2 }), 10).toNumber();
        //console.log('numInvestors',numInvestors);
        assert(numInvestors == 2);
        let investors = [];
        for (var i = 0; i < numInvestors; ++i) {
          investors[i] = await productHub.getContributorFromListForAProduct(upc, i, { from: investor2 });
          //console.log(new BN(await productHub.getPayoutAmountForContributorToAProduct(upc, investors[i], { from: investors[i] }), 10).toNumber());
          assert(new BN(await productHub.getPayoutAmountForContributorToAProduct(upc, investors[i], { from: investors[i] }), 10).toNumber() === investments[i]);
        }
        //console.log('Investors',investors);

        // Verify Funded product supplychain stage
        let currentSCStage = await productHub.getSupplychainStage(upc, { from: investor1 });
        currentSCStage.should.be.bignumber.equal(new BN(2, 10));

        //Verify transfer of ether from investor to farmer
        farmerBalanceBefore.should.be.bignumber.that.is.lessThan(new BN(await productHub.getBalance(farmer1), 10));
        investorBalanceBefore.should.be.bignumber.that.is.greaterThan(new BN(await productHub.getBalance(investor1), 10));
      });


      it('Harvest funded product', async () => {

        const supplychainHubOwnerAddress = await supplychainHub.getOwner(); // Same as deployer/creator account

        let farmerBalanceBefore = await productHub.getBalance(farmer1);
        let supplychainHubOwnerBalanceBefore = await productHub.getBalance(supplychainHubOwnerAddress);
        upc = 1;

        const retValArrayBefore = await productHub.getproduce(upc);

        let retVal = await productHub.harvestProduct(upc, { from: farmer1, to: supplychainHubOwnerAddress, value: retValArrayBefore[5] });
        //TODO: why assert.equal(retVal, true); fails, returns transaction receipt

        // Verify harvested product supplychain stage
        let currentSCStage = await productHub.getSupplychainStage(upc, { from: farmer1 });
        currentSCStage.should.be.bignumber.equal(new BN(3, 10));

        // Transfering ownership only when put for sale, next stage
        // Verify transfer of ownership to supplychain marketplace
        // const retValArrayAfter = await structStorage.getproduce(upc);

        //const newOwner = retValArrayAfter[6];
        //assert.isNotTrue(newOwner === farmer); 
        //assert.equal(newOwner, supplychainHubOwnerAddress);


        //Verify transfer of ether from farmer to supplychainHubOwner, transfer of debt
        farmerBalanceBefore.should.be.bignumber.that.is.greaterThan(new BN(await productHub.getBalance(farmer1), 10));
        supplychainHubOwnerBalanceBefore.should.be.bignumber.that.is.lessThan(new BN(await productHub.getBalance(investor1), 10));
      });

      it('Put harvested product on sale', async () => {

        const supplychainHubOwnerAddress = await supplychainHub.getOwner(); // Same as deployer/creator account

        let farmerBalanceBefore = await productHub.getBalance(farmer1);
        let supplychainHubOwnerBalanceBefore = await productHub.getBalance(supplychainHubOwnerAddress);
        upc = 1;

        const retValArrayBefore = await productHub.getproduce(upc);

        // Pay farmer expected price, and settle debts to investors from marketplace account
        let retVal = await productHub.markProductForSale(upc, { from: supplychainHubOwnerAddress, to: farmer1, value: retValArrayBefore[3] });
        //TODO: why assert.equal(retVal, true); fails, returns transaction receipt

        // Verify harvested product supplychain stage
        let currentSCStage = await productHub.getSupplychainStage(upc, { from: supplychainHubOwnerAddress });
        currentSCStage.should.be.bignumber.equal(new BN(4, 10));

        // Verify transfer of ownership to supplychain marketplace
        const retValArrayAfter = await productHub.getproduce(upc);
        const newOwner = retValArrayAfter[6];
        assert.isNotTrue(newOwner === farmer1);
        assert.equal(newOwner, supplychainHubOwnerAddress);


        //Verify transfer of ether to farmer(previous owner) from supplychainHubOwner(new owner)
        farmerBalanceBefore.should.be.bignumber.that.is.lessThan(new BN(await productHub.getBalance(farmer1), 10));
        supplychainHubOwnerBalanceBefore.should.be.bignumber.that.is.greaterThan(new BN(await productHub.getBalance(supplychainHubOwnerAddress), 10));
      });

      it('Sale product to end customer', async () => {

        const supplychainHubOwnerAddress = await supplychainHub.getOwner(); // Same as deployer/creator account

        let customerBalanceBefore = await productHub.getBalance(spotMarketConsumer1);
        let supplychainHubOwnerBalanceBefore = await productHub.getBalance(supplychainHubOwnerAddress);
        upc = 1;

        const retValArrayBefore = await productHub.getproduce(upc);

        // Pay farmer expected price, and settle debts to investors from marketplace account
        let retVal = await productHub.saleToCustomer(upc, { from: spotMarketConsumer1, to: supplychainHubOwnerAddress, value: retValArrayBefore[3] });
        //TODO: why assert.equal(retVal, true); fails, returns transaction receipt
        //assert.equal(retVal, true);

        // Verify sold product supplychain stage
        let currentSCStage = await productHub.getSupplychainStage(upc, { from: spotMarketConsumer1 });
        currentSCStage.should.be.bignumber.equal(new BN(5, 10));

        // Verify transfer of ownership to supplychain marketplace
        const retValArrayAfter = await productHub.getproduce(upc);
        const newOwner = retValArrayAfter[6];
        assert.equal(newOwner, spotMarketConsumer1);

        //Verify transfer of ether to farmer(previous owner) from supplychainHubOwner(new owner)
        customerBalanceBefore.should.be.bignumber.that.is.greaterThan(new BN(await productHub.getBalance(spotMarketConsumer1), 10));
        supplychainHubOwnerBalanceBefore.should.be.bignumber.that.is.lessThan(new BN(await productHub.getBalance(investor1), 10));
      });

      it('Payout to investors', async () => {

        const supplychainHubOwnerAddress = await supplychainHub.getOwner(); // Same as deployer/creator account

        // Verify sold product supplychain stage
        let currentSCStage = await productHub.getSupplychainStage(upc, { from: supplychainHubOwnerAddress });
        currentSCStage.should.be.bignumber.equal(new BN(5, 10));


        // Get balance amount to be paid to an investor for a product
        upc = 1;
        let numInvestors = new BN(await productHub.getNumberOfInvestorsForAProduct(upc, { from: investor2 }), 10).toNumber();
        //console.log('numInvestors',numInvestors);

        for (var i = 0; i < numInvestors; ++i) {
          let productContributor = await productHub.getContributorFromListForAProduct(upc, i, { from: investor2 });

          //console.log(new BN(await productHub.getPayoutAmountForContributorToAProduct(upc, productContributor, { from: productContributor }), 10).toNumber());


          let supplychainHubOwnerBalanceBefore = await productHub.getBalance(supplychainHubOwnerAddress);
          let contributorBalanceBefore = await productHub.getBalance(productContributor);


          let payoutBalanceAmount = new BN(await productHub.getPayoutAmountForContributorToAProduct(upc, productContributor));
          // Send payment to contributor
          let retVal = await productHub.sendMarketplacePayoutToInvestor(upc, productContributor, { from: supplychainHubOwnerAddress, to: productContributor, value: payoutBalanceAmount.toNumber() });

          // Verify payment made
          contributorBalanceBefore.should.be.bignumber.that.is.lessThan(new BN(await productHub.getBalance(productContributor), 10));
          supplychainHubOwnerBalanceBefore.should.be.bignumber.that.is.greaterThan(new BN(await productHub.getBalance(supplychainHubOwnerAddress), 10));
        }

      });

    });
  });

});
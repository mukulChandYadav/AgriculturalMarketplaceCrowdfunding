// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.8.0;
//pragma experimental ABIEncoderV2;

//pragma solidity ^0.5.0;
import "./base/Ownable.sol";
import "./SupplychainHub.sol";
import "./registration/StandardRegisterUserHub.sol";

// Controller contract for product interaction & workflow
contract ProductHub is Ownable {
    SupplychainHub supplychainProductStateContract;
    StandardRegisterUserHub standardRegisterUserHubContract;

    struct product {
        uint256 universalProductCode;
        bytes32 cropName;
        uint256 quantity;
        uint256 expectedPrice;
        uint256 requiredFunding;
        uint256 availableFunding;
        address payable ownerAccount;
    }

    mapping(uint256 => product) productIdToProductMapping;

    constructor(
        SupplychainHub _supplychainProductStateContract,
        StandardRegisterUserHub _standardRegisterUserHubContract
    ) public Ownable() {
        supplychainProductStateContract = _supplychainProductStateContract;
        standardRegisterUserHubContract = _standardRegisterUserHubContract;
        require(
            _standardRegisterUserHubContract.registerUserInternal(
                "Crowdfunded Agriculture Marketplace Manager",
                6, //StandardRegisterUserHub.UserRoleType.MarketplaceManager
                msg.sender // Sent as argument as it gets overridden by this contract address in upper call stack
            ),
            "Failed to register deploying account in Marketplace manager role"
        );
    }

    /**
     * Get universal product code counter
     * Used to list all products
     *
     */
    function upc() public view returns (uint256) {
        return supplychainProductStateContract.upc();
    }

    /**
     * Get supply chain state of a product by productID
     *
     */
    function getSupplychainStage(uint256 _upc) public view returns (uint256) {
        return
            uint256(supplychainProductStateContract.getSupplychainStatus(_upc));
    }

    /**
     * Modifier for funder(Investor/Donor) user verification
     *
     */
    modifier isFunder(uint8 _userRoleType) {
        require(_userRoleType == 2 || _userRoleType == 3);
        _;
    }

    /**
     * Fund product identified by productID,
     * for userRoleType & receiver address - receives the fund
     */
    function fundProduct(
        address payable receiver,
        uint8 userRoleType,
        uint8 _universalProductCode
    ) public payable isFunder(userRoleType) returns (bool) {
        require(msg.sender.balance >= msg.value);
        product storage p = productIdToProductMapping[_universalProductCode];
        uint256 amount = msg.value;
        if (p.requiredFunding <= amount) {
            //Required funding
            amount = p.requiredFunding;
        }
        p.requiredFunding -= amount; //Required funding
        p.availableFunding += amount; //Available funding
        require(receiver.send(amount));
        if (amount < msg.value) {
            require(msg.sender.send(msg.value - amount));
        }
        if (userRoleType == 3) {
            // 3 - Investor user role index
            //Investor needs to be paid back when item is put on sale
            require(
                supplychainProductStateContract.acceptFundsFromSender(
                    _universalProductCode,
                    msg.sender,
                    amount
                )
            );
        }
        if (p.requiredFunding == 0) {
            require(
                supplychainProductStateContract.updateSupplychainStatus(
                    p.universalProductCode,
                    SupplychainHub.SupplychainStage.ProductFunded
                )
            );
        }
        return true;
    }

    /**
     * Move product identified by product code to harvest state
     *
     */
    function harvestProduct(uint256 _upc) public payable returns (bool) {
        require(
            supplychainProductStateContract.getSupplychainStatus(_upc) ==
                SupplychainHub.SupplychainStage.ProductFunded
        );

        product storage p = productIdToProductMapping[_upc];
        // Transfer obtained funds to market place to perform settlement later
        address payable marketplaceOwner = supplychainProductStateContract
            .getOwner();

        // Ensure sent value is more than available funding
        // TODO: Implement payment channel contract between parties
        require(msg.value >= p.availableFunding);

        // Transfer crowd funded amount to market owner
        require(marketplaceOwner.send(p.availableFunding));
        //Return change to sender
        require(msg.sender.send(msg.value - p.availableFunding));

        require(
            supplychainProductStateContract.updateSupplychainStatus(
                _upc,
                SupplychainHub.SupplychainStage.Harvested
            )
        );

        return true;
    }

    /**
     * Move product to market place and pay out investors
     * Supplychain hub makes the purchase
     * Read: https://docs.soliditylang.org/en/v0.6.0/common-patterns.html?highlight=transfer#withdrawal-from-contracts
     */
    function markProductForSale(uint256 _upc) public payable returns (bool) {
        require(
            supplychainProductStateContract.getSupplychainStatus(_upc) ==
                SupplychainHub.SupplychainStage.Harvested
        );
        product storage p = productIdToProductMapping[_upc];

        // Sell to Supply chain hub
        address payable marketplaceOwner = supplychainProductStateContract
            .getOwner();

        require(msg.sender == marketplaceOwner); // Supplychain hub makes owner transfer & pays farmer expected price
        require(msg.value >= p.expectedPrice);

        // Farmers(owner) receive expected price
        address payable seller = p.ownerAccount;
        require(seller.send(p.expectedPrice));

        //Change ownership to market place
        p.ownerAccount = marketplaceOwner;

        require(
            supplychainProductStateContract.updateSupplychainStatus(
                _upc,
                SupplychainHub.SupplychainStage.OnSale
            )
        );
        return true;
    }

    /**
     *  Receive Payout from Marketplace by investor
     *
     */
    function sendMarketplacePayoutToInvestor(
        uint256 _upc,
        address payable investor
    ) public payable returns (bool) {
        uint256 payoutAmount = supplychainProductStateContract
            .getPayoutAmountForContributor(_upc, investor);
        require(
            msg.value >= payoutAmount,
            "Sent amount less than total payout amount"
        );
        require(investor.send(payoutAmount));
        require(
            supplychainProductStateContract.markFundsReleasedToContributor(
                _upc,
                investor
            )
        );
        return true;
    }

    /**
     * Move product to market place and pay out investors
     * Supplychain hub makes the purchase
     */
    function saleToCustomer(uint256 _upc) public payable returns (bool) {
        require(
            supplychainProductStateContract.getSupplychainStatus(_upc) ==
                SupplychainHub.SupplychainStage.OnSale
        );

        product storage p = productIdToProductMapping[_upc];
        require(msg.value >= p.expectedPrice);
        // Supply chain hub paid
        address payable marketOwner = p.ownerAccount;
        require(marketOwner.send(msg.value));
        //TransferOwnership
        p.ownerAccount = msg.sender;
        require(p.ownerAccount == msg.sender);
        require(
            supplychainProductStateContract.updateSupplychainStatus(
                _upc,
                SupplychainHub.SupplychainStage.Sold
            )
        );
        return true;
    }

    /**
     * Get balance amount of user address
     *
     */
    function getBalance(address addr) public view returns (uint256) {
        return addr.balance; //balances[addr];
    }

    /**
     * Publish a product campaign onto portal
     *
     */
    function produce(
        bytes32 cropName,
        uint256 quantity,
        uint256 expectedPrice,
        uint256 requiredFunding
    ) public returns (bool) {
        uint256 currentUPC = supplychainProductStateContract.upc();
        ProductHub.product memory fnew = product(
            currentUPC,
            cropName,
            quantity,
            expectedPrice,
            requiredFunding,
            0,
            msg.sender
        );
        productIdToProductMapping[currentUPC] = fnew;
        require(supplychainProductStateContract.incrementProductCodeCounter());
        supplychainProductStateContract.updateSupplychainStatus(
            currentUPC,
            SupplychainHub.SupplychainStage.ProductPublished
        );
        return true;
    }

    /**
     * Get product details by productID
     *
     */
    function getproduce(uint256 universalProductCode)
        public
        view
        returns (
            uint256,
            bytes32,
            uint256,
            uint256,
            uint256,
            uint256,
            address
        )
    {
        return (
            productIdToProductMapping[universalProductCode]
                .universalProductCode,
            productIdToProductMapping[universalProductCode].cropName,
            productIdToProductMapping[universalProductCode].quantity,
            productIdToProductMapping[universalProductCode].expectedPrice,
            productIdToProductMapping[universalProductCode].requiredFunding,
            productIdToProductMapping[universalProductCode].availableFunding,
            productIdToProductMapping[universalProductCode].ownerAccount
        );
    }

    /**
     * Get payout amount for given contributor to given product
     *
     */
    function getPayoutAmountForContributorToAProduct(
        uint256 _upc,
        address payable contributor
    ) external view returns (uint256) {
        require(_upc > 0);
        require(contributor != address(0));
        return
            supplychainProductStateContract.getPayoutAmountForContributor(
                _upc,
                contributor
            );
    }

    /**
     * Get list of contributors for given product
     *
     */
    function getContributorListForAProduct(uint256 _upc)
        external
        view
        returns (address[] memory)
    {
        require(_upc > 0);
        return supplychainProductStateContract.getListOfPayblesForProduct(_upc);
    }
    // event Received(address, uint256);

    // receive() external payable {
    //     emit Received(msg.sender, msg.value);
    // }

    // // Investors paid out by market place,i.e. current owner of product
    // address[] memory investors = supplychainProductStateContract
    //     .getListOfPayblesForProduct(_upc);
    // for (uint8 i = 0; i < investors.length; ++i) {
    //     uint256 amount = supplychainProductStateContract
    //         .getPaybleOwedAmountForProduct(_upc, investors[i]);
    //     //require((payable(investors[i])).send(amount));
    //     require(
    //         supplychainProductStateContract.markFundsReleasedToContributor(
    //             _upc,
    //             payable(investors[i])
    //         )
    //     );
    // }
}

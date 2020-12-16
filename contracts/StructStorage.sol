// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.8.0;
//pragma experimental ABIEncoderV2;

//pragma solidity ^0.5.0;
import "./SupplychainHub.sol";
import "./base/Ownable.sol";

// Controller contract for product interaction & workflow
contract StructStorage is Ownable {
    SupplychainHub supplychainProductStateContract;

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

    constructor(SupplychainHub _supplychainProductStateContract) public {
        supplychainProductStateContract = _supplychainProductStateContract;
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

        product memory p = productIdToProductMapping[_upc];
        // Sell to Supply chain hub
        address payable buyer = supplychainProductStateContract.getOwner();
        //Change ownership to market place
        p.ownerAccount = buyer;

        // Transfer crowd funded amount to market owner
        require(buyer.send(p.availableFunding));

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
     */
    function markProductForSale(uint256 _upc) public payable returns (bool) {
        require(
            supplychainProductStateContract.getSupplychainStatus(_upc) ==
                SupplychainHub.SupplychainStage.Harvested
        );
        product memory p = productIdToProductMapping[_upc];

        // Sell to Supply chain hub
        address payable buyer = supplychainProductStateContract.getOwner();
        require(msg.sender == buyer); // Supplychain hub makes the purchase
        // Farmers(owner) receive expected price
        address payable seller = p.ownerAccount;
        require(seller.send(p.expectedPrice));

        // Investors paid out by market place,i.e. current owner of product
        address[] memory investors = supplychainProductStateContract
            .getListOfPayblesForProduct(_upc);
        for (uint8 i = 0; i < investors.length; ++i) {
            uint256 amount = supplychainProductStateContract
                .getPaybleOwedAmountForProduct(_upc, investors[i]);
            require(payable(investors[i]).send(amount));
            require(
                supplychainProductStateContract.markFundsReleasedToContributor(
                    _upc,
                    payable(investors[i])
                )
            );
        }

        require(
            supplychainProductStateContract.updateSupplychainStatus(
                _upc,
                SupplychainHub.SupplychainStage.OnSale
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

        product memory p = productIdToProductMapping[_upc];
        require(msg.value > p.expectedPrice);
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
        StructStorage.product memory fnew = product(
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
}

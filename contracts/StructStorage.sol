// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.8.0;
pragma experimental ABIEncoderV2;

//pragma solidity ^0.5.0;

contract StructStorage {
    //uint256 public s = 1;
    uint256 public upc;
    //uint256 public t = 1;
    mapping(address => uint256) balances;

    struct farmer {
        uint256 universalProductCode;
        bytes32 cropName;
        uint256 quantity;
        uint256 expectedPrice;
        uint256 requiredFunding;
        uint256 availableFunding;
        address ownerAccount;
    }

    // struct lot {
    //     bytes lotno;
    //     bytes grade;
    //     uint256 mrp;
    //     bytes32 testdate;
    //     bytes32 expdate;
    // }

    //address public tester;
    address owner;

    mapping(uint256 => farmer) farmerIdToProductMapping;

    //farmer[] public farmerProducts;

    // mapping(bytes => lot) l1;
    // lot[] public l;

    constructor() public {
        upc = 1;
    }

    function fundaddr(address addr) public {
        balances[addr] = 2000;
    }

    function sendCoin(
        address receiver,
        uint256 amount,
        address sender
    ) public returns (bool sufficient) {
        if (balances[sender] < amount) return false;

        balances[sender] -= amount;
        balances[receiver] += amount;

        return true;
    }

    function fundProduct(
        address receiver,
        uint256 amount,
        address sender,
        uint256 universalProductCode
    ) public returns (bool) {
        farmer storage f = farmerIdToProductMapping[universalProductCode];
        if (f.requiredFunding <= amount) {
            amount = f.requiredFunding;
        }
        f.requiredFunding -= amount;
        f.availableFunding += amount;
        require(sendCoin(receiver, amount, sender));
        return true;
    }

    function getBalance(address addr) public view returns (uint256) {
        return balances[addr];
    }

    function produce(
        bytes32 cropName,
        uint256 quantity,
        uint256 expectedPrice,
        uint256 requiredFunding
    ) public returns (bool) {
        StructStorage.farmer memory fnew = farmer(
            upc,
            cropName,
            quantity,
            expectedPrice,
            requiredFunding,
            0,
            msg.sender
        );
        farmerIdToProductMapping[upc] = fnew;
        //farmerProducts.push(fnew);

        upc += 1;
        return true;
    }

    // function getProductIDCounterInclusive() public view returns (uint256) {
    //     return upc;
    // }

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
            farmerIdToProductMapping[universalProductCode].universalProductCode,
            farmerIdToProductMapping[universalProductCode].cropName,
            farmerIdToProductMapping[universalProductCode].quantity,
            farmerIdToProductMapping[universalProductCode].expectedPrice,
            farmerIdToProductMapping[universalProductCode].requiredFunding,
            farmerIdToProductMapping[universalProductCode].availableFunding,
            farmerIdToProductMapping[universalProductCode].ownerAccount
        );
    }

    // function quality(
    //     bytes memory ll,
    //     bytes memory g,
    //     uint256 p,
    //     bytes32 tt,
    //     bytes32 e
    // ) public {
    //     StructStorage.lot memory lnew = lot(ll, g, p, tt, e);
    //     l1[ll] = lnew;
    //     l.push(lnew);
    //     t++;
    // }

    // function getquality(bytes memory k)
    //     public
    //     view
    //     returns (
    //         bytes memory,
    //         bytes memory,
    //         uint256,
    //         bytes32,
    //         bytes32
    //     )
    // {
    //     return (
    //         l1[k].lotno,
    //         l1[k].grade,
    //         l1[k].mrp,
    //         l1[k].testdate,
    //         l1[k].expdate
    //     );
    // }
}

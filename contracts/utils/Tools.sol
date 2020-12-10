// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.8.0;
// Common library for optimized common utility
library Tools {
    function append(
        string memory a,
        string memory b,
        string memory c,
        string memory d,
        string memory e
    ) internal pure returns (string memory ) {
        return string(abi.encodePacked(a, b, c, d, e));
    }
}

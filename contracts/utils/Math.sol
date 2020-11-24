// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.8.0;


library Math {

    function safeToAdd(uint a, uint b)
        public
        pure
        returns (bool)
    {
        return a + b >= a;
    }

    function safeToSub(uint a, uint b)
        public
        pure
        returns (bool)
    {
        return a >= b;
    }

    function safeToMul(uint a, uint b)
        public
        pure
        returns (bool)
    {
        return b == 0 || a * b / b == a;
    }

    function add(uint a, uint b)
        public
        pure
        returns (uint)
    {
        require(safeToAdd(a, b));
        return a + b;
    }

    function sub(uint a, uint b)
        public
        pure
        returns (uint)
    {
        require(safeToSub(a, b));
        return a - b;
    }

    function mul(uint a, uint b)
        public
        pure
        returns (uint)
    {
        require(safeToMul(a, b));
        return a * b;
    }

    function safeToAdd(int a, int b)
        public
        pure
        returns (bool)
    {
        return (b >= 0 && a + b >= a) || (b < 0 && a + b < a);
    }

    function safeToSub(int a, int b)
        public
        pure
        returns (bool)
    {
        return (b >= 0 && a - b <= a) || (b < 0 && a - b > a);
    }

    function safeToMul(int a, int b)
        public
        pure
        returns (bool)
    {
        return (b == 0) || (a * b / b == a);
    }

    function add(int a, int b)
        public
        pure
        returns (int)
    {
        require(safeToAdd(a, b));
        return a + b;
    }

    function sub(int a, int b)
        public
        pure
        returns (int)
    {
        require(safeToSub(a, b));
        return a - b;
    }

    function mul(int a, int b)
        public
        pure
        returns (int)
    {
        require(safeToMul(a, b));
        return a * b;
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract AdapterAaveMock {
    uint256 public totalSupplied;

    function supply(uint256 amount) external {
        totalSupplied += amount;
    }

    function redeem(uint256 amount) external {
        require(totalSupplied >= amount, "Insufficient liquidity");
        totalSupplied -= amount;
    }
}

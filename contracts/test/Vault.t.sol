// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test} from "forge-std/Test.sol";
import {MockUSDC} from "../src/MockUSDC.sol";
import {SynthVault} from "../src/SynthVault.sol";

contract VaultTest is Test {
    MockUSDC private usdc;
    SynthVault private vault;
    address private depositor = address(0x123);

    function setUp() public {
        usdc = new MockUSDC();
        vault = new SynthVault(usdc, 1_000_000 ether);
        usdc.faucet(depositor, 1_000 ether);
        vm.prank(depositor);
        usdc.approve(address(vault), type(uint256).max);
    }

    function testDepositAndWithdraw() public {
        vm.prank(depositor);
        vault.deposit(100 ether, depositor);
        assertEq(vault.balanceOf(depositor), 100 ether);

        vm.prank(depositor);
        vault.withdraw(50 ether, depositor, depositor);
        assertEq(vault.balanceOf(depositor), 50 ether);
    }

    function testDepositCap() public {
        vault.setDepositCap(60 ether);
        vm.prank(depositor);
        vault.deposit(60 ether, depositor);
        vm.expectRevert("Cap exceeded");
        vm.prank(depositor);
        vault.deposit(1 ether, depositor);
    }

    function testPause() public {
        vault.pause();
        vm.expectRevert();
        vm.prank(depositor);
        vault.deposit(10 ether, depositor);
    }
}

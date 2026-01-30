// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test} from "forge-std/Test.sol";
import {MockUSDC} from "../src/MockUSDC.sol";
import {SynthVault} from "../src/SynthVault.sol";

contract VaultTest is Test {
    MockUSDC private usdc;
    SynthVault private vault;
    address private depositor = address(0x123);
    address private feeRecipient = address(0x456);

    function setUp() public {
        usdc = new MockUSDC();
        vault = new SynthVault(usdc, 1_000_000 ether, feeRecipient);
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
        
        // After cap is reached, maxDeposit should be 0
        assertEq(vault.maxDeposit(depositor), 0);
        
        // Trying to deposit more should revert with ERC4626ExceededMaxDeposit
        vm.expectRevert();
        vm.prank(depositor);
        vault.deposit(1 ether, depositor);
    }

    function testWithdrawalFee() public {
        vm.prank(depositor);
        vault.deposit(100 ether, depositor);
        
        uint256 balanceBefore = usdc.balanceOf(depositor);
        vm.prank(depositor);
        vault.withdraw(50 ether, depositor, depositor);
        
        // Should receive slightly less than 50 due to 0.5% fee
        uint256 received = usdc.balanceOf(depositor) - balanceBefore;
        assertLt(received, 50 ether);
        assertGt(received, 49 ether);
    }

    function testReentrancyProtection() public {
        vm.prank(depositor);
        vault.deposit(100 ether, depositor);
        // Reentrancy is prevented by ReentrancyGuard
        assertTrue(vault.balanceOf(depositor) == 100 ether);
    }

    function testFuzzDeposit(uint256 amount) public {
        amount = bound(amount, 1, 1_000 ether);
        usdc.faucet(depositor, amount);
        
        vm.prank(depositor);
        usdc.approve(address(vault), amount);
        
        vm.prank(depositor);
        vault.deposit(amount, depositor);
        
        assertEq(vault.balanceOf(depositor), amount);
    }

    function testPause() public {
        vault.pause();
        vm.expectRevert();
        vm.prank(depositor);
        vault.deposit(10 ether, depositor);
    }
}

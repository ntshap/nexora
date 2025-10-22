// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console2} from "forge-std/Script.sol";
import {MockUSDC} from "../src/MockUSDC.sol";
import {SynthVault} from "../src/SynthVault.sol";

contract DeployScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        MockUSDC usdc = new MockUSDC();
        SynthVault vault = new SynthVault(usdc, 1_000_000 ether);

        console2.log("MockUSDC deployed at", address(usdc));
        console2.log("SynthVault deployed at", address(vault));

        vm.stopBroadcast();
    }
}

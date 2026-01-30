// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console2} from "forge-std/Script.sol";
import {MockUSDC} from "../src/MockUSDC.sol";
import {SynthVault} from "../src/SynthVault.sol";

contract DeployScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);
        
        vm.startBroadcast(deployerPrivateKey);

        MockUSDC usdc = new MockUSDC();
        console2.log("MockUSDC deployed at", address(usdc));
        
        // Deploy vault with deployer as fee recipient
        SynthVault vault = new SynthVault(usdc, 1_000_000 ether, deployer);
        console2.log("SynthVault deployed at", address(vault));
        console2.log("Fee recipient set to", deployer);
        
        // Verify deployment
        console2.log("Deposit cap:", vault.depositCap());
        console2.log("Vault owner:", vault.owner());

        vm.stopBroadcast();
        
        // Write deployment info to file
        string memory deploymentInfo = string(abi.encodePacked(
            "{\n",
            '  "usdc": "', vm.toString(address(usdc)), '",\n',
            '  "vault": "', vm.toString(address(vault)), '",\n',
            '  "deployer": "', vm.toString(deployer), '"\n',
            "}"
        ));
        
        vm.writeFile("./deployment.json", deploymentInfo);
        console2.log("Deployment info written to deployment.json");
    }
}

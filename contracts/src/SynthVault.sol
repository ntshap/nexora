// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC4626} from "@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract SynthVault is ERC4626, Pausable, Ownable {
    uint256 public depositCap;

    constructor(ERC20 asset_, uint256 initialCap)
        ERC4626(asset_)
        ERC20("NEXORA Synth Vault", "nxSVLT")
        Ownable(msg.sender)
    {
        depositCap = initialCap;
    }

    function setDepositCap(uint256 newCap) external onlyOwner {
        depositCap = newCap;
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function _deposit(address caller, address receiver, uint256 assets, uint256 shares) internal override whenNotPaused {
        require(totalAssets() + assets <= depositCap, "Cap exceeded");
        super._deposit(caller, receiver, assets, shares);
    }

    function _withdraw(
        address caller,
        address receiver,
        address owner,
        uint256 assets,
        uint256 shares
    ) internal override whenNotPaused {
        super._withdraw(caller, receiver, owner, assets, shares);
    }
}

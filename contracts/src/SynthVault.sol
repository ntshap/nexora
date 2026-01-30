// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC4626} from "@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract SynthVault is ERC4626, Pausable, Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    uint256 public depositCap;
    uint256 public totalDeposited;
    
    uint256 private constant MAX_BPS = 10000;
    uint256 public performanceFeeBps = 1000; // 10%
    uint256 public withdrawalFeeBps = 50; // 0.5%
    address public feeRecipient;

    event DepositCapUpdated(uint256 oldCap, uint256 newCap);
    event FeesUpdated(uint256 performanceFee, uint256 withdrawalFee);
    event FeeRecipientUpdated(address oldRecipient, address newRecipient);
    event FeesCollected(address indexed recipient, uint256 amount);

    error ExceedsDepositCap();
    error InvalidFeeRecipient();
    error FeeTooHigh();
    error ZeroAmount();

    constructor(ERC20 asset_, uint256 initialCap, address _feeRecipient)
        ERC4626(asset_)
        ERC20("NEXORA Synth Vault", "nxSVLT")
        Ownable(msg.sender)
    {
        if (_feeRecipient == address(0)) revert InvalidFeeRecipient();
        depositCap = initialCap;
        feeRecipient = _feeRecipient;
        emit DepositCapUpdated(0, initialCap);
    }

    function setDepositCap(uint256 newCap) external onlyOwner {
        uint256 oldCap = depositCap;
        depositCap = newCap;
        emit DepositCapUpdated(oldCap, newCap);
    }

    function setFees(uint256 _performanceFeeBps, uint256 _withdrawalFeeBps) external onlyOwner {
        if (_performanceFeeBps > 2000) revert FeeTooHigh(); // Max 20%
        if (_withdrawalFeeBps > 500) revert FeeTooHigh(); // Max 5%
        performanceFeeBps = _performanceFeeBps;
        withdrawalFeeBps = _withdrawalFeeBps;
        emit FeesUpdated(_performanceFeeBps, _withdrawalFeeBps);
    }

    function setFeeRecipient(address _feeRecipient) external onlyOwner {
        if (_feeRecipient == address(0)) revert InvalidFeeRecipient();
        address oldRecipient = feeRecipient;
        feeRecipient = _feeRecipient;
        emit FeeRecipientUpdated(oldRecipient, _feeRecipient);
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function _deposit(address caller, address receiver, uint256 assets, uint256 shares) 
        internal 
        override 
        whenNotPaused 
        nonReentrant 
    {
        if (assets == 0) revert ZeroAmount();
        if (totalDeposited + assets > depositCap) revert ExceedsDepositCap();
        totalDeposited += assets;
        super._deposit(caller, receiver, assets, shares);
    }

    function _withdraw(
        address caller,
        address receiver,
        address owner,
        uint256 assets,
        uint256 shares
    ) internal override whenNotPaused nonReentrant {
        if (assets == 0) revert ZeroAmount();
        
        // Apply withdrawal fee
        uint256 fee = (assets * withdrawalFeeBps) / MAX_BPS;
        uint256 netAssets = assets - fee;
        
        totalDeposited -= assets;
        
        if (fee > 0) {
            IERC20(asset()).safeTransfer(feeRecipient, fee);
            emit FeesCollected(feeRecipient, fee);
        }
        
        super._withdraw(caller, receiver, owner, netAssets, shares);
    }

    function maxDeposit(address) public view virtual override returns (uint256) {
        if (paused()) return 0;
        uint256 remaining = depositCap > totalDeposited ? depositCap - totalDeposited : 0;
        return remaining;
    }

    function maxMint(address) public view virtual override returns (uint256) {
        if (paused()) return 0;
        uint256 maxAssets = maxDeposit(address(0));
        return convertToShares(maxAssets);
    }
}

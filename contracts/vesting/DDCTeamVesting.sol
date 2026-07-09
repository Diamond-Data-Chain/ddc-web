// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @notice Team: 24-month linear vesting, 0% at TGE (WP)
/// @dev Vesting start = max(tgeTimestamp, grantTimestamp)
contract DDCTeamVesting is Ownable {
    using SafeERC20 for IERC20;

    IERC20 public immutable ddc;
    address public immutable beneficiary;

    uint64 public tgeTimestamp;      // Network launch / TGE / listing anchor (set once)
    uint64 public immutable grantTimestamp; // Deployment/grant time anchor

    uint256 public immutable totalAllocation;
    uint256 public released;

    uint64 public constant VESTING_DURATION = uint64(30 days * 24); // 24 "months" = 30d

    event TGESet(uint64 tgeTimestamp);
    event Claimed(address indexed beneficiary, uint256 amount);

    constructor(
        address _ddc,
        address _beneficiary,
        uint256 _totalAllocation,
        uint64 _tgeTimestamp
    ) Ownable(msg.sender) {
        require(_ddc != address(0), "Zero DDC");
        require(_beneficiary != address(0), "Zero beneficiary");
        require(_totalAllocation > 0, "Zero allocation");

        ddc = IERC20(_ddc);
        beneficiary = _beneficiary;
        totalAllocation = _totalAllocation;

        grantTimestamp = uint64(block.timestamp);

        // allow _tgeTimestamp = 0 (set later once) OR set at deploy
        if (_tgeTimestamp != 0) {
            tgeTimestamp = _tgeTimestamp;
            emit TGESet(_tgeTimestamp);
        }
    }

    function setTGEOnce(uint64 _tgeTimestamp) external onlyOwner {
        require(tgeTimestamp == 0, "TGE already set");
        require(_tgeTimestamp != 0, "Zero TGE");
        tgeTimestamp = _tgeTimestamp;
        emit TGESet(_tgeTimestamp);
    }

    function vestingStart() public view returns (uint64) {
        uint64 tge = tgeTimestamp;
        require(tge != 0, "TGE not set");
        return tge > grantTimestamp ? tge : grantTimestamp;
    }

    function vestedAmount() public view returns (uint256) {
        uint64 start = vestingStart();
        if (block.timestamp <= start) return 0;

        uint256 elapsed = block.timestamp - start;
        if (elapsed >= VESTING_DURATION) return totalAllocation;

        return (totalAllocation * elapsed) / VESTING_DURATION;
    }

    function claimable() public view returns (uint256) {
        uint256 vested = vestedAmount();
        if (vested <= released) return 0;
        return vested - released;
    }

    function locked() external view returns (uint256) {
        uint256 vested = vestedAmount();
        if (vested >= totalAllocation) return 0;
        return totalAllocation - vested;
    }

    function claim() external {
        require(msg.sender == beneficiary, "Not beneficiary");
        uint256 amount = claimable();
        require(amount > 0, "Nothing to claim");

        released += amount;
        ddc.safeTransfer(beneficiary, amount);

        emit Claimed(beneficiary, amount);
    }
}

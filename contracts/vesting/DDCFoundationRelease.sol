// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @notice Foundation: 0% TGE, 6-month cliff, 30-month linear release (Addendum v1.0.2)
/// @dev Governance executor = owner() (multisig pre-DAO, later transferOwnership to DAO/executor)
contract DDCFoundationRelease is Ownable {
    using SafeERC20 for IERC20;

    IERC20 public immutable ddc;

    uint64 public tgeTimestamp;           // set once
    uint64 public immutable grantTimestamp;

    uint256 public immutable totalAllocation;
    uint256 public released;

    uint64 public constant CLIFF_DURATION   = uint64(30 days * 6);
    uint64 public constant VESTING_DURATION = uint64(30 days * 30);

    event TGESet(uint64 tgeTimestamp);
    event Released(address indexed to, uint256 amount);

    constructor(
        address _ddc,
        uint256 _totalAllocation,
        uint64 _tgeTimestamp
    ) Ownable(msg.sender) {
        require(_ddc != address(0), "Zero DDC");
        require(_totalAllocation > 0, "Zero allocation");

        ddc = IERC20(_ddc);
        totalAllocation = _totalAllocation;

        grantTimestamp = uint64(block.timestamp);

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

        // Cliff
        if (block.timestamp < start + CLIFF_DURATION) return 0;

        uint256 elapsed = block.timestamp - (start + CLIFF_DURATION);
        if (elapsed >= VESTING_DURATION) return totalAllocation;

        return (totalAllocation * elapsed) / VESTING_DURATION;
    }

    function releasable() public view returns (uint256) {
        uint256 vested = vestedAmount();
        if (vested <= released) return 0;
        return vested - released;
    }

    function locked() external view returns (uint256) {
        uint256 vested = vestedAmount();
        if (vested >= totalAllocation) return 0;
        return totalAllocation - vested;
    }

    /// @notice Governance-controlled release (owner() only)
    function release(address to, uint256 amount) external onlyOwner {
        require(to != address(0), "Zero to");
        uint256 avail = releasable();
        require(amount > 0, "Zero amount");
        require(amount <= avail, "Exceeds releasable");

        released += amount;
        ddc.safeTransfer(to, amount);

        emit Released(to, amount);
    }
}

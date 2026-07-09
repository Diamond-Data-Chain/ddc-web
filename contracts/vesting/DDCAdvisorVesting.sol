// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @notice Advisors: 0% TGE, 3-month cliff, 18-month linear vesting (Addendum v1.0.1)
/// @dev Vesting start = max(tgeTimestamp, grantTimestamp)
contract DDCAdvisorVesting is Ownable {
    using SafeERC20 for IERC20;

    IERC20 public immutable ddc;
    address public immutable beneficiary;

    uint64 public tgeTimestamp;           // set once
    uint64 public immutable grantTimestamp;

    uint256 public immutable totalAllocation;
    uint256 public released;

    uint64 public constant CLIFF_DURATION   = uint64(30 days * 3);
    uint64 public constant VESTING_DURATION = uint64(30 days * 18);

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

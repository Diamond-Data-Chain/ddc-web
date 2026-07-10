// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

interface IDDCPresaleFinalized {
    function finalized() external view returns (bool);
}

/// @notice Permissionless one-time Adamas USDT grant after presale finalization.
/// @dev TODO(WP): grant amount is a locked project decision,
///      but is not explicitly defined in the WP/Addendums.
contract DDCAdamasGrantVault is ReentrancyGuard {
    using SafeERC20 for IERC20;

    address public constant RECIPIENT =
        0x90aDD10eb8742CE37bFd2E66c733f9423D41c3fd;

    uint256 public constant GRANT_AMOUNT = 1_850_000 * 1e6;

    IERC20 public immutable usdt;
    IDDCPresaleFinalized public immutable presale;

    bool public released;

    event AdamasGrantReleased(
        address indexed recipient,
        uint256 amount,
        uint256 timestamp
    );

    error ZeroAddress();
    error PresaleNotFinalized();
    error GrantAlreadyReleased();
    error InsufficientUSDT(uint256 available, uint256 required);

    constructor(address usdt_, address presale_) {
        if (usdt_ == address(0) || presale_ == address(0)) {
            revert ZeroAddress();
        }

        usdt = IERC20(usdt_);
        presale = IDDCPresaleFinalized(presale_);
    }

    /// @notice Permissionless trigger after presale finalization.
    function release() external nonReentrant {
        if (released) revert GrantAlreadyReleased();
        if (!presale.finalized()) revert PresaleNotFinalized();

        uint256 balance = usdt.balanceOf(address(this));
        if (balance < GRANT_AMOUNT) {
            revert InsufficientUSDT(balance, GRANT_AMOUNT);
        }

        released = true;
        usdt.safeTransfer(RECIPIENT, GRANT_AMOUNT);

        emit AdamasGrantReleased(
            RECIPIENT,
            GRANT_AMOUNT,
            block.timestamp
        );
    }
}

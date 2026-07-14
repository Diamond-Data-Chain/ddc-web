// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

interface IDDCPresaleStart {
    function presaleStart() external view returns (uint64);
}

/// @notice Permissionless monthly USDT operations payout.
/// @dev TODO(WP): amount and 12-payment policy are locked project decisions,
///      but are not explicitly defined in the WP/Addendums.
contract DDCMonthlyOpsVault is ReentrancyGuard {
    using SafeERC20 for IERC20;

    address public constant RECIPIENT =
        0x9c6778909831FcBd7BC0935a6d68f15A4ABf7bAF;

    uint256 public immutable PAYMENT_AMOUNT;
    uint8 public immutable usdtDecimals;
    uint256 public constant PAYMENT_INTERVAL = 30 days;
    uint8 public constant MAX_PAYMENTS = 12;

    IERC20 public immutable usdt;
    IDDCPresaleStart public immutable presale;

    uint8 public paymentsReleased;

    event MonthlyPaymentReleased(
        uint8 indexed paymentNumber,
        address indexed recipient,
        uint256 amount,
        uint256 timestamp
    );

    error ZeroAddress();
    error PresaleNotStarted();
    error PaymentNotDue();
    error AllPaymentsReleased();
    error InsufficientUSDT(uint256 available, uint256 required);

    constructor(address usdt_, address presale_) {
        if (usdt_ == address(0) || presale_ == address(0)) {
            revert ZeroAddress();
        }

        uint8 detectedDecimals = IERC20Metadata(usdt_).decimals();
        if (detectedDecimals < 6 || detectedDecimals > 18) {
            revert ZeroAddress();
        }

        usdt = IERC20(usdt_);
        usdtDecimals = detectedDecimals;
        PAYMENT_AMOUNT = 168_000 * (10 ** uint256(detectedDecimals));
        presale = IDDCPresaleStart(presale_);
    }

    /// @notice Number of monthly installments currently due according to
    ///         the immutable 30-day schedule, capped at 12.
    function duePayments() public view returns (uint8) {
        uint64 start = presale.presaleStart();

        if (start == 0 || block.timestamp < uint256(start) + PAYMENT_INTERVAL) {
            return 0;
        }

        uint256 elapsedPeriods =
            (block.timestamp - uint256(start)) / PAYMENT_INTERVAL;

        if (elapsedPeriods > MAX_PAYMENTS) {
            elapsedPeriods = MAX_PAYMENTS;
        }

        return uint8(elapsedPeriods);
    }

    function nextPaymentTimestamp() external view returns (uint256) {
        if (paymentsReleased >= MAX_PAYMENTS) return 0;

        return
            uint256(presale.presaleStart()) +
            (uint256(paymentsReleased) + 1) *
            PAYMENT_INTERVAL;
    }

    /// @notice Permissionless trigger. Each call releases exactly one due
    ///         installment to the permanently locked recipient.
    function release() external nonReentrant {
        if (paymentsReleased >= MAX_PAYMENTS) {
            revert AllPaymentsReleased();
        }

        uint64 start = presale.presaleStart();
        if (start == 0) revert PresaleNotStarted();

        if (duePayments() <= paymentsReleased) {
            revert PaymentNotDue();
        }

        uint256 balance = usdt.balanceOf(address(this));
        if (balance < PAYMENT_AMOUNT) {
            revert InsufficientUSDT(balance, PAYMENT_AMOUNT);
        }

        paymentsReleased += 1;
        usdt.safeTransfer(RECIPIENT, PAYMENT_AMOUNT);

        emit MonthlyPaymentReleased(
            paymentsReleased,
            RECIPIENT,
            PAYMENT_AMOUNT,
            block.timestamp
        );
    }

    function remainingPayments() external view returns (uint8) {
        return MAX_PAYMENTS - paymentsReleased;
    }

    /// @notice Maximum budget across all 12 installments.
    /// @dev This amount is informational and is NOT required upfront.
    ///      The vault may be funded incrementally from Treasury USDT inflows.
    function requiredFullFunding() external view returns (uint256) {
        return PAYMENT_AMOUNT * MAX_PAYMENTS;
    }
}

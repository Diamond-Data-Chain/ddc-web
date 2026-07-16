// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/// @notice Append-only on-chain DDC Token / purchase record registry.
/// @dev DDC Token records are not the ERC-20 DDC Coin and have no supply.
contract DDCPresaleRecorder is Ownable {
    struct Purchase {
        uint256 ddcAmount;
        address payAsset;
        uint256 payAmount;
        uint8 payMethod; // 0 = USDT, 1 = native BNB
        bytes32 memoHash;
        bytes32 sourceRef;
        uint64 ts;
    }

    address public writer;

    mapping(bytes32 => mapping(address => Purchase[]))
        private _userPurchases;

    mapping(bytes32 => Purchase[])
        private _globalPurchases;

    mapping(bytes32 => mapping(address => uint256))
        private _totalDDC;

    mapping(bytes32 => mapping(address => uint256))
        private _totalUSDT;

    mapping(bytes32 => mapping(address => uint256))
        private _totalBNB;

    mapping(bytes32 => mapping(bytes32 => bool))
        public recordedSourceRef;

    event WriterUpdated(address indexed writer);

    event PurchaseRecorded(
        bytes32 indexed projectId,
        address indexed user,
        uint256 ddcAmount,
        address indexed payAsset,
        uint256 payAmount,
        uint8 payMethod,
        bytes32 memoHash,
        bytes32 sourceRef,
        uint64 ts
    );

    modifier onlyWriter() {
        require(msg.sender == writer, "not writer");
        _;
    }

    constructor(
        address owner_,
        address writer_
    ) Ownable(owner_) {
        require(writer_ != address(0), "zero writer");
        writer = writer_;
        emit WriterUpdated(writer_);
    }

    function setWriter(address writer_)
        external
        onlyOwner
    {
        require(writer_ != address(0), "zero writer");
        writer = writer_;
        emit WriterUpdated(writer_);
    }

    function recordPurchase(
        bytes32 projectId,
        address user,
        uint256 ddcAmount,
        address payAsset,
        uint256 payAmount,
        uint8 payMethod,
        bytes32 memoHash,
        bytes32 sourceRef,
        uint64 ts
    ) external onlyWriter {
        require(projectId != bytes32(0), "zero project");
        require(user != address(0), "zero user");
        require(ddcAmount > 0, "zero ddc");
        require(payMethod <= 1, "bad payment method");
        require(sourceRef != bytes32(0), "zero source");
        require(
            !recordedSourceRef[projectId][sourceRef],
            "source already recorded"
        );

        recordedSourceRef[projectId][sourceRef] = true;

        Purchase memory purchase = Purchase({
            ddcAmount: ddcAmount,
            payAsset: payAsset,
            payAmount: payAmount,
            payMethod: payMethod,
            memoHash: memoHash,
            sourceRef: sourceRef,
            ts: ts
        });

        _userPurchases[projectId][user].push(purchase);
        _globalPurchases[projectId].push(purchase);

        _totalDDC[projectId][user] += ddcAmount;

        if (payMethod == 0) {
            _totalUSDT[projectId][user] += payAmount;
        } else {
            _totalBNB[projectId][user] += payAmount;
        }

        emit PurchaseRecorded(
            projectId,
            user,
            ddcAmount,
            payAsset,
            payAmount,
            payMethod,
            memoHash,
            sourceRef,
            ts
        );
    }

    function getUserPresaleTotals(
        bytes32 projectId,
        address user
    )
        external
        view
        returns (
            uint256 ddc,
            uint256 usdt,
            uint256 bnb
        )
    {
        return (
            _totalDDC[projectId][user],
            _totalUSDT[projectId][user],
            _totalBNB[projectId][user]
        );
    }

    function getUserPurchaseCount(
        bytes32 projectId,
        address user
    ) external view returns (uint256) {
        return _userPurchases[projectId][user].length;
    }

    function getGlobalPurchaseCount(
        bytes32 projectId
    ) external view returns (uint256) {
        return _globalPurchases[projectId].length;
    }

    function listUserPurchases(
        bytes32 projectId,
        address user,
        uint256 offset,
        uint256 limit
    ) external view returns (Purchase[] memory items) {
        Purchase[] storage rows =
            _userPurchases[projectId][user];

        return _slice(rows, offset, limit);
    }

    function listGlobalPurchases(
        bytes32 projectId,
        uint256 offset,
        uint256 limit
    ) external view returns (Purchase[] memory items) {
        Purchase[] storage rows =
            _globalPurchases[projectId];

        return _slice(rows, offset, limit);
    }

    function _slice(
        Purchase[] storage rows,
        uint256 offset,
        uint256 limit
    ) internal view returns (Purchase[] memory items) {
        uint256 length = rows.length;

        if (offset >= length || limit == 0) {
            return new Purchase[](0);
        }

        uint256 end = offset + limit;

        if (end > length) {
            end = length;
        }

        items = new Purchase[](end - offset);

        for (uint256 i = offset; i < end; i++) {
            items[i - offset] = rows[i];
        }
    }
}

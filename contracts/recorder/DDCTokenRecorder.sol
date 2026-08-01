// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/// @notice Universal append-only registry for DDC Token records.
/// @dev DDC Tokens are non-transferable data records, not the DDC Coin.
contract DDCTokenRecorder is Ownable {
    struct Record {
        uint256 recordNumber;
        bytes32 projectId;
        bytes32 category;
        bytes32 sourceId;
        bytes32 contentHash;
        bytes32 previousContentHash;
        bytes32 verificationReportHash;
        bytes32 metadataHash;
        uint256 previousRecordNumber;
        address creator;
        uint64 observedAt;
        uint64 recordedAt;
    }

    uint256 public nextRecordNumber = 1;

    mapping(address => bool) public writers;
    mapping(uint256 => Record) private _records;
    mapping(bytes32 => uint256[]) private _projectRecords;
    mapping(bytes32 => uint256[]) private _sourceRecords;

    mapping(bytes32 => mapping(bytes32 => uint256))
        public recordNumberByContentHash;

    event WriterUpdated(
        address indexed writer,
        bool allowed
    );

    event DDCRecordRegistered(
        uint256 indexed recordNumber,
        bytes32 indexed projectId,
        bytes32 indexed category,
        bytes32 sourceId,
        bytes32 contentHash,
        bytes32 previousContentHash,
        bytes32 verificationReportHash,
        bytes32 metadataHash,
        uint256 previousRecordNumber,
        address creator,
        uint64 observedAt,
        uint64 recordedAt
    );

    modifier onlyWriter() {
        require(writers[msg.sender], "not writer");
        _;
    }

    constructor(
        address owner_,
        address initialWriter_
    ) Ownable(owner_) {
        require(initialWriter_ != address(0), "zero writer");

        writers[initialWriter_] = true;

        emit WriterUpdated(
            initialWriter_,
            true
        );
    }

    function setWriter(
        address writer_,
        bool allowed
    ) external onlyOwner {
        require(writer_ != address(0), "zero writer");

        writers[writer_] = allowed;

        emit WriterUpdated(
            writer_,
            allowed
        );
    }

    function registerRecord(
        bytes32 projectId,
        bytes32 category,
        bytes32 sourceId,
        bytes32 contentHash,
        bytes32 previousContentHash,
        bytes32 verificationReportHash,
        bytes32 metadataHash,
        uint256 previousRecordNumber,
        uint64 observedAt
    )
        external
        onlyWriter
        returns (uint256 recordNumber)
    {
        require(projectId != bytes32(0), "zero project");
        require(category != bytes32(0), "zero category");
        require(sourceId != bytes32(0), "zero source");
        require(contentHash != bytes32(0), "zero content hash");
        require(
            verificationReportHash != bytes32(0),
            "zero report hash"
        );
        require(observedAt > 0, "zero observed time");

        require(
            recordNumberByContentHash[projectId][contentHash] == 0,
            "content already registered"
        );

        if (previousRecordNumber == 0) {
            require(
                previousContentHash == bytes32(0),
                "unexpected previous hash"
            );
        } else {
            Record storage previous =
                _records[previousRecordNumber];

            require(
                previous.recordNumber != 0,
                "previous record missing"
            );

            require(
                previous.projectId == projectId,
                "previous project mismatch"
            );

            require(
                previous.sourceId == sourceId,
                "previous source mismatch"
            );

            require(
                previous.contentHash ==
                    previousContentHash,
                "previous hash mismatch"
            );
        }

        recordNumber = nextRecordNumber;
        nextRecordNumber = recordNumber + 1;

        uint64 recordedAt =
            uint64(block.timestamp);

        Record memory record = Record({
            recordNumber: recordNumber,
            projectId: projectId,
            category: category,
            sourceId: sourceId,
            contentHash: contentHash,
            previousContentHash:
                previousContentHash,
            verificationReportHash:
                verificationReportHash,
            metadataHash: metadataHash,
            previousRecordNumber:
                previousRecordNumber,
            creator: msg.sender,
            observedAt: observedAt,
            recordedAt: recordedAt
        });

        _records[recordNumber] = record;

        _projectRecords[projectId].push(
            recordNumber
        );

        _sourceRecords[sourceId].push(
            recordNumber
        );

        recordNumberByContentHash[
            projectId
        ][contentHash] = recordNumber;

        emit DDCRecordRegistered(
            recordNumber,
            projectId,
            category,
            sourceId,
            contentHash,
            previousContentHash,
            verificationReportHash,
            metadataHash,
            previousRecordNumber,
            msg.sender,
            observedAt,
            recordedAt
        );
    }

    function getRecord(
        uint256 recordNumber
    ) external view returns (Record memory) {
        require(
            _records[recordNumber].recordNumber != 0,
            "record missing"
        );

        return _records[recordNumber];
    }

    function projectRecordCount(
        bytes32 projectId
    ) external view returns (uint256) {
        return _projectRecords[projectId].length;
    }

    function sourceRecordCount(
        bytes32 sourceId
    ) external view returns (uint256) {
        return _sourceRecords[sourceId].length;
    }

    function projectRecords(
        bytes32 projectId,
        uint256 offset,
        uint256 limit
    ) external view returns (uint256[] memory) {
        return _slice(
            _projectRecords[projectId],
            offset,
            limit
        );
    }

    function sourceRecords(
        bytes32 sourceId,
        uint256 offset,
        uint256 limit
    ) external view returns (uint256[] memory) {
        return _slice(
            _sourceRecords[sourceId],
            offset,
            limit
        );
    }

    function _slice(
        uint256[] storage values,
        uint256 offset,
        uint256 limit
    ) internal view returns (uint256[] memory) {
        uint256 length = values.length;

        if (offset >= length || limit == 0) {
            return new uint256[](0);
        }

        uint256 end = offset + limit;

        if (end > length) {
            end = length;
        }

        uint256[] memory result =
            new uint256[](end - offset);

        for (
            uint256 i = offset;
            i < end;
            i++
        ) {
            result[i - offset] = values[i];
        }

        return result;
    }
}

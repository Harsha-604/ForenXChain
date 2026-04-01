// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract EvidenceStore {
    struct Evidence {
        string caseId;
        string fileHash;
        string fileName;
        string fileType;
        uint256 timestamp;
        address uploadedBy;
    }

    // Now mapping a unique ID (CaseID + Hash) to the Evidence struct
    mapping(string => Evidence) public evidences;
    uint256 public totalEvidence;

    event EvidenceStored(string indexed caseId, string fileHash, address indexed uploadedBy);

    function storeEvidence(string memory _caseId, string memory _fileHash, string memory _fileName, string memory _fileType) public {
        // Create a unique ID for this specific file in this case
        string memory evidenceId = string(abi.encodePacked(_caseId, "_", _fileHash));
        
        // Ensure this exact file hasn't been added to this case already
        require(bytes(evidences[evidenceId].fileHash).length == 0, "Evidence already exists on-chain");

        evidences[evidenceId] = Evidence({
            caseId: _caseId,
            fileHash: _fileHash,
            fileName: _fileName,
            fileType: _fileType,
            timestamp: block.timestamp,
            uploadedBy: msg.sender
        });

        totalEvidence++;
        emit EvidenceStored(_caseId, _fileHash, msg.sender);
    }

    // Helper functions
    function evidenceExists(string memory _caseId, string memory _fileHash) public view returns (bool) {
        string memory evidenceId = string(abi.encodePacked(_caseId, "_", _fileHash));
        return bytes(evidences[evidenceId].fileHash).length > 0;
    }

    function getTotalEvidence() public view returns (uint256) {
        return totalEvidence;
    }
}

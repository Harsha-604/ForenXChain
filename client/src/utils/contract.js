// client/src/utils/contract.js

export const CONTRACT_ADDRESS = "0xbF808A6702471938922eCD74c2Bc0C1f23096C4F";

export const CONTRACT_ABI = [
  "function storeEvidence(string _caseId, string _fileHash, string _fileName, string _fileType) public",
  "function getEvidence(string _caseId) public view returns (string, string, string, string, uint256, address)",
  "function verifyEvidence(string _caseId, string _hashToVerify) public returns (bool)",
  "function evidenceExists(string _caseId) public view returns (bool)",
  "function getTotalEvidence() public view returns (uint256)"
];

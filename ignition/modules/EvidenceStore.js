const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("EvidenceStoreModule", (m) => {
  const store = m.contract("EvidenceStore");

  return { store };
});

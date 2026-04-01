require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.19",
  networks: {
    ganache: {
      url: "http://127.0.0.1:7545",
      accounts: ["0xe15596c9f638058d72a5661053aebbc4608a641ea073dec9eb5806bb2d0ecfb8"]
    }
  }
};
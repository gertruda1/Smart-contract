const HDWalletProvider = require("@truffle/hdwallet-provider");
const mnemonic = "scale apology toddler grid joy elite fat follow poet this gain often";
module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // for more about customizing your Truffle configuration!
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    },
    develop: {
      port: 8545
    },
    ropsten: {
      provider: function() {
        return new HDWalletProvider(mnemonic, "https://ropsten.infura.io/v3/96c4613e24914d8ebbc51bfa3bb0d93d")
      },
      network_id: 3
    }
  }
};